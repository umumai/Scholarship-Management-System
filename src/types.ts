export enum Role {
  STUDENT = 'Student',
  REVIEWER = 'Reviewer',
  COMMITTEE = 'Scholarship Committee',
  ADMIN = 'Administrator'
}

export interface DocumentRequirement {
  category: string;
  description: string;
  isRequired: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  deadline: string;
  amount: string;
  requiredDocuments?: DocumentRequirement[];
}

export type ReviewStatus = 'Pending' | 'Submitted';

export interface ReviewScore {
  criteria: string;
  score: number;
}

export interface ReviewEvaluation {
  status: ReviewStatus;
  reviewerName: string;
  scores: ReviewScore[];
  overallScore: number;
  comments: string;
  submittedAt?: string;
  updatedAt?: string;
}

export type DocumentType = 'pdf' | 'png' | 'docx';

export interface ApplicationDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  previewUrl?: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  studentName: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Document Request' | 'Resubmitted' | 'Awarded' | 'Rejected';
  submissionDate?: string;
  assignedReviewer?: string;
  review?: ReviewEvaluation;
  documents?: ApplicationDocument[];
  documentRequestReason?: string;
  requestedDocuments?: string[];
  documentRequestedAt?: string;
  documentRequestedBy?: string;
}

