import { apiFetch } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";

export type BureauMockItem = {
  _id: string;
  phoneNumber: string;
  scenario: string;
  provider: string;
  description: string;
  wecreditDecile: number;
  noOfDPD: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  wecreditAutoRejection: number;
  wecreditLoanAmount: number;
  used?: boolean;
};

export type BureauMockResponse = {
  success: boolean;
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  data: BureauMockItem[];
};

export type PanMockResponseData = {
  pan: string;
  type: string;
  reference_id: string;
  verification_id: string;
  status: string;
  name_pan_card: string;
  registered_name: string;
  date_of_birth: string;
  father_name: string;
  masked_aadhaar_number: string;
  mobile_number: string | null;
  aadhaar_linked: boolean;
  address: {
    full_address: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  message: string;
  gender: string;
  status_code: number;
  success: boolean;
};

export type PanMockItem = {
  _id: string;
  panNumber: string;
  isActive: boolean;
  mockResponse: {
    data: PanMockResponseData;
  };
  used?: boolean;
};

export type PanMockResponse = {
  success: boolean;
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  data: PanMockItem[];
};

/**
 * Fetches all bureau mock data from the admin API.
 */
export async function getBureauMockData(): Promise<BureauMockResponse> {
  return apiFetch<BureauMockResponse>(
    endpointPath(API_ENDPOINTS.admin.getBureauMocks),
    { method: "GET", useMockProxy: true }
  );
}

/**
 * Fetches all PAN mock data from the admin API.
 */
export async function getPanMockData(): Promise<PanMockResponse> {
  return apiFetch<PanMockResponse>(
    endpointPath(API_ENDPOINTS.admin.getPanMocks),
    { method: "GET", useMockProxy: true }
  );
}
