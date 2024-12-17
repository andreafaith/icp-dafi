import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FormattedMessage, useIntl } from 'react-intl';
import { PortfolioOverview } from './PortfolioOverview';
import { InvestmentOpportunities } from './InvestmentOpportunities';
import { ActiveInvestments } from './ActiveInvestments';
import { YieldMetrics } from './YieldMetrics';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorAlert } from '../shared/ErrorAlert';
import { useInvestorData } from '../../hooks/useInvestorData';
import { useWeb3Provider } from '../../lib/web3/hooks/useWeb3Provider';

export function InvestorDashboard() {
  const intl = useIntl();
  const { address } = useWeb3Provider();
  const { data: investorData, isLoading, error } = useInvestorData(address);

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
          id: 'investor.dashboard.error.title',
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
          id="investor.dashboard.welcome"
          defaultMessage="Welcome, {name}"
          values={{ name: investorData?.name }}
        />
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortfolioOverview
          portfolio={investorData?.portfolio}
          className="lg:col-span-2"
        />

        <InvestmentOpportunities
          opportunities={investorData?.opportunities}
          onInvest={() => {}}
        />

        <ActiveInvestments
          investments={investorData?.activeInvestments}
          onManageInvestment={() => {}}
        />
      </div>

      <YieldMetrics
        metrics={investorData?.yieldMetrics}
        className="lg:col-span-2"
      />
    </div>
  );
}
