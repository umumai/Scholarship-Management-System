import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Role, Scholarship, Application, ReviewEvaluation, DocumentType } from '../types';
import { api, API_BASE_URL, ApiApplication, ApiDocument, ApiReview } from '../api';
import StudentDashboard from './dashboards/StudentDashboard';
import ReviewerDashboard from './dashboards/ReviewerDashboard';
import CommitteeDashboard from './dashboards/CommitteeDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import ProfileScreen from './screens/ProfileScreen';
import ScholarshipListScreen from './screens/ScholarshipListScreen';
import ScholarshipEditorScreen from './screens/ScholarshipEditorScreen';
import SystemLogsScreen, { SystemLogEntry } from './screens/SystemLogsScreen';
import SystemReportsScreen from './screens/SystemReportsScreen';
import AccountManagementScreen, { ManagedAccount } from './screens/AccountManagementScreen';
import ReviewerWorkspaceScreen from './screens/ReviewerWorkspaceScreen';
import DocumentResubmissionModal from './DocumentResubmissionModal';
import { ICONS } from '../constants';

const mmuLogoUrl = 'data:image/jpeg;base64,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';

type Frame =
  | 'landing'
  | 'choose-role'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'profile'
  | 'scholarship-list'
  | 'scholarship-editor'
  | 'system-logs'
  | 'system-reports'
  | 'account-management'
  | 'apply-flow';

type UserData = {
  name: string;
  email: string;
  id: string;
  program: string;
  dept: string;
  phone: string;
};

type Notification = {
  id: string;
  role: Role;
  message: string;
  createdAt: string;
  seen?: boolean;
};

type PrototypeViewerProps = {
  reviewOnly?: boolean;
  reviewApplicationId?: string;
};

const ROLE_DISPLAY_NAME: Record<Role, string> = {
  [Role.STUDENT]: 'Alex Rivera',
  [Role.REVIEWER]: 'Dr. Maya Lewis',
  [Role.COMMITTEE]: 'Prof. Arjun Nair',
  [Role.ADMIN]: 'Admin Portal',
};

const ROLE_PORTAL_LABEL: Record<Role, string> = {
  [Role.STUDENT]: 'Student Portal',
  [Role.ADMIN]: 'Administrator',
  [Role.REVIEWER]: 'Reviewer Portal',
  [Role.COMMITTEE]: 'Committee Portal',
};

const ROLE_ID_PREFIX: Record<Role, string> = {
  [Role.STUDENT]: 'STU',
  [Role.REVIEWER]: 'REV',
  [Role.COMMITTEE]: 'COM',
  [Role.ADMIN]: 'ADM',
};

const PrototypeViewer: React.FC<PrototypeViewerProps> = ({
  reviewOnly = false,
  reviewApplicationId
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [frame, setFrame] = useState<Frame>('landing');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  
  // Application Flow State
  const [activeStep, setActiveStep] = useState(0); // 0 = Identity Verification
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verifyingPassword, setVerifyingPassword] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [applicationAcademicSummary, setApplicationAcademicSummary] = useState('');
  const [applicationCGPA, setApplicationCGPA] = useState('');

  // Document Resubmission Modal State
  const [showResubmissionModal, setShowResubmissionModal] = useState(false);
  const [resubmissionApplication, setResubmissionApplication] = useState<Application | null>(null);
  const [isResubmittingDocuments, setIsResubmittingDocuments] = useState(false);

  const samplePdfDataUrl = 'data:application/pdf;base64,JVBERi0xLjQKJcKlwrHDqwoKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUuMjggODQxLjg5XS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggMTY+PnN0cmVhbQpCVAovRjEgMTIgVGYKNDAgNzAwIFRkCihNb2NrIFBERikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+CmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDk1IDAwMDAwIG4gCjAwMDAwMDAxNzIgMDAwMDAgbiAKMDAwMDAwMDI0MSAwMDAwMCBuIAowMDAwMDAwMzU5IDAwMDAwIG4gCjAwMDAwMDA0NTQgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEgMCBSL1NpemUgNj4+CnN0YXJ0eHJlZgo1NjcKJSVFT0Y=';
  const mockDocxUrl = '/documents/mock-essay.docx';

  // Backend Data
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviewers, setReviewers] = useState<{ id: string; name: string }[]>([]);
  const [managedAccounts, setManagedAccounts] = useState<ManagedAccount[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '2024-05-20 09:12',
      actorName: 'Admin Portal',
      actorRole: Role.ADMIN,
      action: 'Created scholarship',
      target: 'Future Engineers Fund',
      status: 'Success',
    },
    {
      id: 'log-2',
      timestamp: '2024-05-20 10:03',
      actorName: 'Alex Rivera',
      actorRole: Role.STUDENT,
      action: 'Submitted application',
      target: 'App #app3',
      status: 'Success',
      notes: 'Future Engineers Fund',
    },
    {
      id: 'log-3',
      timestamp: '2024-05-20 11:01',
      actorName: 'Admin Portal',
      actorRole: Role.ADMIN,
      action: 'Assigned reviewer',
      target: 'App #app1 → Dr. Maya Lewis',
      status: 'Success',
    },
    {
      id: 'log-4',
      timestamp: '2024-05-20 14:17',
      actorName: 'Dr. Maya Lewis',
      actorRole: Role.REVIEWER,
      action: 'Submitted evaluation',
      target: 'App #app1',
      status: 'Success',
    },
    {
      id: 'log-5',
      timestamp: '2024-05-21 08:33',
      actorName: 'Prof. Arjun Nair',
      actorRole: Role.COMMITTEE,
      action: 'Approved award',
      target: 'App #app1',
      status: 'Success',
    },
    {
      id: 'log-6',
      timestamp: '2024-05-21 09:12',
      actorName: 'Admin Portal',
      actorRole: Role.ADMIN,
      action: 'Created account',
      target: 'Reviewer → Prof. Lina Wei',
      status: 'Success',
    },
  ]);
  const [scholarshipDraft, setScholarshipDraft] = useState<Scholarship>({
    id: '',
    name: '',
    amount: '',
    deadline: '',
    description: '',
    criteria: [],
  });
  const [scholarshipEditorMode, setScholarshipEditorMode] = useState<'create' | 'edit'>('create');

  const reviewerDisplayName = ROLE_DISPLAY_NAME[Role.REVIEWER];

  const roleFromApi = (role: string): Role => {
    switch (role) {
      case 'student':
        return Role.STUDENT;
      case 'reviewer':
        return Role.REVIEWER;
      case 'committee':
        return Role.COMMITTEE;
      case 'admin':
        return Role.ADMIN;
      default:
        return Role.STUDENT;
    }
  };

  const roleToApi = (role: Role) => {
    switch (role) {
      case Role.REVIEWER:
        return 'reviewer';
      case Role.COMMITTEE:
        return 'committee';
      case Role.ADMIN:
        return 'admin';
      default:
        return 'student';
    }
  };

  const formatUserId = (role: Role, rawId?: number | string) => {
    const padded = String(rawId ?? 1).padStart(4, '0');
    return `${ROLE_ID_PREFIX[role]}${padded}`;
  };

  const mapDocuments = (documents?: ApiDocument[]) => {
    if (!documents) {
      return [];
    }
    return documents.map(doc => {
      const url = `${API_BASE_URL}${doc.url}`;
      const extension = doc.filename.split('.').pop()?.toLowerCase() || 'pdf';
      const type: DocumentType = (extension === 'png' || extension === 'jpg' || extension === 'jpeg')
        ? 'png'
        : extension === 'docx'
          ? 'docx'
          : 'pdf';
      return {
        id: String(doc.id),
        name: doc.filename,
        type,
        url,
        previewUrl: type === 'png' ? url : undefined,
      };
    });
  };

  const mapReview = (review?: ApiReview | null): ReviewEvaluation | undefined => {
    if (!review) {
      return undefined;
    }
    const scores = JSON.parse(review.scores_json || '[]') as { criteria: string; score: number }[];
    return {
      status: review.submitted_at ? 'Submitted' : 'Pending',
      reviewerName: review.reviewer_name ?? 'Reviewer',
      scores,
      overallScore: review.overall_score,
      comments: review.comments,
      submittedAt: review.submitted_at || undefined,
    };
  };

  const mapApplication = (application: ApiApplication): Application => {
    return {
      id: String(application.id),
      scholarshipId: String(application.scholarship_id),
      studentName: application.student_name || 'Student',
      status: application.status as Application['status'],
      submissionDate: application.submission_date || undefined,
      assignedReviewer: application.assigned_reviewer || undefined,
      review: mapReview(application.review),
      documents: mapDocuments(application.documents),
      documentRequestReason: application.document_request_reason || undefined,
      requestedDocuments: application.requested_documents ? JSON.parse(application.requested_documents) : undefined,
      documentRequestedAt: application.document_requested_at || undefined,
      documentRequestedBy: application.document_requested_by || undefined,
    };
  };

  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    id: formatUserId(Role.STUDENT, 1),
    program: 'Software Engineering',
    dept: 'Faculty of Computing',
    phone: '+1 (555) 012-3456'
  });
  const [profileDraft, setProfileDraft] = useState<UserData>(userData);
  const [passwordDraft, setPasswordDraft] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-student-1',
      role: Role.STUDENT,
      message: 'Successfully submitted an application.',
      createdAt: '2024-05-21 09:12',
      seen: false,
    },
    {
      id: 'notif-student-2',
      role: Role.STUDENT,
      message: 'Your application has been reviewed.',
      createdAt: '2024-05-21 11:01',
      seen: false,
    },
    {
      id: 'notif-reviewer-1',
      role: Role.REVIEWER,
      message: 'You have been assigned to an applicant.',
      createdAt: '2024-05-20 10:03',
      seen: false,
    },
    {
      id: 'notif-reviewer-2',
      role: Role.REVIEWER,
      message: 'Successfully reviewed and sent to the committee for approval.',
      createdAt: '2024-05-20 14:17',
      seen: false,
    },
    {
      id: 'notif-committee-1',
      role: Role.COMMITTEE,
      message: 'An applicant is ready for approval.',
      createdAt: '2024-05-21 08:33',
      seen: false,
    },
    {
      id: 'notif-admin-1',
      role: Role.ADMIN,
      message: 'New scholarship draft requires review.',
      createdAt: '2024-05-20 09:12',
      seen: false,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Helpers
  const goToDashboard = () => setFrame('dashboard');
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('sms_token');
    setIsLoggedIn(false);
    setSelectedRole(null);
    setScholarships([]);
    setApplications([]);
    setReviewers([]);
    setManagedAccounts([]);
    setFrame('landing');
  };

  const isScholarshipOpen = (deadline: string) => {
    if (!deadline) {
      return true;
    }
    const deadlineDate = new Date(`${deadline}T23:59:59`);
    if (Number.isNaN(deadlineDate.getTime())) {
      return true;
    }
    return deadlineDate >= new Date();
  };

  const filteredScholarships = useMemo(() => {
    return scholarships.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.criteria.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [scholarships, searchQuery]);

  const activeScholarships = useMemo(() => {
    return scholarships.filter(s => isScholarshipOpen(s.deadline));
  }, [scholarships]);

  const visibleScholarships = useMemo(() => {
    if (selectedRole === Role.STUDENT) {
      return filteredScholarships.filter(s => isScholarshipOpen(s.deadline));
    }
    return filteredScholarships;
  }, [filteredScholarships, selectedRole]);

  const getNextDeadline = useMemo(() => {
    const now = new Date();
    const upcomingDeadlines = activeScholarships
      .filter(s => s.deadline)
      .map(s => ({
        scholarship: s,
        deadlineDate: new Date(`${s.deadline}T23:59:59`),
      }))
      .filter(d => !Number.isNaN(d.deadlineDate.getTime()) && d.deadlineDate > now)
      .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());

    if (upcomingDeadlines.length === 0) {
      return 'No upcoming deadlines';
    }

    const nextDeadline = upcomingDeadlines[0].deadlineDate;
    const daysRemaining = Math.ceil((nextDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''}`;
  }, [activeScholarships]);

  useEffect(() => {
    if (frame === 'profile') {
      setProfileDraft(userData);
      setPasswordDraft({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [frame]);

  useEffect(() => {
    setShowNotifications(false);
  }, [frame, selectedRole]);

  useEffect(() => {
    if (frame === 'scholarship-list') {
      setSearchDraft(searchQuery);
    }
  }, [frame]);

  const applySearch = () => {
    setSearchQuery(searchDraft.trim());
  };

  const saveProfileChanges = () => {
    setUserData({ ...profileDraft });
  };

  const updateProfileDraft = (field: 'name' | 'email' | 'phone' | 'dept', value: string) => {
    setProfileDraft(prev => ({ ...prev, [field]: value }));
  };

  const updatePasswordDraft = (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    setPasswordDraft(prev => ({ ...prev, [field]: value }));
  };

  const savePasswordChanges = () => {
    if (!passwordDraft.currentPassword || !passwordDraft.newPassword || !passwordDraft.confirmPassword) {
      alert('Please complete all password fields.');
      return;
    }
    if (passwordDraft.newPassword.length < 6) {
      alert('New password must be at least 6 characters.');
      return;
    }
    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    setPasswordDraft({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    alert('Password updated successfully.');
  };

  const reviewApplication = useMemo(() => {
    if (!reviewApplicationId) {
      return null;
    }
    return applications.find(application => application.id === reviewApplicationId) || null;
  }, [applications, reviewApplicationId]);

  const reviewScholarship = useMemo(() => {
    if (!reviewApplication) {
      return null;
    }
    return scholarships.find(scholarship => scholarship.id === reviewApplication.scholarshipId) || null;
  }, [reviewApplication, scholarships]);

  const handleBackToDashboard = () => {
    navigate('/?mode=prototype&reviewerDashboard=1');
  };

  const getRoleIcon = (role: Role | null) => {
    if (!role) {
      return ICONS.Admin;
    }
    switch (role) {
      case Role.STUDENT:
        return ICONS.Student;
      case Role.REVIEWER:
        return ICONS.Reviewer;
      case Role.COMMITTEE:
        return ICONS.Committee;
      case Role.ADMIN:
        return ICONS.Admin;
      default:
        return ICONS.Admin;
    }
  };

  const showTopPanel = !isLoggedIn;

  const addNotification = (role: Role, message: string) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        message,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        seen: false,
      },
      ...prev,
    ]);
  };

  const markNotificationsAsSeen = () => {
    setNotifications(prev => 
      prev.map(notif => notif.role === selectedRole ? { ...notif, seen: true } : notif)
    );
  };

  const addSystemLog = (action: string, target: string, status: 'Success' | 'Failed' = 'Success', notes?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const actorName = userData.name || ROLE_DISPLAY_NAME[selectedRole || Role.STUDENT];
    const newLog: SystemLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp,
      actorName,
      actorRole: selectedRole || Role.STUDENT,
      action,
      target,
      status,
      notes,
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const loadDashboardData = async (token: string, userRole: Role) => {
    setIsLoadingData(true);
    try {
      const scholarshipData = await api.listScholarships(token);
      setScholarships(
        scholarshipData.map((scholarship) => ({
          id: String(scholarship.id),
          name: scholarship.name,
          amount: scholarship.amount,
          deadline: scholarship.deadline,
          description: scholarship.description,
          criteria: scholarship.criteria || [],
        }))
      );

      const applicationData = await api.listApplications(token);
      let mappedApplications = applicationData.map(mapApplication);

      if (userRole === Role.REVIEWER || userRole === Role.COMMITTEE || userRole === Role.ADMIN) {
        const reviewData = await api.listReviews(token);
        mappedApplications = mappedApplications.map((application) => {
          const review = reviewData.find((item) => String(item.application_id) === application.id);
          return {
            ...application,
            review: mapReview(review),
          };
        });
      }

      setApplications(mappedApplications);

      if (userRole === Role.COMMITTEE || userRole === Role.ADMIN) {
        const reviewerAccounts = await api.listUsersByRole(token, 'reviewer');
        setReviewers(
          reviewerAccounts.map((reviewer) => ({
            id: String(reviewer.id),
            name: reviewer.name,
          }))
        );
      }

      if (userRole === Role.ADMIN) {
        const users = await api.listUsers(token);
        const accounts = users
          .filter((user) => user.role === 'reviewer' || user.role === 'committee')
          .map((user) => ({
            id: `USR${String(user.id).padStart(4, '0')}`,
            name: user.name,
            email: user.email,
            role: (user.role === 'reviewer' ? Role.REVIEWER : Role.COMMITTEE) as Role.REVIEWER | Role.COMMITTEE,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'Active' as const,
          }));
        setManagedAccounts(accounts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadCurrentUser = async (token: string) => {
    const currentUser = await api.me(token);
    const mappedRole = roleFromApi(currentUser.role);
    setSelectedRole(mappedRole);
    setUserData((prev) => ({
      ...prev,
      name: currentUser.name,
      email: currentUser.email,
      id: formatUserId(mappedRole, currentUser.id),
    }));
    setIsLoggedIn(true);
    // Don't automatically set frame to dashboard - let user stay on current page
    // Only load dashboard data if they navigate to dashboard
    await loadDashboardData(token, mappedRole);
  };

  const handleLogin = async () => {
    setAuthError(null);
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter your email and password.');
      return;
    }
    try {
      const response = await api.login(loginEmail, loginPassword);
      setAuthToken(response.access_token);
      localStorage.setItem('sms_token', response.access_token);
      await loadCurrentUser(response.access_token);
      setFrame('dashboard');
    } catch (error) {
      setAuthError('Invalid email or password.');
    }
  };

  const handleRegister = async () => {
    setAuthError(null);
    if (!registerName || !registerEmail || !registerPassword) {
      setAuthError('Please complete all fields.');
      return;
    }
    try {
      await api.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: 'student',
      });
      alert('Account creation successful!');
      setLoginEmail(registerEmail);
      setLoginPassword('');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setFrame('login');
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message) {
        setAuthError(message);
      } else {
        setAuthError('Registration failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reviewerDashboard') === '1') {
      setSelectedRole(Role.REVIEWER);
      setUserData(prev => ({ ...prev, name: ROLE_DISPLAY_NAME[Role.REVIEWER] }));
      setIsLoggedIn(true);
      setFrame('dashboard');
    }
  }, [location.search]);

  useEffect(() => {
    setAuthError(null);
    setLoginEmail('');
    setLoginPassword('');
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
  }, [frame]);

  useEffect(() => {
    const storedToken = localStorage.getItem('sms_token');
    if (storedToken) {
      setAuthToken(storedToken);
      loadCurrentUser(storedToken).catch(() => {
        localStorage.removeItem('sms_token');
      });
    }
  }, []);

  const startApplication = (scholarship: Scholarship) => {
    if (!isScholarshipOpen(scholarship.deadline)) {
      alert('This scholarship is closed and no longer accepts applications.');
      return;
    }
    if (hasApplications(scholarship.id)) {
      alert('You have already applied to this scholarship.');
      return;
    }
    setSelectedScholarship(scholarship);
    setActiveStep(0); // Start with Identity Verification
    setUploadedFile(null);
    setVerifyingPassword('');
    setApplicationAcademicSummary('');
    setApplicationCGPA('');
    setFrame('apply-flow');
  };

  const hasApplications = (scholarshipId: string) => {
    return applications.some(application => application.scholarshipId === scholarshipId);
  };

  const createScholarship = () => {
    setScholarshipEditorMode('create');
    setScholarshipDraft({
      id: `${Date.now()}`,
      name: '',
      amount: '',
      deadline: '',
      description: '',
      criteria: [],
    });
    setFrame('scholarship-editor');
  };

  const editScholarship = (scholarship: Scholarship) => {
    setScholarshipEditorMode('edit');
    setScholarshipDraft({ ...scholarship });
    setFrame('scholarship-editor');
  };

  const deleteScholarship = (scholarship: Scholarship) => {
    if (hasApplications(scholarship.id)) {
      alert('Cannot delete. Students have already applied for this scholarship.');
      return;
    }
    const confirmed = window.confirm(`Delete "${scholarship.name}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }
    if (!authToken) {
      alert('Please log in again.');
      return;
    }
    api.deleteScholarship(authToken, Number(scholarship.id))
      .then(() => {
        setScholarships(prev => prev.filter(item => item.id !== scholarship.id));
      })
      .catch(() => {
        alert('Unable to delete scholarship.');
      });
  };

  const saveScholarship = async (draft: Scholarship) => {
    if (!authToken) {
      alert('Please log in again.');
      return;
    }
    const payload = {
      name: draft.name,
      amount: draft.amount,
      deadline: draft.deadline,
      description: draft.description,
      criteria: draft.criteria,
    };
    try {
      if (scholarshipEditorMode === 'create') {
        const created = await api.createScholarship(authToken, payload);
        setScholarships(prev => [
          {
            id: String(created.id),
            name: created.name,
            amount: created.amount,
            deadline: created.deadline,
            description: created.description,
            criteria: created.criteria || [],
          },
          ...prev,
        ]);
        addSystemLog('Created scholarship', draft.name, 'Success');
      } else {
        const updated = await api.updateScholarship(authToken, Number(draft.id), {
          ...payload,
          id: Number(draft.id),
        });
        setScholarships(prev => prev.map(item => item.id === draft.id ? {
          id: String(updated.id),
          name: updated.name,
          amount: updated.amount,
          deadline: updated.deadline,
          description: updated.description,
          criteria: updated.criteria || [],
        } : item));
        addSystemLog('Updated scholarship', draft.name, 'Success');
      }
      setFrame('scholarship-list');
    } catch (error) {
      alert('Unable to save scholarship.');
    }
  };

  const allowVerificationBypass = true;

  const handleVerifyIdentity = () => {
    const hasPassword = verifyingPassword.trim().length > 3;
    if (hasPassword || allowVerificationBypass) {
      setActiveStep(1);
      return;
    }
    alert('Please enter your credentials to verify identity.');
  };

  const submitApplication = () => {
    if (!authToken || !selectedScholarship) {
      alert('Please log in again.');
      return;
    }
    if (!isScholarshipOpen(selectedScholarship.deadline)) {
      alert('This scholarship is closed and no longer accepts applications.');
      return;
    }
    if (hasApplications(selectedScholarship.id)) {
      alert('You have already applied to this scholarship.');
      return;
    }
    const submissionDate = new Date().toISOString().split('T')[0];
    api.submitApplication(authToken, {
      scholarship_id: Number(selectedScholarship.id),
      status: 'Submitted',
      submission_date: submissionDate,
    })
      .then(async (application) => {
        const mapped = mapApplication(application);
        if (uploadedFile) {
          try {
            const document = await api.uploadDocument(authToken, application.id, uploadedFile);
            mapped.documents = mapDocuments([document]);
            
            // Fetch the updated application to get all documents
            const updatedApp = await api.listApplications(authToken);
            const fullApplication = updatedApp.find(app => app.id === application.id);
            if (fullApplication) {
              mapped.documents = mapDocuments(fullApplication.documents);
            }
          } catch (error) {
            console.error(error);
          }
        }
        setApplications(prev => [mapped, ...prev]);
        addNotification(Role.STUDENT, `Successfully submitted an application for ${selectedScholarship.name}.`);
        addSystemLog('Submitted application', `App #${mapped.id} - ${selectedScholarship.name}`, 'Success');
        setFrame('dashboard');
        alert('Application submitted.');
      })
      .catch(() => {
        alert('Unable to submit application.');
      });
  };

  const handleResubmitDocuments = async (files: File[]) => {
    if (!resubmissionApplication || !authToken) {
      alert('Missing application or authentication.');
      return;
    }

    setIsResubmittingDocuments(true);
    try {
      const appId = Number(resubmissionApplication.id);
      // Upload each file
      const uploadPromises = files.map(file =>
        api.uploadDocument(authToken, appId, file)
      );

      const uploadedDocs = await Promise.all(uploadPromises);

      // Mark application as resubmitted
      await api.markResubmitted(authToken, appId);

      // Refresh applications to get updated status
      const updatedApps = await api.listApplications(authToken);
      const updatedApp = updatedApps.find(app => app.id === appId);

      if (updatedApp) {
        const mapped = mapApplication(updatedApp);
        setApplications(prev =>
          prev.map(app => (app.id === mapped.id ? mapped : app))
        );
      }

      const scholarshipName = scholarships.find(s => s.id === resubmissionApplication.scholarshipId)?.name || 'Scholarship';
      addNotification(
        Role.STUDENT,
        `Resubmitted ${files.length} document(s) for ${scholarshipName}.`
      );
      addSystemLog(
        'Resubmitted documents',
        `App #${resubmissionApplication.id} - ${files.length} file(s)`,
        'Success'
      );

      setShowResubmissionModal(false);
      setResubmissionApplication(null);
    } catch (error) {
      console.error('Error resubmitting documents:', error);
      alert('Failed to resubmit documents. Please try again.');
    } finally {
      setIsResubmittingDocuments(false);
    }
  };

  const assignReviewer = (applicationId: string, reviewerId: string, reviewerName: string) => {
    if (!authToken) {
      alert('Please log in again.');
      return;
    }
    api.assignReviewer(authToken, Number(applicationId), Number(reviewerId))
      .then(() => {
        const targetApplication = applications.find(app => app.id === applicationId);
        const scholarshipName = scholarships.find(s => s.id === targetApplication?.scholarshipId)?.name || 'a scholarship';
        const studentName = targetApplication?.studentName || 'an applicant';
        setApplications(prev => prev.map(application => {
          if (application.id !== applicationId) {
            return application;
          }
          return {
            ...application,
            assignedReviewer: reviewerName || undefined,
            status: reviewerName ? 'Under Review' : application.status
          };
        }));
        if (reviewerName) {
          addNotification(Role.REVIEWER, `You have been assigned to ${studentName} for ${scholarshipName}.`);
        }
      })
      .catch(() => {
        alert('Unable to assign reviewer.');
      });
  };

  const submitReview = (applicationId: string, review: ReviewEvaluation) => {
    if (!authToken) {
      alert('Please log in again.');
      return;
    }
    api.submitReview(authToken, {
      application_id: Number(applicationId),
      scores_json: JSON.stringify(review.scores),
      overall_score: review.overallScore,
      comments: review.comments,
      submitted_at: review.submittedAt || new Date().toISOString().split('T')[0],
    })
      .then((savedReview) => {
        const targetApplication = applications.find(app => app.id === applicationId);
        const scholarshipName = scholarships.find(s => s.id === targetApplication?.scholarshipId)?.name || 'a scholarship';
        const studentName = targetApplication?.studentName || 'an applicant';
        setApplications(prev => prev.map(application => {
          if (application.id !== applicationId) {
            return application;
          }
          return {
            ...application,
            review: mapReview(savedReview),
          };
        }));
        addNotification(Role.REVIEWER, `Successfully reviewed ${studentName} for ${scholarshipName}.`);
        addNotification(Role.COMMITTEE, `Review completed for ${studentName} (${scholarshipName}).`);
        addSystemLog('Submitted evaluation', `App #${applicationId}`, 'Success', scholarshipName);
        alert('Review submitted successfully.');
      })
      .catch(() => {
        alert('Unable to submit review.');
      });
  };

  const requestMissingDocuments = (applicationId: string, missingDocuments: string[], reason: string) => {
    if (!authToken) {
      alert('Please log in again.');
      return;
    }
    if (!reason.trim()) {
      alert('Please provide a reason for the document request.');
      return;
    }
    if (missingDocuments.length === 0) {
      alert('Please select at least one missing document.');
      return;
    }

    const targetApplication = applications.find(app => app.id === applicationId);
    const scholarshipName = scholarships.find(s => s.id === targetApplication?.scholarshipId)?.name || 'a scholarship';
    const studentName = targetApplication?.studentName || 'an applicant';
    const requestedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Call backend API to persist document request
    api.requestDocuments(authToken, Number(applicationId), {
      missing_documents: missingDocuments,
      reason,
      requested_at: requestedAt,
    })
      .then((updatedApp) => {
        // Map the response and update local state
        const mapped = mapApplication(updatedApp);
        setApplications(prev => prev.map(app => app.id === applicationId ? mapped : app));

        addNotification(
          Role.STUDENT,
          `Your application for ${scholarshipName} needs additional documents. Reason: ${reason}`
        );
        addNotification(
          Role.REVIEWER,
          `Document request sent to ${studentName} for ${scholarshipName}.`
        );
        addSystemLog(
          'Requested missing documents',
          `App #${applicationId}`,
          'Success',
          `${missingDocuments.length} document(s) requested: ${missingDocuments.join(', ')}`
        );
        alert('Document request sent to applicant.');
      })
      .catch((error) => {
        console.error('Failed to request documents:', error);
        alert('Failed to send document request. Please try again.');
      });
  };

  const decideApplication = (applicationId: string, decision: 'Awarded' | 'Rejected') => {
    if (!authToken) {
      alert('Please log in again.');
      return;
    }
    api.submitDecision(authToken, Number(applicationId), decision)
      .then(() => {
        const targetApplication = applications.find(app => app.id === applicationId);
        const scholarshipName = scholarships.find(s => s.id === targetApplication?.scholarshipId)?.name || 'the scholarship';
        const studentName = targetApplication?.studentName || 'an applicant';
        setApplications(prev => prev.map(application => {
          if (application.id !== applicationId) {
            return application;
          }
          return {
            ...application,
            status: decision,
          };
        }));
        if (decision === 'Awarded') {
          addNotification(Role.STUDENT, `Congratulations! ${scholarshipName} has been approved.`);
        } else {
          addNotification(Role.STUDENT, `Your request for ${scholarshipName} has been rejected.`);
        }
        addNotification(Role.COMMITTEE, `Successfully ${decision === 'Awarded' ? 'approved' : 'rejected'} ${studentName} for ${scholarshipName}.`);
        addSystemLog(
          decision === 'Awarded' ? 'Approved award' : 'Rejected award',
          `App #${applicationId}`,
          'Success',
          scholarshipName
        );
      })
      .catch(() => {
        alert('Unable to submit decision.');
      });
  };

  const createManagedAccount = (account: Omit<ManagedAccount, 'id'>) => {
    if (!authToken) {
      alert('Please log in again.');
      return;
    }
    const temporaryPassword = 'ChangeMe123';
    api.createUser(authToken, {
      name: account.name,
      email: account.email,
      password: temporaryPassword,
      role: roleToApi(account.role),
    })
      .then((createdUser) => {
        setManagedAccounts(prev => [
          {
            id: `USR${String(createdUser.id).padStart(4, '0')}`,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role === 'reviewer' ? Role.REVIEWER : Role.COMMITTEE,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'Active',
          },
          ...prev,
        ]);
        addSystemLog('Created account', `${createdUser.role === 'reviewer' ? 'Reviewer' : 'Committee'} → ${account.name}`, 'Success');
        alert(`Account created. Temporary password: ${temporaryPassword}`);
      })
      .catch(() => {
        alert('Unable to create account.');
      });
  };

  if (reviewOnly) {
    return (
      <ReviewerWorkspaceScreen
        application={reviewApplication}
        scholarship={reviewScholarship}
        reviewerName={reviewerDisplayName}
        onSubmitReview={submitReview}
        onRequestDocuments={requestMissingDocuments}
        onBack={handleBackToDashboard}
      />
    );
  }

  const renderDashboardContent = () => {
    if (!selectedRole) {
      return (
        <div className="p-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-slate-500">
            Select a role to view the dashboard.
          </div>
        </div>
      );
    }

    switch (selectedRole) {
      case Role.STUDENT:
        return (
          <StudentDashboard
            userName={userData.name}
            selectedRole={selectedRole}
            applications={applications}
            scholarships={scholarships}
            activeScholarships={activeScholarships}
            nextDeadline={getNextDeadline}
            onFindScholarships={() => setFrame('scholarship-list')}
            onOpenResubmissionModal={(app) => {
              setResubmissionApplication(app);
              setShowResubmissionModal(true);
            }}
          />
        );
      case Role.REVIEWER:
        return (
          <ReviewerDashboard
            reviewerName={userData.name || reviewerDisplayName}
            applications={applications}
          />
        );
      case Role.COMMITTEE:
        return (
          <CommitteeDashboard
            committeeName={userData.name}
            applications={applications}
            scholarships={scholarships}
            reviewers={reviewers}
            onAssignReviewer={assignReviewer}
            onDecision={decideApplication}
          />
        );
      case Role.ADMIN:
        return (
          <AdminDashboard
            adminName={userData.name}
            scholarships={scholarships}
            applications={applications}
          />
        );
      default:
        return null;
    }
  };

  // --- SUB-SCREENS ---

  const TopPanel = () => (
    <header className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
          <img
            src={mmuLogoUrl}
            alt="MMU"
            className="w-12 h-6 object-contain"
          />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">MMU Digital Scholarship</p>
          <p className="text-lg font-black text-slate-900 leading-none">Application and Tracking System</p>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
        <button
          onClick={() => setFrame('landing')}
          className="flex items-center gap-2 hover:text-slate-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10.5l9-7 9 7M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
          </svg>
          Home
        </button>
        <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
          Campus
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
          Why MMU
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
          Field of Study
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
          Level of Study
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </nav>
    </header>
  );

  const topPanelNode = <TopPanel />;

  const LandingScreen = () => (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-rose-100">
      {showTopPanel && <TopPanel />}

      <main className="min-h-screen flex items-center justify-center px-8 pb-16">
        <div className="max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 border border-white rounded-full text-xs font-bold text-slate-600 shadow-sm">
            {ICONS.Check}
            Empowering Students Through Education
          </span>
          <h1 className="mt-8 text-6xl md:text-8xl font-black text-slate-900 leading-tight">
            MMU Digital
            <span className="block text-rose-600">Scholarship System</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Apply, track, and manage scholarships seamlessly. Your journey to academic excellence starts here at Multimedia University.
          </p>

          { /* <!-- Add statistics here --> fake statistics */ }
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-black text-slate-800">1,200+</p>
              <p className="text-sm text-slate-500 mt-2">Applications Submitted</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black text-rose-600">RM 5M+</p>
              <p className="text-sm text-slate-500 mt-2">Funds Distributed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black text-slate-800">2,500+</p>
              <p className="text-sm text-slate-500 mt-2">Active Students</p>
            </div>
            {/* <!-- Add statistics here --> */}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => setFrame('choose-role')}
              className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>

      { /* <!-- Add why use our system text here --> fake text */ }
      <section className="px-8 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why Use Our System?</h2>
          <p className="text-slate-500 mt-3">Streamlined scholarship management for everyone</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l8 4-8 4-8-4 8-4zm0 8l8 4-8 4-8-4 8-4zm0 8v-8" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Multiple Scholarships</h3>
                <p className="text-slate-500 text-sm mt-2">
                  Access merit-based, need-based, and special scholarships in one place.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Easy Application</h3>
                <p className="text-slate-500 text-sm mt-2">
                  Simple online submission with document upload and real-time tracking.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3 8 4-16 3 8h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Track Progress</h3>
                <p className="text-slate-500 text-sm mt-2">
                  Monitor application status from submission to final decision.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0c3.866 0 7 1.79 7 4v3H5v-3c0-2.21 3.134-4 7-4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Secure & Reliable</h3>
                <p className="text-slate-500 text-sm mt-2">
                  Your data is protected with secure access and role-based controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      { /* <!-- Add why use our system text here ^ --> */ } 
    </div>
  );

  const renderRoleSelectionScreen = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {showTopPanel && <TopPanel />}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Choose Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {Object.values(Role).map(role => (

          
          <button
            key={role}
            onClick={() => {
              setSelectedRole(role);
              setUserData(prev => ({
                ...prev,
                name: ROLE_DISPLAY_NAME[role],
                id: formatUserId(role, 1),
              }));
              setFrame('login');
            }}
            className="flex flex-col items-start p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="p-3 bg-slate-100 rounded-xl mb-6 group-hover:bg-white transition-colors">
              {getRoleIcon(role)}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{role}</h3>
            <p className="text-slate-400 text-sm">Access the system as {role.toLowerCase()}.</p>
          </button>
        ))}
        </div>
      </div>
    </div>
  );

  const renderLoginScreen = () => (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {showTopPanel && <TopPanel />}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
        <button // Return to role selection button
          onClick={() => setFrame('choose-role')}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mb-6"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Return to role selection
        </button>
        <div className="flex items-center gap-3 mb-6 text-slate-700">
          <div className="p-2 bg-slate-100 rounded-lg">
            {getRoleIcon(selectedRole)}
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">
            {selectedRole || 'Role'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-10">{selectedRole} Login</h2>
        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(event) => setLoginEmail(event.currentTarget.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.currentTarget.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          {authError && <p className="text-sm text-rose-600 font-semibold">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Sign In
          </button>
          {selectedRole === Role.STUDENT && (
            <button
              onClick={() => setFrame('register')}
              className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Register
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );

  const renderRegisterScreen = () => (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {showTopPanel && <TopPanel />}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 my-8">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Register</h2>
        <div className="flex flex-col gap-6 mb-8">
           <input
             type="text"
             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none"
             placeholder="Full Name"
             value={registerName}
             onChange={(event) => setRegisterName(event.currentTarget.value)}
           />
           <input
             type="password"
             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none"
             placeholder="Password"
             value={registerPassword}
             onChange={(event) => setRegisterPassword(event.currentTarget.value)}
           />
           <input
             type="email"
             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none"
             placeholder="Email Address"
             value={registerEmail}
             onChange={(event) => setRegisterEmail(event.currentTarget.value)}
           />
        </div>
        {authError && <p className="text-sm text-rose-600 font-semibold mb-4">{authError}</p>}
        <button onClick={handleRegister} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Create Account</button>
        </div>
      </div>
    </div>
  );


  const renderApplicationFlow = () => (
    <div className="min-h-screen flex flex-col bg-white">
      {showTopPanel && <TopPanel />}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
        <button
          onClick={goToDashboard}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Return back to dashboard
        </button>
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Apply: {selectedScholarship?.name}</h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            {[0, 1, 2, 3].map(step => (
              <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${activeStep >= step ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>
                  {step === 0 ? '✓' : step}
                </div>
                {step < 3 && <div className={`h-1 w-12 rounded transition-all ${activeStep > step ? 'bg-blue-600' : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-4 uppercase font-bold tracking-widest">
            {activeStep === 0 ? 'Verification' : activeStep === 1 ? 'Form Entry' : activeStep === 2 ? 'Document Upload' : 'Final Confirmation'}
          </p>
        </header>

        {activeStep === 0 && (
          <div className="max-w-md mx-auto space-y-8 animate-in zoom-in duration-300">
             <div className="text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               </div>
               <h3 className="text-xl font-bold">Verify Identity</h3>
               <p className="text-slate-500 text-sm mt-2">Enter credentials to proceed with application.</p>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Account Password</label>
                <input 
                type="password" 
                defaultValue={verifyingPassword}
                onChange={e => setVerifyingPassword(e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg" 
                placeholder="••••••••" 
               />
             </div>
             <div className="flex gap-4">
               <button onClick={() => setFrame('scholarship-list')} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-500">Cancel</button>
               <button onClick={handleVerifyIdentity} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100">Verify & Continue</button>
             </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Application Form</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Academic Achievement Summary</label>
                <textarea 
                  value={applicationAcademicSummary} 
                  onChange={(e) => setApplicationAcademicSummary(e.target.value)}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-32" 
                  placeholder="Detail your academic milestones and achievements..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Latest CGPA/SPM Result</label>
                <input 
                  type="text" 
                  value={applicationCGPA}
                  onChange={(e) => setApplicationCGPA(e.target.value)}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 3.95/7As 3Bs" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Matric ID (Verified)</label>
                <input type="text" value={userData.id} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed" />
              </div>
            </div>
            <button onClick={() => setActiveStep(2)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95">Next: Document Upload</button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Document Upload</h3>
            <label className="p-12 border-4 border-dashed border-slate-100 rounded-3xl text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group block">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  setUploadedFile(file);
                }}
              />
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm group-hover:text-blue-500 transition-colors">
                {ICONS.File}
              </div>
              {uploadedFile ? (
                <div className="text-emerald-600 font-bold">
                  ✓ {uploadedFile.name} Ready
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">Click to change file</p>
                </div>
              ) : (
                <div className="text-slate-400">
                  <p className="font-bold text-slate-600">Drag & Drop your document here</p>
                  <p className="text-sm">Mandatory for verification (PDF/JPG/PNG)</p>
                </div>
              )}
            </label>
            <div className="flex gap-4 pt-6">
              <button onClick={() => setActiveStep(1)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold transition-all active:scale-95">Back</button>
              <button onClick={() => setActiveStep(3)} className={`flex-1 py-4 text-white rounded-xl font-bold shadow-lg transition-all ${uploadedFile ? 'bg-slate-900 active:scale-95' : 'bg-slate-300 cursor-not-allowed'}`} disabled={!uploadedFile}>Next: Final Confirm</button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-8 animate-in zoom-in duration-300">
            <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Confirm Submission</h3>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Scholarship Name</span>
                <span className="font-bold text-slate-900">{selectedScholarship?.name}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Applicant Identity</span>
                <span className="font-bold text-slate-900">{userData.name} ({userData.id})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Uploaded Document</span>
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  {uploadedFile?.name || 'No document'}
                  {ICONS.File}
                </span>
              </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button onClick={() => setActiveStep(2)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold transition-all active:scale-95">Back</button>
              <button onClick={submitApplication} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">Submit Application</button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );

  const DashboardScreen = () => {
    const roleNotifications = notifications.filter(item => item.role === selectedRole);

    return (
      <div className="min-h-screen flex flex-col bg-slate-100">
        {showTopPanel && <TopPanel />}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">{ICONS.Check}</div>
            <span className="font-black text-xl text-slate-900 tracking-tight">
              {selectedRole ? ROLE_PORTAL_LABEL[selectedRole] : 'Student Portal'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none">{userData.name}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{selectedRole}</p>
            </div>
            <button onClick={() => setFrame('profile')} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-white ring-1 ring-slate-100 hover:ring-blue-400 transition-all shadow-sm">
              {userData.name.charAt(0)}
            </button>
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(prev => !prev);
                  if (!showNotifications) {
                    markNotificationsAsSeen();
                  }
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all relative"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0h6z" />
                </svg>
                {roleNotifications.filter(n => !n.seen).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {roleNotifications.filter(n => !n.seen).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-20">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      {roleNotifications.length} total
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {roleNotifications.map(note => (
                      <div key={note.id} className="px-4 py-3">
                        <p className="text-sm text-slate-700 font-semibold">{note.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{note.createdAt}</p>
                      </div>
                    ))}
                    {roleNotifications.length === 0 && (
                      <div className="px-4 py-6 text-sm text-slate-400">No notifications yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Logout">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>
      
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">Main Menu</p>
          {[
            { name: 'Dashboard', icon: ICONS.Dashboard, active: frame === 'dashboard', action: () => setFrame('dashboard') },
            { name: 'Scholarships', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, active: frame === 'scholarship-list', action: () => setFrame('scholarship-list') },
            { name: 'Profile Settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, active: frame === 'profile', action: () => setFrame('profile') },
            ...(selectedRole === Role.ADMIN ? [{
              name: 'Account Management',
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19a4 4 0 10-8 0v1h8v-1zM18 8a4 4 0 11-8 0 4 4 0 018 0zM20 11h2m-1-1v2" /></svg>,
              active: frame === 'account-management',
              action: () => setFrame('account-management')
            }, {
              name: 'System Reports',
              icon: ICONS.File,
              active: frame === 'system-reports',
              action: () => setFrame('system-reports')
            }, {
              name: 'System Logs',
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /></svg>,
              active: frame === 'system-logs',
              action: () => setFrame('system-logs')
            }] : [])
          ].map(item => (
            <button key={item.name} onClick={item.action} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
              {item.icon}{item.name}
            </button>
          ))}
          {selectedRole === Role.STUDENT && (
            <div className="mt-auto pt-6">
              <div className="bg-slate-900 rounded-2xl p-4 text-white">
                <p className="text-xs font-bold mb-1">Scholarship Support</p>
                <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Need help? Our team is available 24/7.</p>
                <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300">Contact Support →</button>
              </div>
            </div>
          )}
        </aside>
        
        <main className="flex-1 overflow-y-auto">
          {frame === 'dashboard' ? (
            renderDashboardContent()
          ) : frame === 'scholarship-list' ? (
            <ScholarshipListScreen
              showTopPanel={showTopPanel}
              topPanel={topPanelNode}
              selectedRole={selectedRole}
              searchDraft={searchDraft}
              onSearchDraftChange={setSearchDraft}
              onSearchSubmit={applySearch}
              filteredScholarships={visibleScholarships}
              onStartApplication={startApplication}
              onCreateScholarship={createScholarship}
              onEditScholarship={editScholarship}
              onDeleteScholarship={deleteScholarship}
              hasApplications={hasApplications}
            />
          ) : frame === 'profile' ? (
            <ProfileScreen
              showTopPanel={showTopPanel}
              topPanel={topPanelNode}
              userName={userData.name}
              userId={userData.id}
              selectedRole={selectedRole}
              profileDraft={profileDraft}
              passwordDraft={passwordDraft}
              onProfileFieldChange={updateProfileDraft}
              onPasswordFieldChange={updatePasswordDraft}
              onPasswordSave={savePasswordChanges}
              onDiscard={() => setProfileDraft(userData)}
              onSave={saveProfileChanges}
              onBack={goToDashboard}
            />
          ) : frame === 'scholarship-editor' ? (
            <ScholarshipEditorScreen
              showTopPanel={showTopPanel}
              topPanel={topPanelNode}
              mode={scholarshipEditorMode}
              initialDraft={scholarshipDraft}
              onSave={saveScholarship}
              onBack={() => setFrame('scholarship-list')}
            />
          ) : frame === 'system-logs' ? (
            <SystemLogsScreen
              showTopPanel={showTopPanel}
              topPanel={topPanelNode}
              logs={systemLogs}
              onBack={goToDashboard}
            />
          ) : frame === 'system-reports' ? (
            <SystemReportsScreen
              showTopPanel={showTopPanel}
              topPanel={topPanelNode}
              logs={systemLogs}
              scholarships={scholarships}
              applications={applications}
              onBack={goToDashboard}
            />
          ) : frame === 'account-management' ? (
            <AccountManagementScreen
              showTopPanel={showTopPanel}
              topPanel={topPanelNode}
              accounts={managedAccounts}
              onCreateAccount={createManagedAccount}
              onBack={goToDashboard}
            />
          ) : null}
        </main>
      </div>

      <DocumentResubmissionModal
        isOpen={showResubmissionModal}
        application={resubmissionApplication}
        scholarship={resubmissionApplication ? scholarships.find(s => s.id === resubmissionApplication.scholarshipId) || null : null}
        onClose={() => {
          setShowResubmissionModal(false);
          setResubmissionApplication(null);
        }}
        onSubmit={handleResubmitDocuments}
        isLoading={isResubmittingDocuments}
      />
    </div>
    );
  };

  // --- RENDERER ---
  switch (frame) {
    case 'landing': return <LandingScreen />;
    case 'choose-role': return renderRoleSelectionScreen();
    case 'login': return renderLoginScreen();
    case 'register': return renderRegisterScreen();
    case 'dashboard':
    case 'scholarship-list':
    case 'profile':
    case 'scholarship-editor':
    case 'system-logs':
    case 'system-reports':
    case 'account-management': return <DashboardScreen />;
    case 'apply-flow': return renderApplicationFlow();
    default: return <LandingScreen />;
  }
};

export default PrototypeViewer;
