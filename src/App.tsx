import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import UserList from './pages/users/UserList';
import UserEdit from './pages/users/UserEdit';
import ForumList from './pages/forums/ForumList';
import ForumEdit from './pages/forums/ForumEdit';
import EventList from './pages/events/EventList';
import EventEdit from './pages/events/EventEdit';
import ChallengeList from './pages/challenges/ChallengeList';
import ChallengeEdit from './pages/challenges/ChallengeEdit';
import ContentModeration from './pages/moderation/ContentModeration';
import Login from './pages/login/Login';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './app/route';
import ProtectedRoute from './middleware/ProtectedRoute';
import Test from './pages/test';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}

          <Route path={routes.test} element={<Test />} />
          <Route path={routes.login} element={<Login />} />
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path={routes.admin.dashboard} element={<Dashboard />} />
              <Route path={routes.admin.users.index} element={<UserList />} />
              <Route path={routes.admin.users.edit(':id')} element={<UserEdit />} />
              <Route path={routes.admin.forums.index} element={<ForumList />} />
              <Route path={routes.admin.forums.edit(':id')} element={<ForumEdit />} />
              <Route path={routes.admin.events.index} element={<EventList />} />
              <Route path={routes.admin.events.edit(':id')} element={<EventEdit />} />
              <Route path={routes.admin.challenges.index} element={<ChallengeList />} />
              <Route path={routes.admin.challenges.edit(':id')} element={<ChallengeEdit />} />
              <Route path={routes.admin.moderation} element={<ContentModeration />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
