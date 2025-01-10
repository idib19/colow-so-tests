export interface BaseRegistrationDTO {
  username: string;
  password: string;
  email: string;
  name: string;
  entityId?: string;
}

export interface MasterUserRegistrationDTO extends BaseRegistrationDTO {
  role: 'master';
  entityId?: string;
  // Add any master-specific fields
}

export interface PartnerUserRegistrationDTO extends BaseRegistrationDTO {
  role: 'partner';
  entityId?: string;
  masterId: string; // Reference to the master this partner belongs to
  // Add any partner-specific fields
}

export type RegistrationDTO = MasterUserRegistrationDTO | PartnerUserRegistrationDTO;
  