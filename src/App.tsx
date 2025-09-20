import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import UserList from './pages/users/UserList';
import UserEdit from './pages/users/UserEdit';

import EventList from './pages/events/EventList';
import BookList from './pages/books/BookList';
import ChallengeList from './pages/challenges/ChallengeList';
import ChallengeForm from './pages/challenges/ChallengeForm';
import ContentModeration from './pages/moderation/ContentModeration';
import Login from './pages/login/Login';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './app/route';
import ProtectedRoute from './middleware/ProtectedRoute';
import Test from './pages/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import BookCreateOrEdit from './pages/books/BookEdit';
import NotFoundPage from './pages/NotFound';
import ChallengeView from './pages/challenges/ChallengeView';
import ChallengeParticipants from './pages/challenges/ChallengeParticipant';
import ChallengeBookList from './pages/challenges/ChallengeBookList';
import BadgeManagement from './pages/challenges/BadgeManagement';
import ForumDetail from './pages/forums/ForumDetails';
// import ForumForm from './pages/forums/ForumForm';
import ForumManagementDashboard from './pages/forums/ForumManagementDashboard';
import ForumMembership from './pages/forums/ForumMembership';
import ReportedPosts from './pages/forums/ReportedPosts';
import ThreadDetail from './pages/forums/ThreadDetails';
// import ThreadForm from './pages/forums/ThreadForm';
import ThreadList from './pages/forums/ThreadList';

// Create a single instance of queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path={routes.test} element={<Test />} />
            <Route path={routes.login} element={<Login />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path={routes.admin.dashboard} element={<Dashboard />} />

                {/* User Management */}
                <Route path={routes.admin.users.index} element={<UserList />} />
                <Route path={routes.admin.users.edit(':id')} element={<UserEdit />} />

                {/* Book Management */}
                <Route path={routes.admin.books.index} element={<BookList />} />
                <Route path={routes.admin.books.edit(':id')} element={<BookCreateOrEdit />} />
                <Route path={routes.admin.books.create} element={<BookCreateOrEdit />} />

                {/* Forum Management */}
                <Route path={routes.admin.forums.index} element={<ForumManagementDashboard />} />
                {/* <Route path={routes.admin.forums.create} element={<ForumForm />} /> */}
                <Route path={routes.admin.forums.get(':forumId')} element={<ForumDetail />} />
   
                <Route path={routes.admin.forums.threads.index(':forumId')} element={<ThreadList />} />
            
                <Route path={routes.admin.forums.threads.show( ':threadId')} element={<ThreadDetail />} />
                <Route path={routes.admin.forums.members(':forumId')} element={<ForumMembership />} />
                <Route path={routes.admin.posts.reported} element={<ReportedPosts />} />
                {/* <Route path={routes.admin.posts.activityFeed} element={<ActivityFeed />} /> */}

                {/* Event Management */}
                <Route path={routes.admin.events.index} element={<EventList />} />

                {/* Challenge Management */}
                <Route path={routes.admin.challenges.index} element={<ChallengeList />} />
                <Route path={routes.admin.challenges.create} element={<ChallengeForm />} />
                <Route path={routes.admin.challenges.edit(':id')} element={<ChallengeForm />} />
                <Route path={routes.admin.challenges.view(':id')} element={<ChallengeView />} /> 
                <Route path={routes.admin.challenges.participants(':challengeId')} element={<ChallengeParticipants />} />
                <Route path={routes.admin.challenges.books(':challengeId')} element={<ChallengeBookList />} />
                <Route path={routes.admin.challenges.badges} element={<BadgeManagement />} />

                {/* Content Moderation */}
                <Route path={routes.admin.moderation} element={<ContentModeration />} />
              </Route>
            </Route>

            {/* 404 Catch-all Route - MUST BE LAST */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;