import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export function withPageAuthRequired(
  getServerSidePropsFunc?: GetServerSideProps
): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    try {
      // TODO: Implement actual authentication check
      const isAuthenticated = true; // Replace with actual auth check

      if (!isAuthenticated) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }

      if (getServerSidePropsFunc) {
        return await getServerSidePropsFunc(context);
      }

      return {
        props: {},
      };
    } catch (error) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  };
}
