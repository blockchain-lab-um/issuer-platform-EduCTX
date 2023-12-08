import { randomUUID } from 'crypto';

// Script for generating an API key for the issuer app
const generateApiKey = () => {
  const uuid = randomUUID();

  // Base64 encode the UUID
  const base64 = Buffer.from(uuid).toString('base64');

  console.log(`API key: ${base64}`);
};

generateApiKey();
