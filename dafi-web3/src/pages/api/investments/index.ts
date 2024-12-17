import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db/mongodb';
import { authMiddleware, roleGuard } from '../../../middleware/auth';
import { Investment } from '../../../models/Investment';
import { TokenizationService } from '../../../services/TokenizationService';
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
                return await getInvestments(req, res);
            case 'POST':
                return await createInvestment(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Investment API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getInvestments(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {
            investor,
            asset,
            status,
            sort = '-createdAt',
            page = 1,
            limit = 10,
        } = req.query;

        const query: any = {};
        if (investor) query.investor = investor;
        if (asset) query.asset = asset;
        if (status) query.status = status;

        const investments = await Investment.find(query)
            .populate('investor', 'name email walletAddress')
            .populate('asset', 'name type location')
            .sort(sort as string)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Investment.countDocuments(query);

        return res.status(200).json({
            investments,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get investments error:', error);
        return res.status(500).json({ error: 'Failed to fetch investments' });
    }
}

async function createInvestment(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {
            investor,
            asset,
            amount,
            shares,
            paymentMethod,
            metadata,
        } = req.body;

        if (!investor || !asset || !amount || !shares) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Initialize services
        const tokenizationService = new TokenizationService(
            req.assetActor,
            req.investmentActor
        );
        const transactionService = new TransactionService(
            req.assetActor,
            req.investmentActor
        );
        const securityMonitor = new SecurityMonitor();

        // Create investment transaction
        const result = await transactionService.createInvestment(
            req.principal,
            asset,
            amount,
            shares
        );

        // Monitor transaction for security
        await securityMonitor.monitorTransactions(result.transaction);

        // Mint shares for the investor
        await tokenizationService.mintShares(
            asset,
            shares,
            req.principal
        );

        return res.status(201).json(result);
    } catch (error) {
        console.error('Create investment error:', error);
        return res.status(500).json({ error: 'Failed to create investment' });
    }
}
