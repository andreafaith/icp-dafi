export interface Farm {
  id: string;
  name: string;
  location: string;
  size: number;
  cropType: string;
  expectedYield: number;
  imageUrl?: string;
  status: 'Active' | 'Pending' | 'Completed';
  currentFunding: number;
  targetFunding: number;
  owner: string;
  description: string;
  documents: {
    title: string;
    url: string;
    type: string;
  }[];
  metrics: {
    soilQuality: number;
    waterAvailability: number;
    weatherRisk: number;
    historicalYield: number;
  };
  timeline: {
    date: string;
    event: string;
    description: string;
  }[];
  returns: {
    projected: number;
    actual: number;
    history: {
      date: string;
      amount: number;
    }[];
  };
}
