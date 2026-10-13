import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import CompanyDirectory from './pages/CompanyDirectory';
import CompanyDetails from './pages/CompanyDetails';
import JobsList from './pages/JobsList';
import MyApplications from './pages/MyApplications';
import PracticeZone from './pages/PracticeZone';
import CodingPractice from './pages/CodingPractice';
import AptitudePractice from './pages/AptitudePractice';
import TechnicalPrep from './pages/TechnicalPrep';
import HrPrep from './pages/HrPrep';
import MockPlacementTest from './pages/MockPlacementTest';
import MockInterviewRoom from './pages/MockInterviewRoom';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';
import StudyPlanner from './pages/StudyPlanner';
import AiPlacementAssistant from './pages/AiPlacementAssistant';
import NotificationsPage from './pages/NotificationsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import CompanyManagement from './pages/CompanyManagement';
import DriveManagement from './pages/DriveManagement';
import ApplicationManagement from './pages/ApplicationManagement';
import AdminQuestions from './pages/AdminQuestions';
import AdminMockTests from './pages/AdminMockTests';
import AdminNotifications from './pages/AdminNotifications';
import AdminReports from './pages/AdminReports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRole="ROLE_STUDENT" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/companies" element={<CompanyDirectory />} />
            <Route path="/student/companies/:id" element={<CompanyDetails />} />
            <Route path="/student/jobs" element={<JobsList />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/practice" element={<PracticeZone />} />
            <Route path="/student/practice/coding" element={<CodingPractice />} />
            <Route path="/student/practice/aptitude" element={<AptitudePractice />} />
            <Route path="/student/practice/technical" element={<TechnicalPrep />} />
            <Route path="/student/practice/hr" element={<HrPrep />} />
            <Route path="/student/practice/mock-test" element={<MockPlacementTest />} />
            <Route path="/student/mock-interviews" element={<MockInterviewRoom />} />
            <Route path="/student/resume" element={<ResumeAnalyzer />} />
            <Route path="/student/skill-gap" element={<SkillGapAnalyzer />} />
            <Route path="/student/study-plan" element={<StudyPlanner />} />
            <Route path="/student/ai-assistant" element={<AiPlacementAssistant />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRole="ROLE_ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/companies" element={<CompanyManagement />} />
            <Route path="/admin/drives" element={<DriveManagement />} />
            <Route path="/admin/applications" element={<ApplicationManagement />} />
            <Route path="/admin/questions" element={<AdminQuestions />} />
            <Route path="/admin/mock-tests" element={<AdminMockTests />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
