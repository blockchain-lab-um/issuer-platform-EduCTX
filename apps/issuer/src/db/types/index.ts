export interface CredentialsTable {
  id: string;
  did: string;
  credential: string;
  created_at: string;
}

export interface NoncesTable {
  did: string;
  nonce: string;
  created_at: string;
  expires_at: string;
}
