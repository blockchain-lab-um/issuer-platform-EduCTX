export const testCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
  ],
  type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
  credentialSubject: {
    accomplishmentType: 'ProgramCompletionCertificate',
    learnerName: 'John Doe',
    achievement: 'Introduction to Blockchain',
    courseProvider: 'Serto',
    id: 'did:example:123',
  },
};
