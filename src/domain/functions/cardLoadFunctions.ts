import { CardLoad } from '../entities/CardLoad';

export const getCardLoadsByIssuerId = async (issuerId: string) => {
  return CardLoad.find({ issuerId })
    .sort({ createdAt: -1 })
    .exec();
};

export const calculateTotalCardLoadAmount = async (issuerId: string) => {
  const result = await CardLoad.aggregate([
    { $match: { issuerId: issuerId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total || 0;
};