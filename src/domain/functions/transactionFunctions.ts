import { Transaction } from '../entities/Transaction';
import { Types } from 'mongoose';

export const getTransactionsByIssuerId = async (issuerId: string) => {
  return Transaction.find({ issuerId: new Types.ObjectId(issuerId) })
    .sort({ createdAt: -1 })
    .exec();
};

export const calculateTotalTransactionAmount = async (issuerId: string) => {
  const result = await Transaction.aggregate([
    { $match: { issuerId: new Types.ObjectId(issuerId) } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total || 0;
};