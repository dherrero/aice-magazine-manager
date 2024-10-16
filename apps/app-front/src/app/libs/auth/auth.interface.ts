export interface AuthConfig {
  idpServer: string;
  pingUrl?: string;
  loginPath?: string;
  authOnAppStart?: boolean;
}

export interface Login {
  email: string;
  password: string;
  remember: boolean;
}

export interface TokenDecoded {
  id: BufferSource;
  email: string;
  permision: string[];
  remember: boolean;
  iat: number;
  exp: number;
}

export interface ChallengeDTO {
  challengeBase64: string;
  credentialIdBase64: string;
}

export interface CredentialData {
  rawId: number[];
  challenge: string;
}
