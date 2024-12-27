import { useQuery } from '@tanstack/react-query';

type AuthRequestStatus =
  | {
      status: 'Success';
      data: string;
    }
  | {
      status: 'Failed';
      error: string;
    }
  | {
      status: 'Pending';
    };

export const useAuthRequestStatus = (
  authRequestId: string,
  disabled?: boolean,
) => {
  return useQuery<AuthRequestStatus>({
    queryKey: ['authRequestStatus', authRequestId],
    queryFn: async () => {
      // Fetch data from API
      console.log('Fetching auth request status');
      return {
        status: 'Pending', // Replace with actual data
      } as AuthRequestStatus;
    },
    enabled: !!authRequestId && !disabled,
    refetchInterval: 2000,
  });
};
