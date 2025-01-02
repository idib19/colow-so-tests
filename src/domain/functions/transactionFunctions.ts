import { Transaction } from '../entities/Transaction';

export const getTransactionsByIssuerId = async (issuerId: string) => {
  return Transaction.find({ issuerId })
    .sort({ createdAt: -1 })
    .exec();
};

export const calculateTotalTransactionAmount = async (issuerId: string) => {
  const result = await Transaction.aggregate([
    { $match: { issuerId: issuerId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total || 0;
};