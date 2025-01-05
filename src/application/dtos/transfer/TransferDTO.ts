export interface CreateTransferDTO {
  type: 1 | 2;  // Using numeric literal type for better type safety
  amount: number;
  issuerId: string;
}

export interface TransferResponseDTO {
  id: string;
  type: 1 | 2;
  amount: number;
  issuerId: string;
  createdAt: Date;
  updatedAt: Date;
}

