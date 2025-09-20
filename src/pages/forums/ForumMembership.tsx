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
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForumMembers, useApproveJoinRequest, useRejectJoinRequest } from '../../hooks/useForum';
import type { User } from '../../app/types/forum';

const ForumMembership: React.FC = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const [filters, setFilters] = useState<{ page: number; per_page: number }>({ page: 1, per_page: 10 });

  // Assume useForumMembers supports pagination with filters
  const { data, isLoading, error } = useForumMembers(forumId!, filters);
  const approveJoin = useApproveJoinRequest();
  const rejectJoin = useRejectJoinRequest();

  const handleFilterChange = (key: string, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApprove = (userId: string) => {
    approveJoin.mutate(
      { forumId: forumId!, userId },
      {
        onSuccess: () => toast.success('Join request approved'),
        onError: () => toast.error('Error approving join request'),
      }
    );
  };

  const handleReject = (userId: string) => {
    rejectJoin.mutate(
      { forumId: forumId!, userId },
      {
        onSuccess: () => toast.success('Join request rejected/removed'),
        onError: () => toast.error('Error rejecting join request'),
      }
    );
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />;
  if (error || !data) return <Typography color="error" sx={{ p: 3 }}>Error loading members</Typography>;

  const members = data.data || [];
  const pagination = data.meta?.pagination || { current_page: 1, total_pages: 1, total: 0 };

  console.log('Forum Members:', members);

  return (
    <Box sx={{ mt: 2, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Forum Membership
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="forum membership table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member: User) => (
              <TableRow key={member.id}>
                <TableCell>{member.username}</TableCell>
                <TableCell>
                  <Chip
                    label={member.forum_status?.status || 'unknown'}
                    color={
                      member.forum_status?.status === 'approved'
                        ? 'success'
                        : member.forum_status?.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                    aria-label={`Status: ${member.forum_status?.status}`}
                  />
                </TableCell>
                <TableCell>{member.forum_status?.approved_at || '-'}</TableCell>
                <TableCell>
                  {member.forum_status?.status === 'pending' ? (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleApprove(member.id.toString())}
                        sx={{ mr: 1 }}
                        aria-label={`Approve ${member.username}'s join request`}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleReject(member.id.toString())}
                        aria-label={`Reject ${member.username}'s join request`}
                      >
                        Reject
                      </Button>
                    </>
                  ) : member.forum_status?.status === 'approved' ? (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleReject(member.id.toString())}
                      aria-label={`Remove ${member.username} from forum`}
                    >
                      Remove
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
        <Button
          disabled={pagination.current_page === 1}
          onClick={() => handleFilterChange('page', pagination.current_page - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Typography>
          Page {pagination.current_page} of {pagination.total_pages} (Total: {pagination.total})
        </Typography>
        <Select
          value={filters.per_page}
          onChange={(e) => handleFilterChange('per_page', Number(e.target.value))}
          aria-label="Items per page"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={25}>25</MenuItem>
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