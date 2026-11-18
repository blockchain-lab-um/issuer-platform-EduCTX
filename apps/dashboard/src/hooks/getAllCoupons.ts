import { useQuery } from '@tanstack/react-query';

type Coupon = { id: string; name: string; description: string };

export const useGetAllCoupons = () => {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      // Fetch data from API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupons/`,
        {
          method: 'GET',
        },
      );

      const data = await response.json();

      return data.coupons;
    },
    refetchInterval: 0,
    refetchOnWindowFocus: false,
  });
};
