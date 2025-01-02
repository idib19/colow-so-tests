export interface LoadMasterAccountDTO {
  masterId: string;
  amount: number;
}

export interface MetricsResponseDTO {
  transactionCount: number;
  totalTransactionAmount: number;
  transferCount: number;
  totalTransferAmount: number;
  cardLoadCount: number;
  totalCardLoadAmount: number;
}