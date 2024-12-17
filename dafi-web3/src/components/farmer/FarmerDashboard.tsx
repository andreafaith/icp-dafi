import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FormattedMessage, useIntl } from 'react-intl';
import { AssetOverview } from './AssetOverview';
import { LoanRequests } from './LoanRequests';
import { WeatherContracts } from './WeatherContracts';
import { YieldStats } from './YieldStats';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorAlert } from '../shared/ErrorAlert';
import { useFarmerData } from '../../hooks/useFarmerData';
import { useWeb3Provider } from '../../lib/web3/hooks/useWeb3Provider';

export function FarmerDashboard() {
  const intl = useIntl();
  const { address } = useWeb3Provider();
  const { data: farmerData, isLoading, error } = useFarmerData(address);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        title={intl.formatMessage({
          id: 'farmer.dashboard.error.title',
          defaultMessage: 'Error loading dashboard',
        })}
        message={error.message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        <FormattedMessage
          id="farmer.dashboard.welcome"
          defaultMessage="Welcome, {name}"
          values={{ name: farmerData?.name }}
        />
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AssetOverview
          assets={farmerData?.assets}
          className="lg:col-span-2"
        />

        <LoanRequests
          loans={farmerData?.loans}
          onLoanRequest={() => {}}
        />

        <WeatherContracts
          contracts={farmerData?.weatherContracts}
          onContractCreate={() => {}}
        />
      </div>

      <YieldStats
        stats={farmerData?.yieldStats}
        className="lg:col-span-2"
      />
    </div>
  );
}
