export interface AuthConfig {
  idpServer: string;
  pingUrl?: string;
}

export interface Login {
  email: string;
  password: string;
  remember: boolean;
}
