// src/custom.d.ts
import 'multer';

declare global {
  namespace Express {
    export interface Request {
      file?: Multer.File;
    }
  }
}