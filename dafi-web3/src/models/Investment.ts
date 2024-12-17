import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IAsset } from './Asset';

export interface IInvestment extends Document {
    investor: Schema.Types.ObjectId | IUser;
    asset: Schema.Types.ObjectId | IAsset;
    amount: number;
    shares: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    transactionHash: string;
    returns: {
        expected: number;
        actual: number;
        lastDistribution: Date;
    };
    performance: {
        roi: number;
        apr: number;
        duration: number;
    };
    dates: {
        invested: Date;
        maturity?: Date;
        exitRequested?: Date;
    };
    risk: {
        score: number;
        level: 'low' | 'medium' | 'high';
        factors: string[];
    };
    metadata: {
        strategy: string;
        notes?: string;
        tags: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
    investor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    asset: {
        type: Schema.Types.ObjectId,
        ref: 'Asset',
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    shares: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending',
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true,
    },
    returns: {
        expected: {
            type: Number,
            required: true,
            default: 0,
        },
        actual: {
            type: Number,
            default: 0,
        },
        lastDistribution: {
            type: Date,
        },
    },
    performance: {
        roi: {
            type: Number,
            default: 0,
        },
        apr: {
            type: Number,
            default: 0,
        },
        duration: {
            type: Number,
            default: 0,
        },
    },
    dates: {
        invested: {
            type: Date,
            required: true,
            default: Date.now,
        },
        maturity: {
            type: Date,
        },
        exitRequested: {
            type: Date,
        },
    },
    risk: {
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
        level: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true,
        },
        factors: [{
            type: String,
        }],
    },
    metadata: {
        strategy: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
        },
        tags: [{
            type: String,
        }],
    },
}, {
    timestamps: true,
});

// Indexes
InvestmentSchema.index({ investor: 1, asset: 1 });
InvestmentSchema.index({ status: 1 });
InvestmentSchema.index({ 'dates.invested': 1 });
InvestmentSchema.index({ 'performance.roi': 1 });
InvestmentSchema.index({ 'risk.score': 1 });

// Virtual fields
InvestmentSchema.virtual('daysActive').get(function() {
    return Math.floor((Date.now() - this.dates.invested.getTime()) / (1000 * 60 * 60 * 24));
});

// Methods
InvestmentSchema.methods.calculateReturns = async function() {
    // Calculate returns based on asset performance
    const asset = await mongoose.model('Asset').findById(this.asset);
    if (!asset) return 0;

    const currentValue = this.shares * asset.financials.currentValue;
    this.returns.actual = currentValue - this.amount;
    this.performance.roi = (this.returns.actual / this.amount) * 100;
    
    // Calculate APR
    const daysActive = this.daysActive;
    this.performance.apr = (this.performance.roi / daysActive) * 365;

    await this.save();
    return this.returns.actual;
};

export const Investment = mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);
