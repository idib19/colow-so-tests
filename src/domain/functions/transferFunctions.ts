import { Transfer } from '../entities/Transfer';

export const getTransfersByIssuerId = async (issuerId: string) => {
  return Transfer.find({ issuerId })
    .sort({ createdAt: -1 })
    .exec();
};

export const calculateTotalTransferAmount = async (issuerId: string) => {
  const result = await Transfer.aggregate([
    { $match: { issuerId: issuerId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total || 0;
};