import {
  KeyDIDProvider,
  getDidKeyResolver as keyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  AbstractDataStore,
  DataManager,
  MemoryDataStore,
} from '@blockchain-lab-um/veramo-datamanager';
import {
  createAgent,
  ICredentialIssuer,
  ICredentialVerifier,
  IDataStore,
  IDIDManager,
  IIdentifier,
  IKeyManager,
  IResolver,
  MinimalImportableKey,
  TAgent,
} from '@veramo/core';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  AbstractIdentifierProvider,
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
import { FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    ICredentialIssuer &
    ICredentialVerifier
>;

async function createVeramoAgent() {
  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractDataStore> = {};

  didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'web3' });

  vcStorePlugins.memory = new MemoryDataStore();

  return createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      ICredentialIssuer &
      ICredentialVerifier
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
        }),
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'metamask',
        providers: didProviders,
      }),
    ],
  });
}

export default fp<FastifyPluginOptions>(async (fastify, _opts) => {
  const agent = await createVeramoAgent();
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
  const issuerIdentifier = await agent.didManagerGetByAlias({
    alias: 'issuer-primary',
    provider: 'did:key',
  });

  fastify.decorate('veramoAgent', () => agent);
  fastify.decorate('issuerIdentifier', () => issuerIdentifier);
});

declare module 'fastify' {
  export interface FastifyInstance {
    veramoAgent(): Agent;
    issuerIdentifier(): IIdentifier;
  }
}
