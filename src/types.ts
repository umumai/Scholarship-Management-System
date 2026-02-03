export enum Role {
  STUDENT = 'Student',
  REVIEWER = 'Reviewer',
  COMMITTEE = 'Scholarship Committee',
  ADMIN = 'Administrator'
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  deadline: string;
  amount: string;
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
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Awarded' | 'Rejected';
  submissionDate?: string;
  assignedReviewer?: string;
  review?: ReviewEvaluation;
  documents?: ApplicationDocument[];
}

