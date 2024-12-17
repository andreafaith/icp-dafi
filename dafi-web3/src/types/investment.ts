export interface Investment {
  id: string;
  farmId: string;
  farmName: string;
  investorId: string;
  status: 'Active' | 'Pending' | 'Completed';
  initialInvestment: number;
  currentValue: number;
  startDate: string;
  duration: number;
  nextPayoutDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  returns: {
    projected: number;
    actual: number;
    history: {
      date: string;
      amount: number;
      type: 'Dividend' | 'Capital Gain';
    }[];
  };
  metrics: {
    roi: number;
    volatility: number;
    sharpeRatio: number;
  };
  documents: {
    title: string;
    url: string;
    type: 'Contract' | 'Report' | 'Certificate';
    date: string;
  }[];
  notifications: {
    id: string;
    date: string;
    type: 'Info' | 'Warning' | 'Success';
    message: string;
    read: boolean;
  }[];
}
