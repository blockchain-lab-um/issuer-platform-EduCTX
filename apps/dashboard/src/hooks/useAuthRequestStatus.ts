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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/status/${authRequestId}`,
        {
          method: 'GET',
        },
      );

      if (response.status === 404) {
        return {
          status: 'Pending',
        } as AuthRequestStatus;
      }

      const data = await response.json();

      console.log(data);

      return data as AuthRequestStatus;
    },
    enabled: !!authRequestId && !disabled,
    refetchInterval: 2000,
  });
};
