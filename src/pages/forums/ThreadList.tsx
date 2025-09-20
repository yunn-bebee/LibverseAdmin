import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {  Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useThreads, useToggleThreadPin, useToggleThreadLock, useDeleteThread } from '../../hooks/useForum';
import ThreadForm from './ThreadForm';
import type { Thread } from '../../app/types/forum';

const ThreadList: React.FC = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const [filters, setFilters] = useState<{ search?: string; page: number; per_page: number }>({ page: 1, per_page: 10 });
  const [openModal, setOpenModal] = useState(false);
  const [editThread, setEditThread] = useState<Thread | undefined>(undefined);

  const { data, isLoading, error } = useThreads(forumId!, filters, filters.per_page);
  const togglePin = useToggleThreadPin(forumId!);
  const toggleLock = useToggleThreadLock(forumId!);
  const deleteThread = useDeleteThread();

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : prev.page }));
  };

  const handleTogglePin = (threadId: string) => {
    togglePin.mutate(threadId, {
      onSuccess: () => toast.success('Pin toggled'),
      onError: () => toast.error('Error toggling pin'),
    });
  };

  const handleToggleLock = (threadId: string) => {
    toggleLock.mutate(threadId, {
      onSuccess: () => toast.success('Lock toggled'),
      onError: () => toast.error('Error toggling lock'),
    });
  };

  const handleDeleteThread = (threadId: string) => {
    if (window.confirm('Are you sure you want to delete this thread?')) {
      deleteThread.mutate(threadId, {
        onSuccess: () => toast.success('Thread deleted'),
        onError: () => toast.error('Error deleting thread'),
      });
    }
  };

  const handleEditThread = (thread: Thread) => {
    setEditThread(thread);
    setOpenModal(true);
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />;
  if (error || !data) return <Typography color="error" sx={{ p: 3 }}>Error loading threads</Typography>;

  const pagination = data?.meta.pagination || { current_page: 1, total_pages: 1, total: 0 };

  return (
    <Box sx={{ mt: 2, p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          size="small"
          aria-label="Search threads"
        />
        <Button variant="contained" onClick={() => { setEditThread(undefined); setOpenModal(true); }} aria-label="Create new thread">
          Create Thread
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="thread list table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Creator</TableCell>
              <TableCell>Pinned</TableCell>
              <TableCell>Locked</TableCell>
              <TableCell>Posts</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((thread: Thread) => (
              <TableRow key={thread.id}>
                <TableCell>
                  <Link to={`/admin/forums/threads/${thread.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {thread.title}
                  </Link>
                </TableCell>
                <TableCell>{thread.user.username}</TableCell>
                <TableCell>
                  <Switch
                    checked={!!thread.is_pinned}
                    onChange={() => handleTogglePin(thread.id.toString())}
                    aria-label={`Toggle pin for ${thread.title}`}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={!!thread.is_locked}
                    onChange={() => handleToggleLock(thread.id.toString())}
                    aria-label={`Toggle lock for ${thread.title}`}
                  />
                </TableCell>
                <TableCell>{thread.posts_count}</TableCell>
                <TableCell>{thread.created_at}</TableCell>
                <TableCell>
                
                  <IconButton onClick={() => handleEditThread(thread)} aria-label={`Edit ${thread.title}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteThread(thread.id.toString())} aria-label={`Delete ${thread.title}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
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
          size="small"
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
      <ThreadForm open={openModal} onClose={() => { setOpenModal(false); setEditThread(undefined); }} thread={editThread} />
    </Box>
  );
};

export default ThreadList;