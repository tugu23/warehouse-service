import axios from 'axios';
import logger from '../utils/logger';

interface ETaxOrganizationInfo {
  regno: string;
  tin: string;
  name: string;
  address?: string;
  vatPayer?: boolean;
  status?: string;
}

interface EbarimtTinLookupResponse {
  status?: number;
  msg?: string;
  data?: string | number;
}

interface EbarimtInfoLookupResponse {
  status?: number;
  msg?: string;
  data?: {
    name?: string;
    address?: string;
    vatpayer?: boolean;
  };
  message?: string;
}

const EBARIMT_CHECK_API = 'https://api.ebarimt.mn/api/info/check';

const isTinLike = (value: string) => /^\d{10,12}$/.test(value);
const isOrgRegLike = (value: string) =>
  /^\d{7}$/.test(value) || /^[A-Z\u0410-\u042f\u0401\u04e8\u04ae]{2}\d{8}$/.test(value);

const fetchOrganizationByTin = async (
  tin: string,
  regnoForLog: string
): Promise<ETaxOrganizationInfo | null> => {
  const infoResponse = await axios.get<EbarimtInfoLookupResponse>(`${EBARIMT_CHECK_API}/getInfo`, {
    params: { tin },
    timeout: 10000,
    headers: {
      Accept: 'application/json',
    },
    validateStatus: () => true,
  });

  if (infoResponse.data?.status !== 200) {
    logger.warn(`No organization info found for TIN: ${tin}`, {
      regno: regnoForLog,
      response: infoResponse.data,
    });
    return null;
  }

  const orgData = infoResponse.data.data;
  const name = orgData?.name?.trim() || '';

  if (!name) {
    logger.warn(`Organization name missing for TIN: ${tin}`, {
      regno: regnoForLog,
      response: infoResponse.data,
    });
    return null;
  }

  return {
    regno: regnoForLog,
    tin,
    name,
    address: orgData?.address || undefined,
    vatPayer: orgData?.vatpayer || false,
    status: 'active',
  };
};

export const getOrganizationInfo = async (
  registrationNumber: string
): Promise<ETaxOrganizationInfo | null> => {
  try {
    const cleanRegno = registrationNumber.replace(/[\s-]/g, '').toUpperCase();

    if (!isTinLike(cleanRegno) && !isOrgRegLike(cleanRegno)) {
      logger.warn(`Invalid registration number format: ${registrationNumber}`);
      return null;
    }

    logger.info(`Fetching organization info from e-Tax API for regno: ${cleanRegno}`);

    if (isTinLike(cleanRegno)) {
      return fetchOrganizationByTin(cleanRegno, cleanRegno);
    }

    const tinResponse = await axios.get<EbarimtTinLookupResponse>(`${EBARIMT_CHECK_API}/getTinInfo`, {
      params: { regNo: cleanRegno },
      timeout: 10000,
      headers: {
        Accept: 'application/json',
      },
      validateStatus: () => true,
    });

    if (tinResponse.data?.status !== 200 || !tinResponse.data?.data) {
      logger.warn(`No TIN found for regno: ${cleanRegno}`, {
        response: tinResponse.data,
      });
      return null;
    }

    const tin = String(tinResponse.data.data).trim();
    const organization = await fetchOrganizationByTin(tin, cleanRegno);
    if (organization) {
      logger.info(`Successfully fetched organization info: ${organization.name}`, {
        regno: cleanRegno,
        tin,
      });
    }
    return organization;
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

export const validateRegistrationNumber = async (
  registrationNumber: string
): Promise<boolean> => {
  const info = await getOrganizationInfo(registrationNumber);
  return info !== null;
};
