const React = require('react');
const { useState } = React;
const { BrowserRouter, Routes, Route, Navigate, useLocation } = require('react-router-dom');

const Login = require('../views/Login.js');
const Sessions = require('../views/Sessions.js');
const Register = require('../views/Register.js');
const Profile = require('../views/Profile.js');
const TestingView = require('../views/testingView.js');
const CancelView = require('../views/CancelView.js');
const CreateSession = require('../views/createSession.js');
const TutorProfile = require('../views/TutorProfile.js');
const SessionVistaParaTutor = require('../views/SessionVistaParaTutor.js');
const TestingHeader = require('../views/VistaDePruebaHeader.js');
const SessionsHistory = require('../views/SessionsHistory.js');
const Absence = require('../views/Absence.js');
const Searchtutor = require('../views/Searchtutor.js');

require('../css/Register.css');
require('../css/Router.css');

const Sidebar = require('../components/Sidebar.js');
const Header = require('../components/HeaderGeneral.js');

const AppContent = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const excludedHeaderRoutes = ['/api/login', '/', '/register']; // Rutas donde no quieres mostrar el Header
  return (
    <>
      {!excludedHeaderRoutes.includes(location.pathname) && (
        <>
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
        </>
      )}
      <div className={`app-content ${isSidebarOpen ? 'shifted' : ''}`} style={{ marginTop: isSidebarOpen ? '80px' : '60px' }}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/api/login" />} />
          <Route path="/api/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/SessionVistaEstudiante/:sessionId' element={<SessionVistaParaTutor />} />
          <Route path="/cancel-session/:sessionId" element={<CancelView />} />
          <Route path="/sessions/create" element={<CreateSession />} />
          <Route path='/sessions-history' element={<SessionsHistory />} />
          <Route path='/absence' element={<Absence />} />
          <Route path='/tutorprofile' element={<TutorProfile />} />
          <Route path='/seachtutor' element={<Searchtutor />} />
        </Routes>
      </div>
    </>
  );
};


const AppRouter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <AppContent isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </BrowserRouter>
  );
};

export default AppRouter;
