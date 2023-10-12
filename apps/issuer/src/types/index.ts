export interface JWTProof {
  proof_type: 'jwt';
  jwt: string;
}

export type Proof = JWTProof;

export interface ProofOfPossesionArgs {
  proof?: Proof;
  cNonce?: string;
  cNonceExpiresIn?: number;
}