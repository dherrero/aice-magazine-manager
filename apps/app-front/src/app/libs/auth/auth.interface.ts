export interface AuthConfig {
  idpServer: string;
}

export interface Login {
  email: string;
  password: string;
  remember: boolean;
}
