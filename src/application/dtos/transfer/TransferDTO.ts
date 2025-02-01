export interface CreateTransferDTO {
  amount: number;
  issuerId: string;
  receiverId: string;
  type: 1 | 2;
}

export interface TransferResponseDTO {
  id: string;
  type: 1 | 2;
  amount: number;
  issuerId: string;
  createdAt: Date;
  updatedAt: Date;
}

