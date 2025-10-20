export interface SupplierRegistrationData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  businessType: string;
  productsServices: string;
  yearsInBusiness: string;
  annualRevenue?: string;
  numberOfEmployees?: string;
  certifications?: string;
  taxId: string;
  additionalInfo?: string;
}

export const supplierService = {
  /**
   * Register a new supplier
   */
  register: async (data: SupplierRegistrationData): Promise<any> => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("Name", data.companyName);
      formData.append("CompanyType", "2"); // 2 = Supplier
      formData.append("Country", data.country);
      formData.append("Email", data.email);
      formData.append("Phone", data.phone);
      formData.append("TaxNumber", data.taxId);
      formData.append("ContactPerson", data.contactPerson);
      formData.append("StreetAddress", data.address);
      formData.append("City", data.city);
      formData.append("PostalCode", data.postalCode);
      formData.append("BusinessType", data.businessType);
      formData.append("YearsInBusiness", data.yearsInBusiness);
      formData.append("OfferAtProducts", data.productsServices);

      // Optional fields
      if (data.website) {
        formData.append("Website", data.website);
      }
      if (data.annualRevenue) {
        formData.append("AnnualRevenue", data.annualRevenue);
      }
      if (data.numberOfEmployees) {
        formData.append("NumberOfEmployees", data.numberOfEmployees);
      }
      if (data.certifications) {
        formData.append("Certifications", data.certifications);
      }
      if (data.additionalInfo) {
        formData.append("AdditionalComments", data.additionalInfo);
      }

      // Set initial status as PendingReview (1)
      formData.append("SupplierStatus", "1");

      // Send to Next.js API route (which will forward to backend)
      const response = await fetch("/api/suppliers", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error formats from the API
        let errorMessage = "Failed to register supplier";

        if (result.details) {
          try {
            const detailsObj = typeof result.details === 'string' ? JSON.parse(result.details) : result.details;
            if (detailsObj.Errors && Array.isArray(detailsObj.Errors)) {
              errorMessage = detailsObj.Errors.join(", ");
            } else {
              errorMessage = result.details;
            }
          } catch {
            errorMessage = result.details;
          }
        } else if (result.error) {
          errorMessage = result.error;
        }

        throw new Error(errorMessage);
      }

      return result;
    } catch (error) {
      console.error("Supplier registration error:", error);
      throw error;
    }
  },
};
