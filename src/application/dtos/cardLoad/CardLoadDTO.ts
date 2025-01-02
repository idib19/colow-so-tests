export interface CreateCardLoadDTO {
  issuerId: string;
  cardId: string;
  issuerModel: 'Master' | 'Partner';
  amount: number;
}

export interface CardLoadResponseDTO {
  id: string;
  issuerId: string;
  issuerModel: 'Master' | 'Partner';
  cardId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}