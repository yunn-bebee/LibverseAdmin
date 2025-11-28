import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForumMembers, useApproveJoinRequest, useRejectJoinRequest } from '../../hooks/useForum';
import type { User } from '../../app/types/forum';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`members-tabpanel-${index}`}
      aria-labelledby={`members-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ForumMembership: React.FC = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<{ page: number; per_page: number }>({ page: 1, per_page: 10 });

  const { data, isLoading, error, refetch } = useForumMembers(forumId!, filters);
  const approveJoin = useApproveJoinRequest();
  const rejectJoin = useRejectJoinRequest();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to page 1 when switching tabs
  };

  const handleFilterChange = (key: string, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApprove = (userId: string) => {
    approveJoin.mutate(
      { forumId: forumId!, userId },
      {
        onSuccess: () => {
          toast.success('Join request approved');
          refetch(); // Refresh the data
        },
        onError: () => toast.error('Error approving join request'),
      }
    );
  };

  const handleReject = (userId: string) => {
    rejectJoin.mutate(
      { forumId: forumId!, userId },
      {
        onSuccess: () => {
          toast.success('Join request rejected');
          refetch(); // Refresh the data
        },
        onError: () => toast.error('Error rejecting join request'),
      }
    );
  };

  const handleRemove = (userId: string) => {
    rejectJoin.mutate(
      { forumId: forumId!, userId },
      {
        onSuccess: () => {
          toast.success('Member removed from forum');
          refetch(); // Refresh the data
        },
        onError: () => toast.error('Error removing member'),
      }
    );
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />;
  if (error || !data) return <Typography color="error" sx={{ p: 3 }}>Error loading members</Typography>;

  const allMembers = data.data || [];
  const pagination = data.meta?.pagination || { current_page: 1, total_pages: 1, total: 0 };

  // Filter members based on tab
  const approvedMembers = allMembers.filter((member: User) => member.forum_status?.status === 'approved');
  const pendingRequests = allMembers.filter((member: User) => member.forum_status?.status === 'pending');
  const rejectedMembers = allMembers.filter((member: User) => member.forum_status?.status === 'rejected');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMemberRow = (member: User, showActions: boolean = true) => (
    <TableRow key={member.id}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {member.profile?.profilePicture && (
            <Box
              component="img"
              src={member.profile.profilePicture}
              alt={member.username}
              sx={{ width: 32, height: 32, borderRadius: '50%' }}
            />
          )}
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {member.username}
            </Typography>
            {member.profile?.bio && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {member.profile.bio.substring(0, 50)}...
              </Typography>
            )}
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={member.forum_status?.status?.toUpperCase() || 'UNKNOWN'}
          color={getStatusColor(member.forum_status?.status || '')}
          size="small"
        />
      </TableCell>
      <TableCell>
        {formatDate(member.forum_status?.approved_at || member.createdAt)}
      </TableCell>
      {showActions && (
        <TableCell>
          {member.forum_status?.status === 'pending' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleApprove(member.id.toString())}
                disabled={approveJoin.isPending}
                aria-label={`Approve ${member.username}'s join request`}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleReject(member.id.toString())}
                disabled={rejectJoin.isPending}
                aria-label={`Reject ${member.username}'s join request`}
              >
                Reject
              </Button>
            </Box>
          )}
          {member.forum_status?.status === 'approved' && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleRemove(member.id.toString())}
              disabled={rejectJoin.isPending}
              aria-label={`Remove ${member.username} from forum`}
            >
              Remove
            </Button>
          )}
          {member.forum_status?.status === 'rejected' && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleApprove(member.id.toString())}
              disabled={approveJoin.isPending}
              aria-label={`Re-approve ${member.username}`}
            >
              Re-approve
            </Button>
          )}
        </TableCell>
      )}
    </TableRow>
  );

  return (
    <Box sx={{ mt: 2, p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Forum Membership Management
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="forum membership tabs">
          <Tab 
            label={`All Members (${allMembers.length})`} 
            id="members-tab-0"
            aria-controls="members-tabpanel-0"
          />
          <Tab 
            label={`Approved (${approvedMembers.length})`} 
            id="members-tab-1"
            aria-controls="members-tabpanel-1"
          />
          <Tab 
            label={`Pending Requests (${pendingRequests.length})`} 
            id="members-tab-2"
            aria-controls="members-tabpanel-2"
          />
          <Tab 
            label={`Rejected (${rejectedMembers.length})`} 
            id="members-tab-3"
            aria-controls="members-tabpanel-3"
          />
        </Tabs>

        {/* All Members Tab */}
        <TabPanel value={activeTab} index={0}>
          <TableContainer>
            <Table aria-label="all forum members table">
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined/Requested</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Alert severity="info">No members found</Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  allMembers.map((member: User) => renderMemberRow(member))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Approved Members Tab */}
        <TabPanel value={activeTab} index={1}>
          <TableContainer>
            <Table aria-label="approved members table">
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Alert severity="info">No approved members</Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedMembers.map((member: User) => renderMemberRow(member))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Pending Requests Tab */}
        <TabPanel value={activeTab} index={2}>
          <TableContainer>
            <Table aria-label="pending requests table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requested</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Alert severity="info">No pending join requests</Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((member: User) => renderMemberRow(member))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Rejected Members Tab */}
        <TabPanel value={activeTab} index={3}>
          <TableContainer>
            <Table aria-label="rejected members table">
              <TableHead>
                  <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rejected Date</TableCell>
                  <TableCell>Actions</TableCell></TableRow>
                </TableHead>
          
              <TableBody>
                {rejectedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Alert severity="info">No rejected members</Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  rejectedMembers.map((member: User) => renderMemberRow(member))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
        <Button
          disabled={pagination.current_page === 1}
          onClick={() => handleFilterChange('page', pagination.current_page - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>
        
        <Typography variant="body2">
          Page {pagination.current_page} of {pagination.total_pages} (Total: {pagination.total})
        </Typography>
        
        <Select
          value={filters.per_page}
          onChange={(e) => handleFilterChange('per_page', Number(e.target.value))}
          aria-label="Items per page"
          size="small"
        >
          <MenuItem value={10}>10 per page</MenuItem>
          <MenuItem value={15}>15 per page</MenuItem>
          <MenuItem value={25}>25 per page</MenuItem>
          <MenuItem value={50}>50 per page</MenuItem>
        </Select>
        
        <Button
          disabled={pagination.current_page === pagination.total_pages}
          onClick={() => handleFilterChange('page', pagination.current_page + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ForumMembership;