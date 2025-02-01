export interface CreatePartnerDTO {
  country: string;
  masterId: string;
  userId: string;
}

export interface PartnerResponseDTO {
  id: string;
  country: string;
  balance: number;
  masterId: string;
  totalCommission: number;
  createdAt: Date;
  updatedAt: Date;
}