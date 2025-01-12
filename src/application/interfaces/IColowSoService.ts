export interface IColowSoService {
  loadMasterAccount(receiverId: string, amount: number, issuerId: string, type: 1 | 2): Promise<void>;
  getAllTransactions(): Promise<any[]>;
  getAllTransfers(): Promise<any[]>;
  getAllClaims(): Promise<any[]>;
  getMastersData(): Promise<any[]>;
  getPartnersData(): Promise<any[]>;
  getAllCardLoads(): Promise<any[]>;
}