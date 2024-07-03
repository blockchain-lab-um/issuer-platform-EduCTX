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

export interface UserSessionsTable {
  id: string;
  user_pin: string;
  created_at: string;
  expires_in: string;
  c_nonce: string;
  c_nonce_expires_in: string;
  credentials: string[];
  claims: string;
}
