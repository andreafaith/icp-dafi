import { Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AssetModel } from '../models/Asset';
import { Investment } from '../models/Investment';

export class TokenizationService {
    private assetActor: Actor;
    private investmentActor: Actor;

    constructor(assetActor: Actor, investmentActor: Actor) {
        this.assetActor = assetActor;
        this.investmentActor = investmentActor;
    }

    async tokenizeAsset(asset: any) {
        try {
            // Create the asset on-chain
            const tokenData = {
                name: asset.name,
                symbol: `DAFI-${asset.type.toUpperCase()}`,
                totalSupply: BigInt(asset.totalShares),
                metadata: {
                    assetType: asset.type,
                    location: asset.location,
                    description: asset.description,
                    imageUrl: asset.imageUrl,
                },
            };

            // Call the asset canister to create the token
            const result = await this.assetActor.createToken(tokenData);

            // Update the asset in MongoDB with token information
            await AssetModel.findByIdAndUpdate(asset._id, {
                tokenId: result.tokenId,
                contractAddress: result.contractAddress,
                status: 'tokenized',
            });

            return result;
        } catch (error) {
            console.error('Failed to tokenize asset:', error);
            throw error;
        }
    }

    async mintShares(assetId: string, shares: number, recipient: Principal) {
        try {
            // Mint new shares for the asset
            const result = await this.assetActor.mintShares({
                assetId,
                shares: BigInt(shares),
                recipient,
            });

            return result;
        } catch (error) {
            console.error('Failed to mint shares:', error);
            throw error;
        }
    }

    async transferShares(
        from: Principal,
        to: Principal,
        assetId: string,
        shares: number
    ) {
        try {
            // Transfer shares between principals
            const result = await this.assetActor.transferShares({
                from,
                to,
                assetId,
                shares: BigInt(shares),
            });

            return result;
        } catch (error) {
            console.error('Failed to transfer shares:', error);
            throw error;
        }
    }

    async getAssetShares(assetId: string, principal: Principal) {
        try {
            // Get the number of shares owned by a principal
            const shares = await this.assetActor.getShares(assetId, principal);
            return shares;
        } catch (error) {
            console.error('Failed to get asset shares:', error);
            throw error;
        }
    }

    async calculateAssetValue(assetId: string) {
        try {
            // Get the current value of the asset
            const value = await this.assetActor.getAssetValue(assetId);
            
            // Update the asset value in MongoDB
            await AssetModel.findOneAndUpdate(
                { tokenId: assetId },
                { 'financials.currentValue': Number(value) }
            );

            return value;
        } catch (error) {
            console.error('Failed to calculate asset value:', error);
            throw error;
        }
    }

    async distributeReturns(assetId: string, amount: number) {
        try {
            // Get all investments for this asset
            const investments = await Investment.find({
                asset: assetId,
                status: 'active',
            });

            // Calculate total shares
            const totalShares = investments.reduce((acc, inv) => acc + inv.shares, 0);

            // Distribute returns proportionally
            for (const investment of investments) {
                const share = investment.shares / totalShares;
                const returnAmount = amount * share;

                // Update investment returns
                investment.returns.actual += returnAmount;
                investment.returns.lastDistribution = new Date();
                await investment.save();

                // Transfer returns to investor
                await this.investmentActor.distributeReturns({
                    investmentId: investment._id.toString(),
                    amount: BigInt(Math.floor(returnAmount)),
                    recipient: Principal.fromText(investment.investor.toString()),
                });
            }

            return true;
        } catch (error) {
            console.error('Failed to distribute returns:', error);
            throw error;
        }
    }

    async getAssetMetrics(assetId: string) {
        try {
            const [totalSupply, marketCap, holders] = await Promise.all([
                this.assetActor.getTotalSupply(assetId),
                this.assetActor.getMarketCap(assetId),
                this.assetActor.getHolders(assetId),
            ]);

            return {
                totalSupply: Number(totalSupply),
                marketCap: Number(marketCap),
                holders: holders.map(h => ({
                    principal: h.principal.toString(),
                    shares: Number(h.shares),
                })),
            };
        } catch (error) {
            console.error('Failed to get asset metrics:', error);
            throw error;
        }
    }
}
