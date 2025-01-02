export interface IColowSoService {
  loadMasterAccount(masterId: string, amount: number): Promise<void>;
  getAllTransactions(): Promise<any[]>;
  getAllTransfers(): Promise<any[]>;
  getAllClaims(): Promise<any[]>;
  getMastersData(): Promise<any[]>;
  getPartnersData(): Promise<any[]>;
  getAllCardLoads(): Promise<any[]>;
}