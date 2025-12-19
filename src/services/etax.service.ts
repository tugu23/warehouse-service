import axios from 'axios';
import logger from '../utils/logger';

interface ETaxOrganizationInfo {
  regno: string;
  name: string;
  address?: string;
  vatPayer?: boolean;
  status?: string;
}

interface ETaxApiResponse {
  status: string;
  data?: {
    regno: string;
    name: string;
    address?: string;
    vatRegistered?: boolean;
    status?: string;
  };
  message?: string;
}

/**
 * Fetch organization information from Mongolia's e-Tax API
 * API Documentation: https://developer.itc.gov.mn/docs/etax-api/nqh4bo7fueesg-bajguullagyn-medeelel-avah
 */
export const getOrganizationInfo = async (
  registrationNumber: string
): Promise<ETaxOrganizationInfo | null> => {
  try {
    // Clean registration number (remove spaces, dashes)
    const cleanRegno = registrationNumber.replace(/[\s-]/g, '');

    // Validate format (7-digit registration number)
    if (!/^\d{7}$/.test(cleanRegno)) {
      logger.warn(`Invalid registration number format: ${registrationNumber}`);
      return null;
    }

    logger.info(`Fetching organization info from e-Tax API for regno: ${cleanRegno}`);

    // Call Mongolia e-Tax API
    const response = await axios.get<ETaxApiResponse>(
      `https://api.ebarimt.mn/api/info/check/getTinInfo`,
      {
        params: {
          regno: cleanRegno,
        },
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (response.data && response.data.data) {
      const orgData = response.data.data;
      
      logger.info(`Successfully fetched organization info: ${orgData.name}`);

      return {
        regno: orgData.regno,
        name: orgData.name,
        address: orgData.address || undefined,
        vatPayer: orgData.vatRegistered || false,
        status: orgData.status || 'active',
      };
    }

    logger.warn(`No organization found for regno: ${cleanRegno}`);
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        logger.warn(`Organization not found in e-Tax system: ${registrationNumber}`);
      } else {
        logger.error(`e-Tax API error: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    } else {
      logger.error(`Error fetching organization info: ${error}`);
    }
    return null;
  }
};

/**
 * Validate if registration number exists in e-Tax system
 */
export const validateRegistrationNumber = async (
  registrationNumber: string
): Promise<boolean> => {
  const info = await getOrganizationInfo(registrationNumber);
  return info !== null;
};

