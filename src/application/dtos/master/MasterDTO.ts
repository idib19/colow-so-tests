export interface CreateMasterDTO {
  country: string;
}

export interface MasterResponseDTO {
  id: string;
  country: string;
  balance: number;
  partnersList: string[];
  totalCommission: number;
  createdAt: Date;
  updatedAt: Date;
}