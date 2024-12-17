import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface IAsset extends Document {
  tokenId: string;
  name: string;
  type: 'farm' | 'crop' | 'equipment';
  owner: Types.ObjectId;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
  metadata: Record<string, any>;
  history: Array<{
    event: string;
    data: Record<string, any>;
    timestamp: Date;
  }>;
  tracking: {
    lastUpdate: Date;
    temperature?: number;
    humidity?: number;
    soilMoisture?: number;
    weatherConditions?: string;
  };
  financials: {
    purchasePrice: number;
    currentValue: number;
    revenueGenerated: number;
    maintenanceCosts: number;
  };
  documents: Array<{
    type: string;
    url: string;
    hash: string;
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['farm', 'crop', 'equipment'],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      altitude: Number,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    history: [
      {
        event: String,
        data: Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tracking: {
      lastUpdate: {
        type: Date,
        default: Date.now,
      },
      temperature: Number,
      humidity: Number,
      soilMoisture: Number,
      weatherConditions: String,
    },
    financials: {
      purchasePrice: {
        type: Number,
        required: true,
      },
      currentValue: {
        type: Number,
        required: true,
      },
      revenueGenerated: {
        type: Number,
        default: 0,
      },
      maintenanceCosts: {
        type: Number,
        default: 0,
      },
    },
    documents: [
      {
        type: String,
        url: String,
        hash: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
AssetSchema.index({ type: 1, status: 1 });
AssetSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
AssetSchema.index({ 'tracking.lastUpdate': 1 });

// Middleware to update tracking.lastUpdate
AssetSchema.pre('save', function(next) {
  if (this.isModified('tracking')) {
    this.tracking.lastUpdate = new Date();
  }
  next();
});

// Virtual for asset age
AssetSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Method to calculate ROI
AssetSchema.methods.calculateROI = function() {
  const totalRevenue = this.financials.revenueGenerated;
  const totalCosts = this.financials.purchasePrice + this.financials.maintenanceCosts;
  return ((totalRevenue - totalCosts) / totalCosts) * 100;
};

export const AssetModel = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
