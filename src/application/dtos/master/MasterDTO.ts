export interface CreateMasterDTO {
  country: string;
  assignedUserId?: string;
}

export interface MasterResponseDTO {
  id: string;
  country: string;
  balance: number;
  assignedUserId?: string;
  partnersList: string[];
  totalCommission: number;
  createdAt: Date;
  updatedAt: Date;
}