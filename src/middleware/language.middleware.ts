import { Request, Response, NextFunction } from 'express';
import { getLanguage, getTranslations, Translations } from '../i18n';

// Extend Express Request type to include translations
declare global {
  namespace Express {
    interface Request {
      t: Translations;
      lang: 'mn' | 'en';
    }
  }
}

/**
 * Middleware to attach translation function to request object
 */
export const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const lang = getLanguage(req);
  req.lang = lang;
  req.t = getTranslations(lang);
  next();
};

