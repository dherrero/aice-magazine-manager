import { User, UserModel } from '@back/models';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  #secret = process.env.NODE_JWT_SECRET;

  login = async (email: string, password: string): Promise<UserModel> => {
    const user: UserModel = await User.findOne({ where: { email } });
    if (!user) throw new Error('Email or password incorrect.');
    const validPassword = await this.#comparePassword(password, user.password);
    if (!validPassword) throw new Error('Email or password incorrect.');
    return user;
  };

  getUser = async (id: number): Promise<UserModel> => await User.findByPk(id);

  generateToken = async (payload, expiresIn: string) => {
    return jwt.sign(payload, this.#secret, { expiresIn });
  };

  verifyToken = (token: string) => {
    return jwt.verify(token, this.#secret);
  };

  hashPassword = async (password: string) => {
    return await hash(password, process.env.NODE_HASH_SALT_ROUNDS ?? 10);
  };

  base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
  };

  base64UrlToBase64 = (base64UrlString: string): string => {
    return base64UrlString
      .replace(/-/g, '+') // Reemplaza '-' con '+'
      .replace(/_/g, '/') // Reemplaza '_' con '/'
      .padEnd(
        base64UrlString.length + ((4 - (base64UrlString.length % 4)) % 4),
        '='
      ); // Añadir relleno '=' si es necesario
  };

  arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return Buffer.from(buffer).toString('base64');
  };

  #comparePassword = async (password: string, hash: string) => {
    return await compare(password, hash);
  };
}

const authService = new AuthService();

export default authService;
