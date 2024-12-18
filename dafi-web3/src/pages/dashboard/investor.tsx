import React from 'react';
import { InvestorDashboard } from '../../components/investors/InvestorDashboard';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

const InvestorDashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not an investor
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'investor')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <InvestorDashboard />
    </DashboardLayout>
  );
};

export default InvestorDashboardPage;
