export interface CreateClaimDTO {
  transactionId: string;
  transactionIssuerId: string;
}

export interface ClaimResponseDTO {
  id: string;
  transactionId: string;
  status: 'pending' | 'resolved' | 'rejected';
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}