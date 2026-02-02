export const API_BASE_URL = 'http://127.0.0.1:8000';

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type ApiScholarship = {
  id: number;
  name: string;
  amount: string;
  deadline: string;
  description: string;
  criteria: string[];
};

export type ApiDocument = {
  id: number;
  application_id: number;
  filename: string;
  content_type: string;
  url: string;
};

export type ApiReview = {
  id: number;
  application_id: number;
  reviewer_id: number;
  reviewer_name?: string;
  scores_json: string;
  overall_score: number;
  comments: string;
  submitted_at: string;
};

export type ApiApplication = {
  id: number;
  scholarship_id: number;
  student_id: number;
  student_name?: string;
  assigned_reviewer?: string | null;
  status: string;
  submission_date: string;
  review?: ApiReview | null;
  documents?: ApiDocument[];
};

type RequestOptions = {
  method?: string;
  body?: BodyInit | null;
  token?: string | null;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ?? null,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    apiRequest<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: { name: string; email: string; password: string; role: string }) =>
    apiRequest<ApiUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: (token: string) => apiRequest<ApiUser>('/users/me', { token }),
  listScholarships: (token: string) => apiRequest<ApiScholarship[]>('/scholarships', { token }),
  createScholarship: (token: string, payload: Omit<ApiScholarship, 'id'>) =>
    apiRequest<ApiScholarship>('/scholarships', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  updateScholarship: (token: string, scholarshipId: number, payload: ApiScholarship) =>
    apiRequest<ApiScholarship>(`/scholarships/${scholarshipId}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(payload),
    }),
  deleteScholarship: (token: string, scholarshipId: number) =>
    apiRequest<void>(`/scholarships/${scholarshipId}`, { method: 'DELETE', token }),
  listApplications: (token: string) => apiRequest<ApiApplication[]>('/applications', { token }),
  submitApplication: (
    token: string,
    payload: { scholarship_id: number; status: string; submission_date: string }
  ) =>
    apiRequest<ApiApplication>('/applications', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  assignReviewer: (token: string, applicationId: number, reviewerId: number) =>
    apiRequest<ApiApplication>(`/applications/${applicationId}/assign-reviewer?reviewer_id=${reviewerId}`, {
      method: 'POST',
      token,
    }),
  submitDecision: (token: string, applicationId: number, decision: 'Awarded' | 'Rejected') =>
    apiRequest<ApiApplication>(`/applications/${applicationId}/decision?decision=${decision}`, {
      method: 'POST',
      token,
    }),
  listReviews: (token: string) => apiRequest<ApiReview[]>('/reviews', { token }),
  submitReview: (
    token: string,
    payload: {
      application_id: number;
      scores_json: string;
      overall_score: number;
      comments: string;
      submitted_at: string;
    }
  ) =>
    apiRequest<ApiReview>('/reviews', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  listUsersByRole: (token: string, role: string) =>
    apiRequest<ApiUser[]>(`/users/role/${role}`, { token }),
  listUsers: (token: string) => apiRequest<ApiUser[]>('/users', { token }),
  createUser: (token: string, payload: { name: string; email: string; password: string; role: string }) =>
    apiRequest<ApiUser>('/users', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  uploadDocument: (token: string, applicationId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<ApiDocument>(`/documents/upload?application_id=${applicationId}`, {
      method: 'POST',
      token,
      body: formData,
    });
  },
  listDocuments: (token: string, applicationId: number) =>
    apiRequest<ApiDocument[]>(`/documents/application/${applicationId}`, { token }),
};
