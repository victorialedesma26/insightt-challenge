import 'express-serve-static-core';
import { AuthUser } from '../shared/types/auth';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthUser;
  }
}
