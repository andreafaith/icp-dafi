import mongoose, { Schema, Document } from 'mongoose';
import { ILocation } from './common.types';

export interface IWeatherDerivative extends Document {
  contractId: string;
  contractAddress: string;
  type: 'drought' | 'flood' | 'frost' | 'excess_rain';
  status: 'active' | 'expired' | 'triggered' | 'settled';
  location: ILocation;
  coverage: {
    startDate: Date;
    endDate: Date;
    premium: number;
    coverageAmount: number;
    trigger: {
      condition: string;
      threshold: number;
      unit: string;
    };
    payout: {
      calculation: string;
      maxAmount: number;
      currency: string;
    };
  };
  oracle: {
    provider: string;
    dataSource: string;
    updateFrequency: string;
    lastUpdate: Date;
    measurements: Array<{
      timestamp: Date;
      value: number;
      unit: string;
    }>;
  };
  participants: Array<{
    did: string;
    role: 'insured' | 'insurer';
    stake: number;
    premiumPaid: number;
    payoutReceived: number;
  }>;
  claims: Array<{
    claimId: string;
    timestamp: Date;
    claimant: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    evidence: Array<{
      type: string;
      url: string;
      timestamp: Date;
    }>;
  }>;
  audit: {
    createdBy: string;
    createdAt: Date;
    modifications: Array<{
      timestamp: Date;
      modifier: string;
      changes: Record<string, any>;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WeatherDerivativeSchema = new Schema<IWeatherDerivative>({
  contractId: { type: String, required: true, unique: true },
  contractAddress: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['drought', 'flood', 'frost', 'excess_rain'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'triggered', 'settled'], 
    required: true 
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
  },
  coverage: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    premium: { type: Number, required: true },
    coverageAmount: { type: Number, required: true },
    trigger: {
      condition: { type: String, required: true },
      threshold: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    payout: {
      calculation: { type: String, required: true },
      maxAmount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
  },
  oracle: {
    provider: { type: String, required: true },
    dataSource: { type: String, required: true },
    updateFrequency: { type: String, required: true },
    lastUpdate: { type: Date, required: true },
    measurements: [{
      timestamp: { type: Date, required: true },
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    }],
  },
  participants: [{
    did: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['insured', 'insurer'], 
      required: true 
    },
    stake: { type: Number, required: true },
    premiumPaid: { type: Number, required: true },
    payoutReceived: { type: Number, required: true },
  }],
  claims: [{
    claimId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    claimant: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'paid'], 
      required: true 
    },
    evidence: [{
      type: { type: String, required: true },
      url: { type: String, required: true },
      timestamp: { type: Date, required: true },
    }],
  }],
  audit: {
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true },
    modifications: [{
      timestamp: { type: Date, required: true },
      modifier: { type: String, required: true },
      changes: { type: Schema.Types.Mixed, required: true },
    }],
  },
}, { timestamps: true });

// Indexes
WeatherDerivativeSchema.index({ contractId: 1 });
WeatherDerivativeSchema.index({ contractAddress: 1 });
WeatherDerivativeSchema.index({ type: 1 });
WeatherDerivativeSchema.index({ status: 1 });
WeatherDerivativeSchema.index({ location: '2dsphere' });
WeatherDerivativeSchema.index({ 'coverage.startDate': 1, 'coverage.endDate': 1 });
WeatherDerivativeSchema.index({ 'participants.did': 1 });

export default mongoose.models.WeatherDerivative || mongoose.model<IWeatherDerivative>('WeatherDerivative', WeatherDerivativeSchema);
