import { Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import Transaction from '../models/Transaction';
import { Investment } from '../models/Investment';
import { AssetModel } from '../models/Asset';

export class TransactionService {
    private assetActor: Actor;
    private investmentActor: Actor;

    constructor(assetActor: Actor, investmentActor: Actor) {
        this.assetActor = assetActor;
        this.investmentActor = investmentActor;
    }

    async createInvestment(
        investor: Principal,
        assetId: string,
        amount: number,
        shares: number
    ) {
        try {
            // Create the investment transaction on-chain
            const investmentResult = await this.investmentActor.createInvestment({
                assetId,
                amount: BigInt(amount),
                shares: BigInt(shares),
            });

            // Create the investment record in MongoDB
            const investment = new Investment({
                investor: investor.toString(),
                asset: assetId,
                amount,
                shares,
                status: 'pending',
                transactionHash: investmentResult.transactionHash,
                returns: {
                    expected: investmentResult.expectedReturns,
                },
                risk: {
                    score: investmentResult.riskScore,
                    level: investmentResult.riskLevel,
                    factors: investmentResult.riskFactors,
                },
                metadata: {
                    strategy: 'direct-investment',
                },
            });

            await investment.save();

            // Create transaction record
            const transaction = new Transaction({
                transactionHash: investmentResult.transactionHash,
                blockNumber: investmentResult.blockNumber,
                timestamp: new Date(),
                type: 'investment',
                status: 'pending',
                from: investor.toString(),
                to: assetId,
                asset: {
                    tokenId: assetId,
                    contractAddress: investmentResult.contractAddress,
                    assetType: 'investment',
                    amount: shares,
                    price: amount / shares,
                },
                details: {
                    description: `Investment in asset ${assetId}`,
                    metadata: {
                        shares,
                        investmentId: investment._id.toString(),
                    },
                },
                fees: {
                    gas: Number(investmentResult.gasFee),
                    platform: Number(investmentResult.platformFee),
                    total: Number(investmentResult.totalFee),
                },
                audit: {
                    ipfsHash: investmentResult.ipfsHash,
                    signatures: [{
                        signer: investor.toString(),
                        signature: investmentResult.signature,
                        timestamp: new Date(),
                    }],
                },
            });

            await transaction.save();

            return {
                investment,
                transaction,
                onChainResult: investmentResult,
            };
        } catch (error) {
            console.error('Failed to create investment:', error);
            throw error;
        }
    }

    async processTransaction(transactionHash: string) {
        try {
            // Get transaction status from blockchain
            const status = await this.investmentActor.getTransactionStatus(transactionHash);

            // Update transaction in MongoDB
            const transaction = await Transaction.findOne({ transactionHash });
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            transaction.status = status.status;
            await transaction.save();

            // If transaction is completed, update related records
            if (status.status === 'completed') {
                const investment = await Investment.findOne({
                    transactionHash,
                });

                if (investment) {
                    investment.status = 'active';
                    await investment.save();

                    // Update asset metrics
                    await AssetModel.findByIdAndUpdate(investment.asset, {
                        $inc: {
                            'financials.totalInvestment': investment.amount,
                            'financials.totalShares': investment.shares,
                        },
                    });
                }
            }

            return {
                transaction,
                status,
            };
        } catch (error) {
            console.error('Failed to process transaction:', error);
            throw error;
        }
    }

    async getUserTransactions(principal: Principal) {
        try {
            // Get transactions from MongoDB
            const transactions = await Transaction.find({
                $or: [
                    { from: principal.toString() },
                    { to: principal.toString() },
                ],
            }).sort({ timestamp: -1 });

            // Get additional details from blockchain
            const transactionsWithDetails = await Promise.all(
                transactions.map(async (tx) => {
                    const onChainDetails = await this.investmentActor.getTransactionDetails(
                        tx.transactionHash
                    );

                    return {
                        ...tx.toObject(),
                        onChainDetails,
                    };
                })
            );

            return transactionsWithDetails;
        } catch (error) {
            console.error('Failed to get user transactions:', error);
            throw error;
        }
    }

    async getAssetTransactions(assetId: string) {
        try {
            // Get transactions from MongoDB
            const transactions = await Transaction.find({
                'asset.tokenId': assetId,
            }).sort({ timestamp: -1 });

            // Get additional details from blockchain
            const transactionsWithDetails = await Promise.all(
                transactions.map(async (tx) => {
                    const onChainDetails = await this.investmentActor.getTransactionDetails(
                        tx.transactionHash
                    );

                    return {
                        ...tx.toObject(),
                        onChainDetails,
                    };
                })
            );

            return transactionsWithDetails;
        } catch (error) {
            console.error('Failed to get asset transactions:', error);
            throw error;
        }
    }

    async calculateTransactionFees(amount: number) {
        try {
            const fees = await this.investmentActor.calculateFees(BigInt(amount));
            
            return {
                gasFee: Number(fees.gasFee),
                platformFee: Number(fees.platformFee),
                totalFee: Number(fees.totalFee),
            };
        } catch (error) {
            console.error('Failed to calculate transaction fees:', error);
            throw error;
        }
    }
}
