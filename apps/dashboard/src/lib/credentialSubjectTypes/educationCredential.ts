export type EducationCredentialType = {
  currentFamilyName: string;
  currentGivenName: string;
  dateOfBirth?: string;
  personIdentifier?: string;
  achieved: {
    id: string;
    title: string;
    specifiedBy: {
      id?: string;
      title: string;
      volumeOfLearning?: string;
      iSCEDFCode?: string;
      eCTSCreditPoints?: number;
    };
    wasAwardedBy: {
      id?: string;
      awardingBody: string;
      awardingBodyDescription: string;
      awardingDate?: string;
      awardingLocation?: string;
    };
    wasDerivedFrom: {
      id?: string;
      title: string;
      grade: string;
      issuedDate?: string;
    };
    associatedLearningOpportunity?: string;
  };
};
