import { secp256k1 } from '@noble/curves/secp256k1';
import { p256 } from '@noble/curves/p256';

const main = async () => {
  // Key type is first argument
  const keyType = process.argv[2]; // ES256 | ES256K

  // Generate random private key
  const privateKey =
    keyType === 'ES256K'
      ? secp256k1.utils.randomPrivateKey()
      : p256.utils.randomPrivateKey();

  // Generate public key from private key
  const publicKey =
    keyType === 'ES256K'
      ? secp256k1.getPublicKey(privateKey)
      : p256.getPublicKey(privateKey);

  console.log(`Private key: ${Buffer.from(privateKey).toString('hex')}`);
  console.log(`Public key: ${Buffer.from(publicKey).toString('hex')}`);

  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
