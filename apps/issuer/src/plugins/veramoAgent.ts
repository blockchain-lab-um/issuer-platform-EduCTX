import {
  EbsiDIDProvider,
  ebsiDidResolver,
} from '@blockchain-lab-um/did-provider-ebsi';
import {
  KeyDIDProvider,
  getDidKeyResolver as keyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  OIDCRPPlugin,
  type IOIDCRPPlugin,
} from '@blockchain-lab-um/oidc-rp-plugin';
import {
  type AbstractDataStore,
  DataManager,
  MemoryDataStore,
} from '@blockchain-lab-um/veramo-datamanager';
import {
  createAgent,
  type ICredentialIssuer,
  type ICredentialVerifier,
  type IDataStore,
  type IDIDManager,
  type IIdentifier,
  type IKeyManager,
  type IResolver,
  type MinimalImportableKey,
  type TAgent,
} from '@veramo/core';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  type AbstractIdentifierProvider,
  DIDManager,
  MemoryDIDStore,
} from '@veramo/did-manager';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import type { FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import {
  SUPPORTED_CREDENTIALS,
  SUPPORTED_CURVES,
  SUPPORTED_DID_METHODS,
  SUPPORTED_DIGITAL_SIGNATURES,
} from '../config.js';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    ICredentialIssuer &
    ICredentialVerifier &
    IOIDCRPPlugin
>;

declare module 'fastify' {
  export interface FastifyInstance {
    veramoAgent: Agent;
    issuerIdentifier: IIdentifier;
  }
}

async function createVeramoAgent() {
  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractDataStore> = {};

  didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'local' });
  didProviders['did:ebsi'] = new EbsiDIDProvider({ defaultKms: 'local' });

  vcStorePlugins.memory = new MemoryDataStore();

  return createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      ICredentialIssuer &
      ICredentialVerifier &
      IOIDCRPPlugin
  >({
    plugins: [
      new CredentialPlugin(),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DataManager({ store: vcStorePlugins }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...keyDidResolver(),
          ...ebsiDidResolver(),
        }),
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'metamask',
        providers: didProviders,
      }),
      new OIDCRPPlugin({
        url: 'http://localhost:3001/oidc',
        supported_curves: SUPPORTED_CURVES,
        supported_did_methods: SUPPORTED_DID_METHODS,
        supported_digital_signatures: SUPPORTED_DIGITAL_SIGNATURES,
        supported_credentials: SUPPORTED_CREDENTIALS,
      }),
    ],
  });
}

export default fp<FastifyPluginOptions>(async (fastify, _opts) => {
  const agent = await createVeramoAgent();
  let identifier: IIdentifier;

  if (process.env.EBSI_PRIVATE_KEY && process.env.EBSI_ID) {
    identifier = await agent.didManagerCreate({
      provider: 'did:ebsi',
      alias: 'ebsi',
      kms: 'local',
      options: {
        bearer: process.env.EBSI_BEARER_TOKEN,
        privateKeyHex: process.env.EBSI_PRIVATE_KEY,
        keyType: 'P-256',
        id: process.env.EBSI_ID,
      },
    });

    console.log(`Your issuer EBSI did is: ${identifier.did}`);
  } else {
    await agent.didManagerImport({
      did: `did:key:${process.env.ISSUER_ADDRESS}`,
      provider: 'did:key',
      controllerKeyId: 'primary',
      alias: 'issuer-primary',
      keys: [
        {
          kid: 'primary',
          type: 'Secp256k1',
          kms: 'local',
          privateKeyHex: process.env.ISSUER_PRIVATE_KEY,
        } as MinimalImportableKey,
      ],
    });

    identifier = await agent.didManagerGetByAlias({
      alias: 'issuer-primary',
      provider: 'did:key',
    });
  }

  if (!identifier) throw new Error('Cannot generate valid identifier');

  fastify.decorate('veramoAgent', agent);
  fastify.decorate('issuerIdentifier', identifier);
});
