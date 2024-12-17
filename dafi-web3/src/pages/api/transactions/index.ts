import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db/mongodb';
import { authMiddleware } from '../../../middleware/auth';
import { Transaction } from '../../../models/Transaction';
import { TransactionService } from '../../../services/TransactionService';
import { SecurityMonitor } from '../../../services/SecurityMonitor';
import { rateLimit } from '../../../middleware/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();
        await rateLimit(req, res);
        await authMiddleware(req, res, () => {});

        switch (req.method) {
            case 'GET':
                return await getTransactions(req, res);
            case 'POST':
                return await createTransaction(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Transaction API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getTransactions(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {
            from,
            to,
            type,
            status,
            asset,
            startDate,
            endDate,
            sort = '-timestamp',
            page = 1,
            limit = 10,
        } = req.query;

        const query: any = {};
        if (from) query.from = from;
        if (to) query.to = to;
        if (type) query.type = type;
        if (status) query.status = status;
        if (asset) query['asset.tokenId'] = asset;
        
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate as string);
            if (endDate) query.timestamp.$lte = new Date(endDate as string);
        }

        const transactions = await Transaction.find(query)
            .sort(sort as string)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Transaction.countDocuments(query);

        // Get on-chain details for each transaction
        const transactionService = new TransactionService(
            req.assetActor,
            req.investmentActor
        );

        const transactionsWithDetails = await Promise.all(
            transactions.map(async (tx) => {
                const onChainDetails = await transactionService.getTransactionDetails(
                    tx.transactionHash
                );
                return {
                    ...tx.toObject(),
                    onChainDetails,
                };
            })
        );

        return res.status(200).json({
            transactions: transactionsWithDetails,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
}

async function createTransaction(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {
            type,
            from,
            to,
            asset,
            amount,
            metadata,
        } = req.body;

        if (!type || !from || !to || !asset || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Initialize services
        const transactionService = new TransactionService(
            req.assetActor,
            req.investmentActor
        );
        const securityMonitor = new SecurityMonitor();

        // Calculate fees
        const fees = await transactionService.calculateTransactionFees(amount);

        // Create transaction
        const transaction = new Transaction({
            type,
            from,
            to,
            asset,
            amount,
            fees,
            status: 'pending',
            metadata,
            timestamp: new Date(),
        });

        await transaction.save();

        // Process transaction on-chain
        const result = await transactionService.processTransaction(
            transaction.transactionHash
        );

        // Monitor transaction for security
        await securityMonitor.monitorTransactions(transaction);

        return res.status(201).json({
            transaction,
            onChainResult: result,
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        return res.status(500).json({ error: 'Failed to create transaction' });
    }
}
