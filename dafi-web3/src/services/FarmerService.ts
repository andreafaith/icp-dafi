import { User } from '../models/User';
import { Asset } from '../models/Asset';
import { Investment } from '../models/Investment';
import { TokenizationService } from './TokenizationService';
import { SecurityMonitor } from './SecurityMonitor';

export class FarmerService {
    private tokenizationService: TokenizationService;
    private securityMonitor: SecurityMonitor;

    constructor(assetActor: any, investmentActor: any) {
        this.tokenizationService = new TokenizationService(assetActor, investmentActor);
        this.securityMonitor = new SecurityMonitor();
    }

    async registerFarmer(farmerData: any) {
        try {
            // Validate farmer data
            if (!farmerData.name || !farmerData.email || !farmerData.walletAddress) {
                throw new Error('Missing required fields');
            }

            // Create farmer profile
            const farmer = await User.create({
                ...farmerData,
                role: 'farmer',
                status: 'pending',
                profile: {
                    ...farmerData.profile,
                    verificationStatus: 'pending',
                    documents: [],
                },
                farming: {
                    experience: farmerData.experience,
                    certifications: farmerData.certifications || [],
                    specializations: farmerData.specializations || [],
                    landDetails: farmerData.landDetails || {},
                },
                financials: {
                    bankDetails: farmerData.bankDetails,
                    taxInfo: farmerData.taxInfo,
                },
            });

            // Monitor registration
            await this.securityMonitor.monitorUserActivity(farmer._id, {
                type: 'registration',
                role: 'farmer',
                timestamp: new Date(),
            });

            return farmer;
        } catch (error) {
            console.error('Farmer registration error:', error);
            throw error;
        }
    }

    async listAssets(farmerId: string) {
        try {
            const assets = await Asset.find({
                owner: farmerId,
                status: { $in: ['active', 'funded', 'completed'] },
            }).populate('investments');

            // Calculate metrics for each asset
            const assetsWithMetrics = await Promise.all(
                assets.map(async (asset) => {
                    const metrics = await this.calculateAssetMetrics(asset._id);
                    return {
                        ...asset.toObject(),
                        metrics,
                    };
                })
            );

            return assetsWithMetrics;
        } catch (error) {
            console.error('List assets error:', error);
            throw error;
        }
    }

    async createAsset(farmerId: string, assetData: any) {
        try {
            // Validate asset data
            if (!assetData.name || !assetData.type || !assetData.totalShares) {
                throw new Error('Missing required fields');
            }

            // Create asset
            const asset = await Asset.create({
                ...assetData,
                owner: farmerId,
                status: 'pending',
                financials: {
                    totalInvestment: 0,
                    currentValue: assetData.initialValue,
                    projectedValue: assetData.projectedValue,
                    returns: {
                        projected: assetData.projectedReturns,
                        actual: 0,
                    },
                },
                risk: {
                    score: assetData.riskScore,
                    factors: assetData.riskFactors,
                },
            });

            // Tokenize asset
            const tokenized = await this.tokenizationService.tokenizeAsset(asset);

            // Update asset with token information
            await Asset.findByIdAndUpdate(asset._id, {
                tokenId: tokenized.tokenId,
                contractAddress: tokenized.contractAddress,
                status: 'active',
            });

            return {
                ...asset.toObject(),
                tokenId: tokenized.tokenId,
                contractAddress: tokenized.contractAddress,
            };
        } catch (error) {
            console.error('Create asset error:', error);
            throw error;
        }
    }

    async updateAssetStatus(assetId: string, status: string, updates: any = {}) {
        try {
            const asset = await Asset.findByIdAndUpdate(
                assetId,
                {
                    status,
                    ...updates,
                    'timeline.lastUpdated': new Date(),
                    $push: {
                        'timeline.updates': {
                            status,
                            timestamp: new Date(),
                            details: updates.details || '',
                        },
                    },
                },
                { new: true }
            );

            return asset;
        } catch (error) {
            console.error('Update asset status error:', error);
            throw error;
        }
    }

    async calculateAssetMetrics(assetId: string) {
        try {
            const asset = await Asset.findById(assetId).populate('investments');
            const investments = await Investment.find({ asset: assetId });

            const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
            const totalShares = investments.reduce((sum, inv) => sum + inv.shares, 0);
            const actualReturns = investments.reduce(
                (sum, inv) => sum + (inv.returns?.actual || 0),
                0
            );

            const metrics = {
                totalInvestment,
                totalShares,
                availableShares: asset.totalShares - totalShares,
                currentValue: asset.financials.currentValue,
                roi: (actualReturns / totalInvestment) * 100,
                investorCount: new Set(investments.map(inv => inv.investor)).size,
                performance: {
                    actual: actualReturns,
                    projected: asset.financials.returns.projected,
                    variance: actualReturns - asset.financials.returns.projected,
                },
            };

            return metrics;
        } catch (error) {
            console.error('Calculate asset metrics error:', error);
            throw error;
        }
    }

    async getDashboardStats(farmerId: string) {
        try {
            const [assets, investments] = await Promise.all([
                Asset.find({ owner: farmerId }),
                Investment.find({ 'asset.owner': farmerId }),
            ]);

            const stats = {
                totalAssets: assets.length,
                activeAssets: assets.filter(a => a.status === 'active').length,
                totalInvestment: investments.reduce((sum, inv) => sum + inv.amount, 0),
                totalReturns: investments.reduce(
                    (sum, inv) => sum + (inv.returns?.actual || 0),
                    0
                ),
                investorCount: new Set(investments.map(inv => inv.investor)).size,
                assetPerformance: await Promise.all(
                    assets.map(asset => this.calculateAssetMetrics(asset._id))
                ),
            };

            return stats;
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    }
}
