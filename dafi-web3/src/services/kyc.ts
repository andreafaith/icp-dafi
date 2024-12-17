import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../declarations/kyc/kyc.did';

export type DocumentType = 'passport' | 'national_id' | 'driving_license';
export type UserType = 'farmer' | 'investor';

export interface KYCDocument {
  file: File;
  type: DocumentType;
}

export interface KYCData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  userType: UserType;
}

export interface KYCVerificationResult {
  status: 'pending' | 'approved' | 'rejected';
  documentId: string;
  message?: string;
}

class KYCService {
  private agent: HttpAgent;
  private actor: any;

  constructor() {
    this.agent = new HttpAgent({
      host: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943',
    });

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: process.env.NEXT_PUBLIC_KYC_CANISTER_ID!,
    });
  }

  async uploadDocument(userId: string, document: KYCDocument): Promise<string> {
    try {
      const buffer = await document.file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const result = await this.actor.uploadDocument(
        userId,
        { [document.type]: null },
        Array.from(bytes)
      );

      return result.id;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  async submitKYC(
    data: KYCData,
    documents: KYCDocument[]
  ): Promise<KYCVerificationResult> {
    try {
      // Upload all documents first
      const documentIds = await Promise.all(
        documents.map(doc => this.uploadDocument(data.firstName + data.lastName, doc))
      );

      // Submit KYC data
      const kycId = await this.actor.submitKYC({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        address: data.address,
        userType: { [data.userType]: null },
        documents: documentIds,
        status: { pending: null },
        verifiedAt: [],
      });

      return {
        status: 'pending',
        documentId: kycId,
      };
    } catch (error) {
      console.error('Error submitting KYC:', error);
      throw new Error('Failed to submit KYC');
    }
  }

  async getVerificationStatus(documentId: string): Promise<KYCVerificationResult> {
    try {
      const status = await this.actor.getKYCStatus(documentId);
      
      let result: KYCVerificationResult = {
        status: 'pending',
        documentId,
      };

      if ('approved' in status) {
        result.status = 'approved';
      } else if ('rejected' in status) {
        result.status = 'rejected';
        result.message = status.rejected.reason;
      }

      return result;
    } catch (error) {
      console.error('Error checking verification status:', error);
      throw new Error('Failed to check verification status');
    }
  }

  async isVerified(principal: Principal): Promise<boolean> {
    try {
      return await this.actor.isVerified(principal);
    } catch (error) {
      console.error('Error checking verification:', error);
      throw new Error('Failed to check verification');
    }
  }
}

export const kycService = new KYCService();
