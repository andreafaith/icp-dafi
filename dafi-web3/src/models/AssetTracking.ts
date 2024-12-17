import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface IAssetTracking extends Document {
  assetId: Types.ObjectId;
  eventType: 'location' | 'status' | 'metrics' | 'maintenance' | 'transfer';
  data: {
    location?: {
      latitude: number;
      longitude: number;
      altitude?: number;
      accuracy?: number;
    };
    metrics?: {
      temperature?: number;
      humidity?: number;
      soilMoisture?: number;
      ph?: number;
      nutrients?: {
        nitrogen?: number;
        phosphorus?: number;
        potassium?: number;
      };
    };
    status?: {
      condition: string;
      health: number;
      alerts: string[];
    };
    maintenance?: {
      type: string;
      description: string;
      cost: number;
      technician: string;
    };
    transfer?: {
      from: string;
      to: string;
      transactionHash: string;
    };
  };
  source: 'iot' | 'blockchain' | 'manual' | 'system';
  timestamp: Date;
  metadata: Record<string, any>;
}

const AssetTrackingSchema = new Schema<IAssetTracking>(
  {
    assetId: {
      type: Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['location', 'status', 'metrics', 'maintenance', 'transfer'],
      required: true,
    },
    data: {
      location: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
      },
      metrics: {
        temperature: Number,
        humidity: Number,
        soilMoisture: Number,
        ph: Number,
        nutrients: {
          nitrogen: Number,
          phosphorus: Number,
          potassium: Number,
        },
      },
      status: {
        condition: String,
        health: Number,
        alerts: [String],
      },
      maintenance: {
        type: String,
        description: String,
        cost: Number,
        technician: String,
      },
      transfer: {
        from: String,
        to: String,
        transactionHash: String,
      },
    },
    source: {
      type: String,
      enum: ['iot', 'blockchain', 'manual', 'system'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
AssetTrackingSchema.index({ assetId: 1, timestamp: -1 });
AssetTrackingSchema.index({ assetId: 1, eventType: 1 });
AssetTrackingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

// Static method to get latest tracking data
AssetTrackingSchema.statics.getLatestByAsset = async function(assetId: string) {
  return this.findOne({ assetId })
    .sort({ timestamp: -1 })
    .lean();
};

// Static method to get tracking history
AssetTrackingSchema.statics.getHistory = async function(
  assetId: string,
  startDate: Date,
  endDate: Date
) {
  return this.find({
    assetId,
    timestamp: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ timestamp: 1 })
    .lean();
};

// Method to check if alert should be triggered
AssetTrackingSchema.methods.shouldTriggerAlert = function() {
  if (this.eventType === 'metrics') {
    const { temperature, humidity, soilMoisture } = this.data.metrics || {};
    return (
      (temperature && (temperature < 10 || temperature > 35)) ||
      (humidity && (humidity < 30 || humidity > 70)) ||
      (soilMoisture && (soilMoisture < 20 || soilMoisture > 80))
    );
  }
  return false;
};

export const AssetTrackingModel = mongoose.models.AssetTracking || 
  mongoose.model<IAssetTracking>('AssetTracking', AssetTrackingSchema);
