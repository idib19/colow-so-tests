import { CardLoad } from '../entities/CardLoad';

export const getCardLoadsByIssuerId = async (issuerId: string) => {
  return CardLoad.find({ issuerId })
    .sort({ createdAt: -1 })
    .exec();
};


export const calculateTotalCardLoadAmount = async (issuerId: string) => {
  const cardLoads = await CardLoad.find({ issuerId });
  
  // Sum up the amounts using JavaScript reduce
  const total = cardLoads.reduce((sum, cardLoad) => sum + cardLoad.amount, 0);
  
  return total;
};