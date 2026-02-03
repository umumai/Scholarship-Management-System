import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Role, Scholarship, Application, ReviewEvaluation } from '../types';
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
  | 'apply-flow'
  | 'generic-page';

type PageContent = {
  title: string;
  description: string;
  features: string[];
  stats?: { label: string; value: string }[];
  imageIcon: React.ReactNode;
};

const PAGE_CONTENT_MAP: Record<string, PageContent> = {
  // Campus
  'Cyberjaya': {
    title: 'Cyberjaya Campus',
    description: 'Located in the heart of Malaysia\'s Silicon Valley, our Cyberjaya campus is a hub of innovation and technology. It features state-of-the-art laboratories, a digital library, and a vibrant startup ecosystem.',
    features: ['High-tech Innovation Labs', '24/7 Digital Library', 'Startup Incubator', 'Modern Student Accommodation'],
    stats: [{ label: 'Acres', value: '80' }, { label: 'Students', value: '15,000+' }],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  },
  'Melaka': {
    title: 'Melaka Campus',
    description: 'Nestled in the UNESCO World Heritage City, the Melaka campus offers a serene learning environment blending history with modernity. It is renowned for its strong business, law, and creative arts programs.',
    features: ['Heritage City Setting', 'Mock Courtroom', 'Creative Studios', 'Business Simulation Labs'],
    stats: [{ label: 'Acres', value: '52' }, { label: 'Students', value: '8,000+' }],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
  },
  // Why MMU
  'Rankings': {
    title: 'Our Rankings',
    description: 'MMU is consistently ranked as one of Malaysia\'s top private universities. We are recognized globally for our excellence in teaching, research, and industry partnerships.',
    features: ['Top 200 in QS Asia', 'Tier 5 SETARA Rating', 'Premier Digital Tech Uni', 'Award-Winning Research'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
  },
  'Employability': {
    title: 'Graduate Employability',
    description: 'Our graduates are highly sought after by industry leaders. With an employability rate of over 97% within 6 months of graduation, MMU paves the way for a successful career.',
    features: ['97% Employment Rate', 'Industry-Ready Curriculum', 'Career Development Centre', 'Strong Alumni Network'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  'Facilities': {
    title: 'World-Class Facilities',
    description: 'Experience world-class learning with our cutting-edge facilities, including 24/7 learning points, smart classrooms, industry-standard labs, and comprehensive sports complexes.',
    features: ['Smart Classrooms', 'Olympic-sized Pool', 'e-Sports Arena', 'Multimedia Labs'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  },
  'Student Life': {
    title: 'Student Life',
    description: 'Life at MMU is vibrant and diverse. Join over 100 clubs and societies, participate in international competitions, and enjoy a campus life filled with cultural and recreational activities.',
    features: ['100+ Clubs', 'Cultural Festivals', 'Sports Tournaments', 'Leadership Camps'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  // Field of Study
  'Engineering': {
    title: 'Engineering',
    description: 'Innovate the future with our Engineering programs. From Electronics to Mechanical, our accredited degrees focus on practical skills and industry-relevant technologies.',
    features: ['BEM Accredited', 'Robotics Labs', 'Industry Projects', 'Expert Faculty'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  },
  'IT & Computer Science': {
    title: 'IT & Computer Science',
    description: 'Lead the digital revolution. Our IT and CS programs cover Artificial Intelligence, Data Science, Cybersecurity, and Software Engineering, preparing you for the tech jobs of tomorrow.',
    features: ['AI Specialization', 'Cybersecurity Hub', 'Hackathons', 'Tech Industry Partners'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  'Business': {
    title: 'Business & Management',
    description: 'Master the world of commerce. Our Business faculty offers comprehensive programs in Accounting, Finance, Marketing, and Management, accredited by professional bodies.',
    features: ['ACCA Exemptions', 'Entrepreneurship Focus', 'Corporate Visits', 'Global Case Studies'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  'Creative Multimedia': {
    title: 'Creative Multimedia',
    description: 'Unleash your creativity. As a pioneer in creative multimedia education, we offer programs in Animation, Visual Effects, Interface Design, and Virtual Reality.',
    features: ['VR/AR Studios', 'Industry Awards', 'Creative Showcase', 'Digital Arts Gallery'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  'Law': {
    title: 'Law',
    description: 'Uphold justice and integrity. Our Law program provides a rigorous legal education, preparing students for the Bar and various legal professions.',
    features: ['Moot Court', 'Legal Aid Clinic', 'Bar Council Recognized', 'Expert Practitioners'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
  },
  // Level of Study
  'Foundation': {
    title: 'Foundation Programmes',
    description: 'Start your journey strong. Our Foundation programs provide a solid pre-university education, seamlessly transitioning you into your chosen degree path.',
    features: ['1-Year Fast Track', 'Direct Degree Entry', 'Comprehensive Basics', 'Scholarship Available'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  },
  'Diploma': {
    title: 'Diploma Programmes',
    description: 'Gain practical skills for the workforce. Our Diploma programs are designed to provide hands-on training and technical expertise for immediate career entry.',
    features: ['Practical Focus', '2.5 Years Duration', 'Industrial Training', 'Pathway to Degree'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  },
  'Bachelor\'s Degree': {
    title: 'Bachelor\'s Degree',
    description: 'Pursue academic excellence. Our undergraduate degrees combine theoretical knowledge with practical application, shaping you into a competent professional.',
    features: ['3-4 Years Duration', 'Honours Programs', 'Final Year Project', 'Global Recognition'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.083 0 01.665-6.479L12 14z" /></svg>
  },
  'Postgraduate': {
    title: 'Postgraduate Studies',
    description: 'Advance your knowledge. Our Master\'s and PhD programs offer opportunities for advanced research and specialization under the guidance of expert supervisors.',
    features: ['Master\'s & PhD', 'Research Grants', 'Flexible Schedules', 'Expert Supervision'],
    imageIcon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
  }
};

const NAV_ITEMS = {
  campus: { 
    label: 'Campus', 
    options: ['Cyberjaya', 'Melaka'] 
  },
  whyMMU: { 
    label: 'Why MMU', 
    options: ['Rankings', 'Employability', 'Facilities', 'Student Life'] 
  },
  fieldOfStudy: { 
    label: 'Field of Study', 
    options: ['Engineering', 'IT & Computer Science', 'Business', 'Creative Multimedia', 'Law'] 
  },
  levelOfStudy: { 
    label: 'Level of Study', 
    options: ['Foundation', 'Diploma', 'Bachelor\'s Degree', 'Postgraduate'] 
  }
};

type UserData = {
  name: string;
  email: string;
  id: string;
  program: string;
  dept: string;
  phone: string;
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
  
  // Navigation & Support State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [genericPageContent, setGenericPageContent] = useState<PageContent | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  
  // Application Flow State
  const [activeStep, setActiveStep] = useState(0); // 0 = Identity Verification
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [verifyingPassword, setVerifyingPassword] = useState('');

  const samplePdfDataUrl = 'data:application/pdf;base64,JVBERi0xLjQKJcKlwrHDqwoKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUuMjggODQxLjg5XS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggMTY+PnN0cmVhbQpCVAovRjEgMTIgVGYKNDAgNzAwIFRkCihNb2NrIFBERikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+CmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDk1IDAwMDAwIG4gCjAwMDAwMDAxNzIgMDAwMDAgbiAKMDAwMDAwMDI0MSAwMDAwMCBuIAowMDAwMDAwMzU5IDAwMDAwIG4gCjAwMDAwMDA0NTQgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEgMCBSL1NpemUgNj4+CnN0YXJ0eHJlZgo1NjcKJSVFT0Y=';
  const mockDocxUrl = '/documents/mock-essay.docx';

  // Mock Global State
  const [scholarships, setScholarships] = useState<Scholarship[]>([
    { id: '1', name: 'Global Merit Scholarship 2024', amount: 'RM15,000', deadline: '2024-12-31', description: 'Awarded for academic excellence.', criteria: ['GPA > 3.8', 'Leadership activities', 'SPM Results'] },
    { id: '2', name: 'Future Engineers Fund', amount: 'RM10,000', deadline: '2024-06-15', description: 'Supports STEM students.', criteria: ['Major in Engineering', 'Undergraduate level'] },
    { id: '3', name: 'Community Leadership Award', amount: 'RM5,000', deadline: '2024-11-20', description: 'For local community impacts.', criteria: ['50+ hours community service', 'Local residency'] },
  ]);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app1',
      scholarshipId: '1',
      studentName: 'Alex Rivera',
      status: 'Under Review',
      submissionDate: '2024-05-12',
      assignedReviewer: 'Dr. Maya Lewis',
      documents: [
        { id: 'doc-app1-1', name: 'SPM Certificate.pdf', type: 'pdf', url: samplePdfDataUrl },
        { id: 'doc-app1-2', name: 'Transcript.png', type: 'png', url: mmuLogoUrl },
        { id: 'doc-app1-3', name: 'Personal Statement.docx', type: 'docx', url: mockDocxUrl, previewUrl: mmuLogoUrl },
      ],
      review: {
        status: 'Submitted',
        reviewerName: 'Dr. Maya Lewis',
        scores: [
          { criteria: 'GPA > 3.8', score: 9 },
          { criteria: 'Leadership activities', score: 8 },
          { criteria: 'SPM Results', score: 9 },
        ],
        overallScore: 8.7,
        comments: 'Excellent academic record with consistent leadership roles.',
        submittedAt: '2024-05-20',
      },
    },
    {
      id: 'app2',
      scholarshipId: '1',
      studentName: 'Priya Sharma',
      status: 'Under Review',
      submissionDate: '2024-05-18',
      assignedReviewer: 'Dr. Maya Lewis',
      documents: [
        { id: 'doc-app2-1', name: 'Income Statement.pdf', type: 'pdf', url: samplePdfDataUrl },
        { id: 'doc-app2-2', name: 'Community Work.png', type: 'png', url: mmuLogoUrl },
      ],
      review: {
        status: 'Pending',
        reviewerName: 'Dr. Maya Lewis',
        scores: [],
        overallScore: 0,
        comments: '',
      },
    },
    { id: 'app3', scholarshipId: '2', studentName: 'Samuel Lee', status: 'Submitted', submissionDate: '2024-05-20' },
  ]);
  const [reviewers] = useState<string[]>([
    'Dr. Maya Lewis',
    'Prof. Lina Wei',
    'Dr. Omar Hakim',
  ]);
  const [managedAccounts, setManagedAccounts] = useState<ManagedAccount[]>([]);
  const [systemLogs] = useState<SystemLogEntry[]>([
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

  // Mock User State
  const [userData, setUserData] = useState<UserData>({
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    id: 'STU0001',
    program: 'Software Engineering',
    dept: 'Faculty of Computing',
    phone: '+1 (555) 012-3456'
  });
  const [profileDraft, setProfileDraft] = useState<UserData>(userData);

  // Helpers
  const goToDashboard = () => setFrame('dashboard');
  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedRole(null);
    setFrame('landing');
  };

  const filteredScholarships = useMemo(() => {
    return scholarships.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.criteria.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [scholarships, searchQuery]);

  useEffect(() => {
    if (frame === 'profile') {
      setProfileDraft(userData);
    }
  }, [frame]);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reviewerDashboard') === '1') {
      setSelectedRole(Role.REVIEWER);
      setUserData(prev => ({ ...prev, name: ROLE_DISPLAY_NAME[Role.REVIEWER] }));
      setIsLoggedIn(true);
      setFrame('dashboard');
    }
  }, [location.search]);

  const startApplication = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setActiveStep(0); // Start with Identity Verification
    setUploadedFile(null);
    setVerifyingPassword('');
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
    setScholarships(prev => prev.filter(item => item.id !== scholarship.id));
  };

  const saveScholarship = (draft: Scholarship) => {
    if (scholarshipEditorMode === 'create') {
      setScholarships(prev => [draft, ...prev]);
    } else {
      setScholarships(prev => prev.map(item => item.id === draft.id ? draft : item));
    }
    setFrame('scholarship-list');
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
    const newApp: Application = {
      id: `app${Date.now()}`,
      scholarshipId: selectedScholarship?.id || '',
      studentName: userData.name,
      status: 'Submitted',
      submissionDate: new Date().toISOString().split('T')[0],
    };
    setApplications([newApp, ...applications]);
    setFrame('dashboard');
    alert('Application System: Application recorded. Returning to dashboard.');
  };

  const assignReviewer = (applicationId: string, reviewerName: string) => {
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
  };

  const submitReview = (applicationId: string, review: ReviewEvaluation) => {
    setApplications(prev => prev.map(application => {
      if (application.id !== applicationId) {
        return application;
      }
      return {
        ...application,
        review,
      };
    }));
  };

  const decideApplication = (applicationId: string, decision: 'Awarded' | 'Rejected') => {
    setApplications(prev => prev.map(application => {
      if (application.id !== applicationId) {
        return application;
      }
      if (application.status === 'Awarded' || application.status === 'Rejected') {
        return application;
      }
      if (application.status !== 'Under Review') {
        return application;
      }
      return {
        ...application,
        status: decision,
      };
    }));
  };

  const createManagedAccount = (account: Omit<ManagedAccount, 'id'>) => {
    setManagedAccounts(prev => {
      const prefix = account.role === Role.REVIEWER ? 'REV' : 'COM';
      const nextIndex = prev
        .filter(item => item.id.startsWith(prefix))
        .map(item => Number(item.id.replace(prefix, '')))
        .filter(Number.isFinite)
        .reduce((max, value) => Math.max(max, value), 0) + 1;
      const nextId = `${prefix}${String(nextIndex).padStart(4, '0')}`;
      return [{ ...account, id: nextId }, ...prev];
    });
  };

  if (reviewOnly) {
    return (
      <ReviewerWorkspaceScreen
        application={reviewApplication}
        scholarship={reviewScholarship}
        reviewerName={reviewerDisplayName}
        onSubmitReview={submitReview}
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
            onFindScholarships={() => setFrame('scholarship-list')}
          />
        );
      case Role.REVIEWER:
        return (
          <ReviewerDashboard
            reviewerName={reviewerDisplayName}
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

  const SupportModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
       <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl animate-in zoom-in-95 duration-200">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Scholarship Support</h3>
            <p className="text-sm text-slate-500 mt-1">We are here to help you 24/7</p>
          </div>
          
          <div className="space-y-3">
             <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors group">
                <div className="w-10 h-10 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-emerald-700">WhatsApp</p>
                  <p className="text-xs text-slate-500">+60 12-345 6789</p>
                </div>
             </a>
             
             <a href="mailto:scholarship@mmu.edu.my" className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-colors group">
                <div className="w-10 h-10 bg-white text-slate-600 rounded-full flex items-center justify-center shadow-sm group-hover:text-blue-600">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-700">Email Support</p>
                  <p className="text-xs text-slate-500">scholarship@mmu.edu.my</p>
                </div>
             </a>
             
             <button onClick={() => alert('Live Chat System: Connecting to available agent...')} className="w-full flex items-center gap-4 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div className="text-left">
                  <p className="font-bold">Start Live Chat</p>
                  <p className="text-xs text-blue-100">Available • Reply time: ~2m</p>
                </div>
             </button>
          </div>
       </div>
    </div>
  );

  const GenericPageScreen = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {showTopPanel && <TopPanel />}
      <div className="flex-1 p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setFrame('landing')}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
             {/* Header Section */}
             <div className="bg-slate-900 p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                   <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                         <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="100" height="100" fill="url(#grid)" />
                   </svg>
                </div>
                
                <div className="relative z-10">
                   <div className="w-24 h-24 bg-white/10 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-xl">
                      {genericPageContent?.imageIcon}
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">{genericPageContent?.title || 'Page'}</h1>
                   <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                     {genericPageContent?.description}
                   </p>
                </div>
             </div>
             
             {/* Content Section */}
             <div className="p-10 md:p-16">
                {/* Stats Grid */}
                {genericPageContent?.stats && (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-slate-100 pb-12">
                      {genericPageContent.stats.map((stat, idx) => (
                         <div key={idx} className="text-center">
                            <p className="text-3xl font-black text-blue-600 mb-1">{stat.value}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                         </div>
                      ))}
                   </div>
                )}
             
                <div className="grid md:grid-cols-2 gap-12">
                   <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         </div>
                         Key Highlights
                      </h3>
                      <ul className="space-y-4">
                         {genericPageContent?.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors group">
                               <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 group-hover:scale-125 transition-transform" />
                               <span className="text-slate-600 font-medium group-hover:text-blue-700">{feature}</span>
                            </li>
                         ))}
                      </ul>
                   </div>
                   
                   <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Want to know more?</h3>
                      <p className="text-slate-500 mb-6 leading-relaxed">Get detailed information about admission requirements, fees, and scholarship opportunities tailored for you.</p>
                      <button onClick={() => { setFrame('register'); }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mb-4">
                         Apply Now
                      </button>
                      <button className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors">
                         Download Brochure
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

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
        
        {/* Campus Dropdown */}
        <div className="relative group">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'campus' ? null : 'campus')}
            className={`flex items-center gap-1 hover:text-slate-900 transition-colors ${activeDropdown === 'campus' ? 'text-blue-600' : ''}`}
          >
            Campus
            <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'campus' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeDropdown === 'campus' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {NAV_ITEMS.campus.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const content = PAGE_CONTENT_MAP[option];
                    setGenericPageContent(content || { title: `${NAV_ITEMS.campus.label}: ${option}`, content: 'Content coming soon...' });
                    setFrame('generic-page');
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Why MMU Dropdown */}
        <div className="relative group">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'whyMMU' ? null : 'whyMMU')}
            className={`flex items-center gap-1 hover:text-slate-900 transition-colors ${activeDropdown === 'whyMMU' ? 'text-blue-600' : ''}`}
          >
            Why MMU
            <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'whyMMU' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeDropdown === 'whyMMU' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {NAV_ITEMS.whyMMU.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const content = PAGE_CONTENT_MAP[option];
                    setGenericPageContent(content || { title: `${NAV_ITEMS.whyMMU.label}: ${option}`, content: 'Content coming soon...' });
                    setFrame('generic-page');
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field of Study Dropdown */}
        <div className="relative group">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'fieldOfStudy' ? null : 'fieldOfStudy')}
            className={`flex items-center gap-1 hover:text-slate-900 transition-colors ${activeDropdown === 'fieldOfStudy' ? 'text-blue-600' : ''}`}
          >
            Field of Study
            <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'fieldOfStudy' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeDropdown === 'fieldOfStudy' && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {NAV_ITEMS.fieldOfStudy.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const content = PAGE_CONTENT_MAP[option];
                    setGenericPageContent(content || { title: `${NAV_ITEMS.fieldOfStudy.label}: ${option}`, content: 'Content coming soon...' });
                    setFrame('generic-page');
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Level of Study Dropdown */}
        <div className="relative group">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'levelOfStudy' ? null : 'levelOfStudy')}
            className={`flex items-center gap-1 hover:text-slate-900 transition-colors ${activeDropdown === 'levelOfStudy' ? 'text-blue-600' : ''}`}
          >
            Level of Study
            <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'levelOfStudy' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeDropdown === 'levelOfStudy' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {NAV_ITEMS.levelOfStudy.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const content = PAGE_CONTENT_MAP[option];
                    setGenericPageContent(content || { title: `${NAV_ITEMS.levelOfStudy.label}: ${option}`, content: 'Content coming soon...' });
                    setFrame('generic-page');
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
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

  const RoleSelectionScreen = () => (
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
              setUserData(prev => ({ ...prev, name: ROLE_DISPLAY_NAME[role] }));
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

  const LoginScreen = () => (
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
          <input type="text" placeholder="ID" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => { setIsLoggedIn(true); setFrame('dashboard'); }} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">Sign In</button>
          {selectedRole === Role.STUDENT && <button onClick={() => setFrame('register')} className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors">Register</button>}
        </div>
        </div>
      </div>
    </div>
  );

  const RegisterScreen = () => (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {showTopPanel && <TopPanel />}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 my-8">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Register</h2>
        <div className="flex flex-col gap-6 mb-8">
           <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none" placeholder="Full Name" />
           <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none" placeholder="Password" />
           <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none" placeholder="Email Address" />
        </div>
        <button onClick={() => setFrame('login')} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Create Account</button>
        </div>
      </div>
    </div>
  );


  const ApplicationFlow = () => (
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
                <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-32" placeholder="Detail your academic milestones and achievements..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Latest CGPA</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 3.95" />
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
            <div className="p-12 border-4 border-dashed border-slate-100 rounded-3xl text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => setUploadedFile('SPM_Certificate_Rivera.pdf')}>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm group-hover:text-blue-500 transition-colors">
                {ICONS.File}
              </div>
              {uploadedFile ? (
                <div className="text-emerald-600 font-bold">
                  ✓ {uploadedFile} Ready
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">Click to change file</p>
                </div>
              ) : (
                <div className="text-slate-400">
                  <p className="font-bold text-slate-600">Drag & Drop your document here</p>
                  <p className="text-sm">Mandatory for verification (PDF/JPG/PNG)</p>
                </div>
              )}
            </div>
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
                  {uploadedFile}
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

  const DashboardScreen = () => (
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
                <button onClick={() => setShowSupportModal(true)} className="text-[10px] font-bold text-blue-400 hover:text-blue-300">Contact Support →</button>
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
              filteredScholarships={filteredScholarships}
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
              onProfileFieldChange={updateProfileDraft}
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
    </div>
  );

  // --- RENDERER ---
  return (
    <>
      {showSupportModal && <SupportModal onClose={() => setShowSupportModal(false)} />}
      
      {(() => {
        switch (frame) {
          case 'landing': return <LandingScreen />;
          case 'choose-role': return <RoleSelectionScreen />;
          case 'login': return <LoginScreen />;
          case 'register': return <RegisterScreen />;
          case 'generic-page': return <GenericPageScreen />;
          case 'dashboard':
          case 'scholarship-list':
          case 'profile':
          case 'scholarship-editor':
          case 'system-logs':
          case 'system-reports':
          case 'account-management': return <DashboardScreen />;
          case 'apply-flow': return <ApplicationFlow />;
          default: return <LandingScreen />;
        }
      })()}
    </>
  );
};

export default PrototypeViewer;
