import { useQuery } from '@tanstack/react-query';

type VerificationDefinition = {
  id: string;
  name: string;
};

export const useGetVerificationDefinitions = () => {
  return useQuery<VerificationDefinition[]>({
    queryKey: ['verificationDefinitions'],
    queryFn: async () => {
      // Fetch data from API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/interop-test/verification-definitions`,
        {
          method: 'GET',
        },
      );

      const data = await response.json();

      return data as VerificationDefinition[];
    },
  });
};
