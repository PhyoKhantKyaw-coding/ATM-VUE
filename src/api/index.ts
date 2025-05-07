import * as products from './products';
import * as login from './login';
import * as user from './users';
import * as register from './register';
import * as transfer from './transfer';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Interface for the decoded JWT token
interface JwtPayload {
  nameid?: string;
  name?: string;
  upn?: string;
  [key: string]: unknown;
}

class API {
  products = products;
  user = user;
  transfer = transfer;
  login = login;
  register = register;

  getUserIdFromToken = (): string | null => {
    const token = Cookies.get('token');
    if (!token) {
      console.error('No JWT token found in cookies (expected cookie: "token").');
      return null;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Decoded JWT:', decoded);

      const userId = typeof decoded.nameid === 'string' && decoded.nameid.trim() !== '' ? decoded.nameid : null;

      if (!userId) {
        console.error('User ID not found in token claims (checked: "nameid").');
      }

      return userId;
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  };
}

const api = new API();
export default api;