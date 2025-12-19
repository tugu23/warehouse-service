import { Request, Response, NextFunction } from 'express';
import { getOrganizationInfo } from '../services/etax.service';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';

/**
 * Get organization information by registration number from e-Tax API
 * @route GET /api/etax/organization/:regno
 */
export const getOrganizationByRegno = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { regno } = req.params;

    if (!regno) {
      throw new AppError('Регистрийн дугаар оруулна уу', 400);
    }

    logger.info(`Fetching organization info for regno: ${regno}`);

    const organizationInfo = await getOrganizationInfo(regno);

    if (!organizationInfo) {
      res.status(404).json({
        status: 'error',
        message: 'Байгууллагын мэдээлэл олдсонгүй. Регистрийн дугаараа шалгана уу.',
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        organization: organizationInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

