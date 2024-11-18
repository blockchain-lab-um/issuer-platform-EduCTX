import { secp256k1 } from '@noble/curves/secp256k1';
import { p256 } from '@noble/curves/p256';
import { randomBytes } from 'node:crypto';
import { util } from '@cef-ebsi/ebsi-did-resolver';

const main = async () => {
  // Generate random private key
  const k1PrivateKey = secp256k1.utils.randomPrivateKey();
  const p256PrivateKey = p256.utils.randomPrivateKey();

  // Generate random ebsi identifier
  const subjectIdentifierBytes = randomBytes(16);
  const did = util.createDid(subjectIdentifierBytes);
  console.log(`
  ==================================== DID ===================================
  Subject Identifier: ${Buffer.from(subjectIdentifierBytes).toString('hex')}
  DID: ${did}`);

  // Generate public key from private key
  const k1PublicKey = secp256k1.getPublicKey(k1PrivateKey);
  const p256PublicKey = p256.getPublicKey(p256PrivateKey);
  console.log(`
  ============================== ES256K Keypair ==============================
  Private key: ${Buffer.from(k1PrivateKey).toString('hex')}
  Public key: ${Buffer.from(k1PublicKey).toString('hex')}

  ============================== ES256 Keypair ===============================
  Private key: ${Buffer.from(p256PrivateKey).toString('hex')}
  Public key: ${Buffer.from(p256PublicKey).toString('hex')}`);

  process.exit(0);
};

main().catch((error) => {});
