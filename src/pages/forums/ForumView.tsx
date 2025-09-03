import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  Card, 
  CardContent, 
  Breadcrumbs,
  IconButton,
  Chip,
  TextField,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Home,
  Add,
  ArrowBack,
  Delete,
  Edit,
  Visibility,
  VisibilityOff,
  Forum
} from '@mui/icons-material';
import type { Thread } from '../../app/types/forum';
import { useForum, useThreads, useDeleteForum, useCreateThread, useToggleForumPublic } from '../../hooks/useForum';
import { routes } from '../../app/route';

const ForumView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState<boolean>(false);
  const [newThreadData, setNewThreadData] = useState<Partial<Thread>>({
    title: '',
    content: ''
  });

  // Queries
  const { 
    data: forum, 
    isLoading: isForumLoading, 
    error: forumError 
  } = useForum(id || '');

  const { 
    data: threadsResponse, 
    isLoading: isThreadsLoading, 
    error: threadsError,
    refetch: refetchThreads
  } = useThreads(id || '', { search: searchQuery }, perPage);

  // Mutations
  const deleteForumMutation = useDeleteForum();
  const createThreadMutation = useCreateThread(id || '');
  const toggleForumPublicMutation = useToggleForumPublic();

  // Derived data
  const threads: Thread[] = threadsResponse?.data || [];
  const totalPages: number = threadsResponse?.meta?.total_pages || 1;

  // Handlers
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleToggleVisibility = async (): Promise<void> => {
    if (!forum || !id) return;
    
    try {
      await toggleForumPublicMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to toggle forum visibility:', error);
    }
  };

  const handleDeleteForum = async (): Promise<void> => {
    if (!id) return;
    
    try {
      await deleteForumMutation.mutateAsync(id);
      navigate('/forums');
    } catch (error) {
      console.error('Failed to delete forum:', error);
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleCreateThread = async (): Promise<void> => {
    try {
      await createThreadMutation.mutateAsync(newThreadData);
      setIsCreateThreadOpen(false);
      setNewThreadData({ title: '', content: '' });
      refetchThreads();
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  if (isForumLoading) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        {/* Breadcrumbs Skeleton */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Skeleton width={100} />
          <Skeleton width={100} />
          <Skeleton width={100} />
        </Breadcrumbs>

        {/* Header Skeleton */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={200} height={40} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={120} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Stack>
        </Stack>

        {/* Forum Info Skeleton */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} mb={2}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="text" width={100} height={24} />
            </Stack>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
          </CardContent>
        </Card>

        {/* Search and Threads Header Skeleton */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Skeleton variant="text" width={100} height={36} />
          <Skeleton variant="rounded" width={300} height={40} />
        </Stack>

        {/* Thread List Skeleton */}
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  if (forumError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading forum: {(forumError as Error).message}</Typography>
        <Button onClick={() => navigate('/forums')} startIcon={<ArrowBack />}>
          Back to forums
        </Button>
      </Box>
    );
  }

  if (!forum) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Forum not found</Typography>
        <Button onClick={() => navigate('/forums')} startIcon={<ArrowBack />}>
          Back to forums
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          <Typography color="text.primary">Home</Typography>
        </Link>
        <Link to="/forums" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Forum sx={{ mr: 0.5 }} fontSize="inherit" />
          <Typography color="text.primary">Forums</Typography>
        </Link>
        <Typography color="text.primary">
          {forum.name}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">{forum.name}</Typography>
        </Stack>
        
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreateThreadOpen(true)}
          >
            New Thread
          </Button>
          <IconButton 
            onClick={handleToggleVisibility} 
            disabled={toggleForumPublicMutation.isPending}
          >
            {toggleForumPublicMutation.isPending ? (
              <CircularProgress size={24} />
            ) : forum.is_public ? (
              <VisibilityOff />
            ) : (
              <Visibility />
            )}
          </IconButton>
          <IconButton onClick={() => setIsDeleteConfirmOpen(true)}>
            <Delete color="error" />
          </IconButton>
          <IconButton onClick={() => navigate(`/forums/${id}/edit`)}>
            <Edit color="primary" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Forum Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Chip label={forum.category} color="primary" size="small" />
            <Chip 
              label={forum.is_public ? 'Public' : 'Private'} 
              variant="outlined" 
              size="small" 
            />
            <Typography variant="body2" color="text.secondary">
              {threadsResponse?.meta?.total || 0} threads
            </Typography>
          </Stack>
          <Typography variant="body1" paragraph>
            {forum.description || 'No description available.'}
          </Typography>
        </CardContent>
      </Card>

      {/* Search and Threads Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Threads
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search threads..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
        />
      </Stack>

      {/* Thread List */}
      {isThreadsLoading ? (
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : threadsError ? (
        <Card sx={{ p: 3 }}>
          <Typography color="error">
            Error loading threads: {(threadsError as Error).message}
          </Typography>
        </Card>
      ) : threads.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {searchQuery 
              ? 'No threads match your search.' 
              : 'No threads in this forum yet.'}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => setIsCreateThreadOpen(true)}
            startIcon={<Add />}
          >
            Create First Thread
          </Button>
        </Card>
      ) : (
        <>
          <Stack spacing={2}>
            {threads.map((thread: Thread) => (
              <Card 
                key={thread.id} 
                sx={{ cursor: 'pointer' }} 
                onClick={() => navigate(routes.admin.forums.threads.show(thread.id.toString()))}
              >
                <CardContent>
                  <Typography variant="h6">{thread.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Started by {thread.user?.username || 'Unknown'} • {thread.posts_count} posts
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(thread.updated_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Create Thread Dialog */}
      <Dialog open={isCreateThreadOpen} onClose={() => setIsCreateThreadOpen(false)}>
        <DialogTitle>Create New Thread</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newThreadData.title}
            onChange={(e) => setNewThreadData({...newThreadData, title: e.target.value})}
            sx={{ mt: 2, mb: 2 }}
            error={!newThreadData.title && createThreadMutation.isError}
            helperText={!newThreadData.title && createThreadMutation.isError ? 'Title is required' : ''}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={newThreadData.content}
            onChange={(e) => setNewThreadData({...newThreadData, content: e.target.value})}
            sx={{ mb: 2 }}
            error={!newThreadData.content && createThreadMutation.isError}
            helperText={!newThreadData.content && createThreadMutation.isError ? 'Content is required' : ''}
          />
          {createThreadMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to create thread: {(createThreadMutation.error as Error)?.message || 'An error occurred'}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="outlined" 
            onClick={() => setIsCreateThreadOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateThread}
            disabled={createThreadMutation.isPending || !newThreadData.title || !newThreadData.content}
            startIcon={createThreadMutation.isPending ? <CircularProgress size={20} /> : null}
          >
            Create Thread
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Forum</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete the forum "{forum.name}"? All threads and replies will be permanently removed.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Alert>
          {deleteForumMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to delete forum: {(deleteForumMutation.error as Error)?.message || 'An error occurred'}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="outlined" 
            onClick={() => setIsDeleteConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteForum}
            disabled={deleteForumMutation.isPending}
            startIcon={deleteForumMutation.isPending ? <CircularProgress size={20} /> : null}
          >
            Delete Forum
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumView;