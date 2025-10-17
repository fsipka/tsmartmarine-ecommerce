import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance without auth for public endpoints
const publicClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

interface FileObject {
  id: number;
  url: string;
  name: string;
  isDocument: boolean;
  isPrimary: boolean;
}

export interface Company {
  id: number;
  name: string;
  code: string;
  taxNumber: string | null;
  taxOffice: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  companyFiles?: FileObject[];
  companyPrimaryFile?: FileObject | null;
  createdDate: string;
  updatedDate: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  errors: string[] | null;
}

const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

export const companyService = {
  // Get company with details by ID
  getCompanyWithDetails: async (companyId: number): Promise<Company> => {
    try {
      const response = await publicClient.get<ApiResponse<Company>>(`/companies/getwithdetails/${companyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch company details:', error);
      throw error;
    }
  },

  // Extract company logo URL from company files
  getCompanyLogoUrl: (company: Company): string | null => {
    if (!company.companyFiles || company.companyFiles.length === 0) {
      return null;
    }

    // Get first file that is not a document
    const logoFile = company.companyFiles.find(file => !file.isDocument);
    if (logoFile && logoFile.url) { 
      return `${CONTENT_BASE_URL}${logoFile.url}`;
    }

    return null;
  },
};
