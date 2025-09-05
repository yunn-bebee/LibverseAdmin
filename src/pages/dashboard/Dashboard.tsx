import React from 'react';
import {
  CssBaseline,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { useDashboardStats } from '../../hooks/useUsers';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  const handleEdit = (name: string) => {
    alert(`Edit user: ${name}`);
  };

  const handleDelete = (name: string) => {
    alert(`Delete user: ${name}`);
  };

  const handleBan = (name: string) => {
    alert(`Ban user: ${name}`);
  };

  const userTableData = [
    { name: 'Arthur', email: 'arthur@libverse.com', role: 'Admin' },
    { name: 'Bebee', email: 'bebee@libverse.com', role: 'Super Admin' },
  ];

  // User Roles Pie Chart Data
  const userRolesChartData = {
    labels: ['Admins', 'Moderators', 'Members'],
    datasets: [
      {
        data: stats ? [stats.users.by_role.admin, stats.users.by_role.moderator, stats.users.by_role.member] : [0, 0, 0],
        backgroundColor: ['rgba(1, 237, 196, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)'],
        borderColor: ['rgba(1, 237, 196, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Book Stats Bar Chart Data
  const bookStatsChartData = {
    labels: ['Total Books', 'Verified', 'Added (30 days)'],
    datasets: [
      {
        label: 'Book Statistics',
        data: stats ? [stats.books.total, stats.books.in_challenges, stats.books.added_last_30_days] : [0, 0, 0],
        backgroundColor: ['rgba(1, 237, 196, 0.5)', 'rgba(254, 228, 0, 0.5)', 'rgba(255, 0, 200, 0.5)'],
        borderColor: ['rgba(1, 237, 196, 1)', 'rgba(254, 228, 0, 1)', 'rgba(255, 0, 200, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
   <>
      <CssBaseline />
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {isLoading && <CircularProgress sx={{ alignSelf: 'center', my: 4 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.message || 'Failed to load dashboard data.'}
          </Alert>
        )}
        {stats && (
          <>
            <Box>
              <Typography variant="h1" sx={{ mb: 1 }}>
                System Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Summary of your platform's performance and statistics
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between' }}>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 200px', maxWidth: 300 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h5">{stats.users.total.toLocaleString()}</Typography>
                  <Box sx={{ bgcolor: 'primary.main', height: 4, borderRadius: 2, mt: 2, opacity: 0.2 }}>
                    <Box
                      sx={{
                        width: `${(stats.users.by_role.moderator / stats.users.total) * 100}%`,
                        bgcolor: 'primary.main',
                        height: '100%',
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Active (30 days): none
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 200px', maxWidth: 300 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Books
                  </Typography>
                  <Typography variant="h5">{stats.books.total.toLocaleString()}</Typography>
                  <Box sx={{ bgcolor: 'warning.main', height: 4, borderRadius: 2, mt: 2, opacity: 0.2 }}>
                    <Box
                      sx={{
                        width: `${(stats.books.added_last_30_days / stats.books.total) * 100}%`,
                        bgcolor: 'warning.main',
                        height: '100%',
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    In Challenges: {stats.books.added_last_30_days.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 200px', maxWidth: 300 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Forums
                  </Typography>
                  <Typography variant="h5">{stats.forums.total}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Public: {stats.forums.public} | Private: {stats.forums.private}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 200px', maxWidth: 300 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Events
                  </Typography>
                  <Typography variant="h5">{stats.events.total}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Upcoming: {stats.events.upcoming}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between' }}>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 400px', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Roles Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Pie
                      data={userRolesChartData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { font: { family: 'Inter' } } },
                          tooltip: {
                            callbacks: {
                              label: (tooltipItem) => {
                                const label = tooltipItem.label || '';
                                const value = typeof tooltipItem.raw === 'number' ? tooltipItem.raw : 0;
                                const dataset = tooltipItem.dataset;
                                const total = Array.isArray(dataset.data)
                                  ? (dataset.data as number[]).reduce((a, b) => a + b, 0)
                                  : 0;
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 400px', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Book Statistics
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar
                      data={bookStatsChartData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, ticks: { color: '#4A3C8C' } },
                          x: { ticks: { color: '#4A3C8C' } },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Card sx={{ bgcolor: 'background.paper', mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Management
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {['Name', 'Email', 'Role', 'Actions'].map((header) => (
                          <TableCell key={header}>{header}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userTableData.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 1, mr: 2 }}>
                                <PersonIcon sx={{ color: 'primary.contrastText' }} />
                              </Box>
                              {user.name}
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                bgcolor: user.role === 'Admin' ? 'primary.main' : 'secondary.main',
                                color: user.role === 'Admin' ? 'primary.contrastText' : 'secondary.contrastText',
                                borderRadius: 2,
                                px: 1,
                                py: 0.5,
                                display: 'inline-block',
                              }}
                            >
                              {user.role}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(user.name)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleBan(user.name)}>
                              <BlockIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(user.name)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between' }}>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 400px', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Admins</Typography>
                      <Typography variant="h6">{stats.users.by_role.admin}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#4CAF50', color: '#FFFFFF', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Moderators</Typography>
                      <Typography variant="h6">{stats.users.by_role.moderator}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#9C27B0', color: '#FFFFFF', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Members</Typography>
                      <Typography variant="h6">{stats.users.by_role.member}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#F44336', color: '#FFFFFF', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Banned</Typography>
                      <Typography variant="h6">{stats.users.by_status.banned}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Pending: {stats.users.by_status.pending}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 400px', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Content Statistics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Threads</Typography>
                      <Typography variant="body2">{stats.threads.total.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'background.default', height: 4, borderRadius: 2 }}>
                      <Box
                        sx={{
                          width: `${(stats.threads.locked / stats.threads.total) * 100}%`,
                          bgcolor: 'secondary.main',
                          height: '100%',
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Locked: {stats.threads.locked}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Posts</Typography>
                      <Typography variant="body2">{stats.posts.total.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'background.default', height: 4, borderRadius: 2 }}>
                      <Box
                        sx={{
                          width: `${(stats.posts.flagged / stats.posts.total) * 100}%`,
                          bgcolor: 'secondary.main',
                          height: '100%',
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Flagged: {stats.posts.flagged}
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Books Added (30 days)</Typography>
                      <Typography variant="body2">{stats.books.added_last_30_days}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 400px', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Challenge Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ bgcolor: 'warning.main', color: 'warning.contrastText', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Total Challenges</Typography>
                      <Typography variant="h6">{stats.challenges.total}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#4CAF50', color: '#FFFFFF', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Active Challenges</Typography>
                      <Typography variant="h6">{stats.challenges.active}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Participants</Typography>
                      <Typography variant="h6">{stats.challenges.total_participants.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#9C27B0', color: '#FFFFFF', p: 2, borderRadius: 2, flex: '1 1 150px' }}>
                      <Typography variant="body2">Completions</Typography>
                      <Typography variant="h6">{stats.challenges.completions.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: 'background.paper', flex: '1 1 400px', maxWidth: 600 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Event Statistics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total RSVPs
                    </Typography>
                    <Typography variant="h5">{stats.events.total_rsvps.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Average RSVPs per Event
                    </Typography>
                    <Typography variant="h5">{stats.events.avg_rsvps_per_event.toFixed(1)}</Typography>
                  </Box>
                  <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      Active Threads: {stats.forums.active_threads}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ bgcolor: 'background.paper', py: 4, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                &copy; 2025 Libiverse. All rights reserved.
              </Typography>
            </Box>
          </>
        )}
      </Box>
   </>
  );
};

export default Dashboard;
