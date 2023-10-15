export interface JWTProof {
  jwt: string;
}

export type Proof = JWTProof;

export interface ProofOfPossesionArgs {
  proof?: Proof;
}
