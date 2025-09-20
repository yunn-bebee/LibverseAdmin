// src/components/admin/forums/ReportedPosts.tsx
import React, { useState } from 'react';
import { Box, Button, CircularProgress, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Delete as DeleteIcon, Flag as FlagIcon, FlagOutlined as UnflagIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useReportedPosts, useUnflagPost, useFlagPost, useDeletePost } from '../../hooks/useForum';
import type { Post } from '../../app/types/forum';

const ReportedPosts: React.FC = () => {
  const [filters, setFilters] = useState<{ page: number }>({ page: 1 });
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, error } = useReportedPosts();
  const unflagPost = useUnflagPost();
  const flagPost = useFlagPost();
  const deletePost = useDeletePost();

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleUnflag = (postId: string) => {
    unflagPost.mutate(postId, {
      onSuccess: () => toast.success('Post unflagged'),
      onError: () => toast.error('Error unflagging post'),
    });
  };

  const handleFlag = (postId: string) => {
    flagPost.mutate(postId, {
      onSuccess: () => toast.success('Post flagged'),
      onError: () => toast.error('Error flagging post'),
    });
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Are you sure?')) {
      deletePost.mutate(postId, {
        onSuccess: () => toast.success('Post deleted'),
        onError: () => toast.error('Error deleting post'),
      });
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading reported posts</Typography>;

  // Assume data is array, not paginated in hook, adjust if needed
  const posts = data || [];
  const pagination = { current_page: 1, total_pages: 1 };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reported Posts with Page {filters.page}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Flag Reason</TableCell>
              <TableCell>Flagged At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post: Post) => (
              <TableRow key={post.id}>
                <TableCell>{post.content.substring(0, 50)}...</TableCell>
                <TableCell>{post.user.id}</TableCell>
                <TableCell>{post.flag_reason || (post.reports?.[0]?.reason)}</TableCell>
                <TableCell>{post.created_at}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleUnflag(post.id.toString())} aria-label="unflag">
                    <UnflagIcon />
                  </IconButton>
                  {!post.is_flagged && (
                    <IconButton onClick={() => handleFlag(post.id.toString())} aria-label="flag">
                      <FlagIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(post.id.toString())} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button disabled={pagination.current_page === 1} onClick={() => handleFilterChange('page', pagination.current_page - 1)}>
          Previous
        </Button>
        <Select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </Select>
        <Button disabled={pagination.current_page === pagination.total_pages} onClick={() => handleFilterChange('page', pagination.current_page + 1)}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ReportedPosts;