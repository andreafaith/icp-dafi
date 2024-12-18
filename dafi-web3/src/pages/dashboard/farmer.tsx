import React from 'react';
import { Dashboard } from '../../components/farmers/Dashboard';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

const FarmerDashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a farmer
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'farmer')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
};

export default FarmerDashboardPage;
