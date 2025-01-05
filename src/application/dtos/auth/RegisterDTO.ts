export interface RegistrationDTO {
    username: string;
    password: string;
    email: string;
    role: 'master' | 'partner' | 'admin-colowso';
  }
  
export interface MasterRegistrationDTO extends RegistrationDTO {
    role: 'master';
}

export interface PartnerRegistrationDTO extends RegistrationDTO {
    role: 'partner';
    masterId: string;
}

export interface AdminColowsoRegistrationDTO extends RegistrationDTO {
    role: 'admin-colowso';
}
  