import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import UserList from './pages/users/UserList';
import UserEdit from './pages/users/UserEdit';
import ForumList from './pages/forums/ForumList';
import ForumEdit from './pages/forums/ForumEdit';
import EventList from './pages/events/EventList';
import BookList from './pages/books/BookList';

import ChallengeList from './pages/challenges/ChallengeList';
import ChallengeEdit from './pages/challenges/ChallengeEdit';
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
import ForumView from './pages/forums/ForumView';
import ThreadView from './pages/threads/ThreadView';
import ChallengeView from './pages/challenges/ChallengeView';

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
            {/* Public Route */}
            <Route path={routes.test} element={<Test />} />
            <Route path={routes.login} element={<Login />} />
               
            {/* 404 Catch-all Route - MUST BE LAST */}
            <Route path="*" element={<NotFoundPage />} />
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path={routes.admin.dashboard} element={<Dashboard />} />
                <Route path={routes.admin.users.index} element={<UserList />} />
                <Route path={routes.admin.users.edit(':id')} element={<UserEdit />} />
                <Route path={routes.admin.books.index} element={<BookList />} />
                <Route path={routes.admin.books.edit(':id')} element={<BookCreateOrEdit />} />
                <Route path={routes.admin.books.create} element={<BookCreateOrEdit />} />
                <Route path={routes.admin.forums.index} element={<ForumList />} />
                <Route path={routes.admin.forums.edit(':id')} element={<ForumEdit />} />
                <Route path={routes.admin.forums.get(':id')} element={<ForumView />} />
                <Route path={routes.admin.books.create} element={<BookCreateOrEdit />} />
                <Route path={routes.admin.forums.threads.index(':forumId')} element={<ForumList />} />
                <Route path={routes.admin.forums.threads.show(':id')} element={<ThreadView />} />
                <Route path={routes.admin.forums.threads.edit(':forumId', ':id')} element={<ForumView />} />
                <Route path={routes.admin.events.index} element={<EventList />} />
                <Route path={routes.admin.challenges.index} element={<ChallengeList />} />
                <Route path={routes.admin.challenges.edit(':id')} element={<ChallengeEdit />} />
                <Route path={routes.admin.challenges.view(':id')} element={<ChallengeView/>} />
                <Route path={routes.admin.moderation} element={<ContentModeration />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;