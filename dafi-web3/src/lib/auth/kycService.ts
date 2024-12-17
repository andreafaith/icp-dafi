import { KYCDocument, KYCStatus } from './types';
import axios from 'axios';

export class KYCService {
  private readonly KYC_PROVIDER_URL: string;
  private readonly API_KEY: string;

  constructor(providerUrl: string, apiKey: string) {
    this.KYC_PROVIDER_URL = providerUrl;
    this.API_KEY = apiKey;
  }

  async verifyDocument(document: KYCDocument): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.KYC_PROVIDER_URL}/verify-document`,
        {
          documentId: document.documentId,
          type: document.type,
          issueDate: document.issueDate,
          expiryDate: document.expiryDate,
          issuingCountry: document.issuingCountry,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.verified;
    } catch (error) {
      console.error('Document verification failed:', error);
      return false;
    }
  }

  async performAMLCheck(
    userId: string,
    documentData: KYCDocument
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.KYC_PROVIDER_URL}/aml-check`,
        {
          userId,
          documentType: documentData.type,
          documentId: documentData.documentId,
          issuingCountry: documentData.issuingCountry,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.passed;
    } catch (error) {
      console.error('AML check failed:', error);
      return false;
    }
  }

  async updateKYCStatus(
    userId: string,
    status: KYCStatus,
    verifierId?: string
  ): Promise<void> {
    try {
      await axios.put(
        `${this.KYC_PROVIDER_URL}/kyc-status`,
        {
          userId,
          status,
          verifierId,
          updatedAt: new Date().toISOString(),
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Failed to update KYC status:', error);
      throw error;
    }
  }

  validateDocumentExpiry(document: KYCDocument): boolean {
    if (!document.expiryDate) return true;
    
    const now = new Date();
    const expiryDate = new Date(document.expiryDate);
    const threeMonthsFromNow = new Date(now.setMonth(now.getMonth() + 3));
    
    return expiryDate > threeMonthsFromNow;
  }
}
