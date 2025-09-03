/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteForum, useForums, useToggleForumPublic } from '../../hooks/useForum';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Skeleton,
  Button,
  Pagination,
  IconButton,
  useTheme,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip
} from '@mui/material';
import {
  Add,
  Search,
  Tune,
  Delete,
  Edit,
  Visibility,
  VisibilityOff,
  Warning,
  Info,
  Refresh
} from '@mui/icons-material';
import type { Forum } from '../../app/types/forum';
import { routes } from '../../app/route';

interface ForumResponse {
  success: boolean;
  message: string;
  data: Forum[];
  errors: Record<string, string[]>;
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    [key: string]: any;
  };
}

const ForumList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    is_public: undefined as boolean | undefined
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [forumToDelete, setForumToDelete] = useState<Forum | null>(null);
  
  const { data, isLoading, isError, error } = useForums(
    { 
      category: filters.category, 
      search: filters.search, 
      is_public: filters.is_public 
    }, 
    perPage
  );

  const { mutate: togglePublic, isPending: isTogglingPublic } = useToggleForumPublic();

  const forumResponse = data as ForumResponse;
  const forums = forumResponse?.data || [];
  const pagination = forumResponse?.meta.pagination || {
    current_page: 1,
    per_page: perPage,
    total: 0,
    total_pages: 1
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
    setPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (e: any) => {
    setFilters({ ...filters, category: e.target.value });
    setPage(1); // Reset to first page when changing category
  };

  const handlePerPageChange = (e: any) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleCreateForum = () => {
    navigate(routes.admin.forums.create);
  };

  const handleEditForum = (id: string) => {
    navigate(`/admin/forums/edit/${id}`); // Use routes.admin.forums.edit(id) if available
  };

  const toggleVisibility = (forum: Forum) => {
    togglePublic(forum.id.toString(), {
      onSuccess: () => {
        console.log(`Toggled visibility for forum ${forum.id} to ${!forum.is_public}`);
      },
      onError: (error) => {
        console.error('Failed to toggle visibility:', error);
      }
    });
  };

  const openDeleteDialog = (forum: Forum) => {
    setForumToDelete(forum);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setForumToDelete(null);
  };

  const deleteMutation = useDeleteForum();
  const confirmDelete = async () => {
    if (forumToDelete) {
      await deleteMutation.mutateAsync(forumToDelete.id.toString());
      closeDeleteDialog();
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleShowHidden = () => {
    setFilters({ ...filters, is_public: filters.is_public === false ? undefined : false });
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderStatusMessage = () => {
    if (isError) {
      return (
        <Card sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: theme.palette.error.light,
          borderLeft: `4px solid ${theme.palette.error.main}`
        }}>
          <Box sx={{ mb: 2 }}>
            <Warning color="error" sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h5" color="error" gutterBottom>
            Failed to Load Forums
          </Typography>
          <Alert severity="error" sx={{ mb: 3, justifyContent: 'center' }}>
            {error?.message || 'An unexpected error occurred while loading forums.'}
          </Alert>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => window.location.reload()}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        </Card>
      );
    }

    if (!isLoading && forums.length === 0) {
      return (
        <Card sx={{ 
          textAlign: 'center', 
          p: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 'none',
          border: `1px dashed ${theme.palette.divider}`
        }}>
          <Box sx={{ mb: 2 }}>
            <Info color="action" sx={{ fontSize: 60, opacity: 0.5 }} />
          </Box>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            No Forums Found
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            {filters.search || filters.category || filters.is_public === false 
              ? 'No forums match your current filters.'
              : 'There are no forums available yet.'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            {(filters.search || filters.category || filters.is_public === false) && (
              <Button 
                variant="outlined" 
                onClick={() => setFilters({ category: '', search: '', is_public: undefined })}
              >
                Clear Filters
              </Button>
            )}
            <Button 
              variant="contained" 
              onClick={handleCreateForum}
              startIcon={<Add />}
            >
              Create First Forum
            </Button>
          </Stack>
        </Card>
      );
    }

    return null;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Manage Forums
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateForum}
        >
          Create Forum
        </Button>
      </Stack>

      {/* Search and Filter Bar */}
      <Stack direction="row" spacing={1} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search forums..."
          value={filters.search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            sx: { borderRadius: 1 }
          }}
        />
        <Tooltip title="Toggle filters">
          <IconButton 
            onClick={toggleFilters}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1
            }}
          >
            <Tune />
          </IconButton>
        </Tooltip>
        <Tooltip title={filters.is_public === false ? "Show all forums" : "Show private forums"}>
          <IconButton 
            onClick={toggleShowHidden}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              backgroundColor: filters.is_public === false ? theme.palette.action.selected : 'inherit'
            }}
          >
            {filters.is_public === false ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Filters Panel */}
      {showFilters && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="books">Books</MenuItem>
                <MenuItem value="events">Events</MenuItem>
                <MenuItem value="challenges">Challenges</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Per Page</InputLabel>
              <Select
                value={perPage}
                onChange={handlePerPageChange}
                label="Per Page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>
      )}

      {/* Status Message (Error or Empty) */}
      {(isError || (!isLoading && forums.length === 0)) && renderStatusMessage()}

      {/* Loading State */}
      {isLoading && (
        <Stack spacing={2}>
          {Array.from(new Array(5)).map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="40%" />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={24} />
                  <Skeleton variant="rectangular" width={80} height={24} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Forum List */}
      {!isLoading && forums.length > 0 && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {forums.length} of {pagination.total} forums (Page {page} of {pagination.total_pages})
            </Typography>
          </Box>
          
          <Stack spacing={2}>
            {forums.map((forum) => (
              <Card key={forum.id}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    {/* Clickable area for navigation */}
                    <Box 
                      sx={{ 
                        flexGrow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderRadius: 1
                        }
                      }}
                      onClick={() => navigate(routes.admin.forums.get(forum.id.toString()))}
                    >
                      <Typography variant="h6">{forum.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {forum.category} • {forum.threads_count} threads • 
                        {forum.is_public ? ' Public' : ' Private'}
                      </Typography>
                    </Box>
                    
                    {/* Action buttons (not clickable for navigation) */}
                    <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditForum(forum.id.toString())}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={forum.is_public ? 'Make Private' : 'Make Public'}>
                        <IconButton 
                          onClick={() => toggleVisibility(forum)}
                          disabled={isTogglingPublic}
                        >
                          {forum.is_public ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => openDeleteDialog(forum)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </>
      )}

      {/* Pagination */}
      {!isLoading && pagination.total > perPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.total_pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Forum</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the forum "{forumToDelete?.name}"?
            This action cannot be undone.
          </Typography>
          {forumToDelete?.threads_count && forumToDelete.threads_count > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This forum contains {forumToDelete.threads_count} threads which will also be deleted.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumList;