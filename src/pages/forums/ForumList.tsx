import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
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
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForums, useDeleteForum, useToggleForumPublic } from '../../hooks/useForum';
import ForumForm from './ForumForm';
import type { Forum } from '../../app/types/forum';

const ForumList: React.FC = () => {
  const [filters, setFilters] = useState<{ search?: string; category?: string; is_public?: boolean; page: number; per_page: number }>({ page: 1, per_page: 10 });
  const [selected, setSelected] = useState<string[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editForum, setEditForum] = useState<Forum | undefined>(undefined);

  const { data, isLoading, error } = useForums(filters, filters.per_page);
  const deleteForum = useDeleteForum();
  const togglePublic = useToggleForumPublic();

  const handleFilterChange = (key: string, value: number | string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : prev.page }));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data?.data.map((f: Forum) => f.id.toString()) || []);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete selected forums?')) {
      Promise.all(selected.map((id) => deleteForum.mutateAsync(id)))
        .then(() => {
          toast.success('Forums deleted');
          setSelected([]);
        })
        .catch(() => toast.error('Error deleting forums'));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this forum?')) {
      deleteForum.mutate(id, {
        onSuccess: () => toast.success('Forum deleted'),
        onError: () => toast.error('Error deleting forum'),
      });
    }
  };

  const handleTogglePublic = (forumId: string) => {
    togglePublic.mutate(forumId, {
      onSuccess: () => toast.success('Visibility toggled'),
      onError: () => toast.error('Error toggling visibility'),
    });
  };

  const handleEdit = (forum: Forum) => {
    setEditForum(forum);
    setEditOpen(true);
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />;
  if (error || !data) return <Typography color="error" sx={{ p: 3 }}>Error loading forums</Typography>;

  console.log('Forums:', data);

  const pagination = data?.meta.pagination || { current_page: 1, total_pages: 1, total: 0 };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          size="small"
          aria-label="Search forums"
        />
        <Select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          displayEmpty
          size="small"
          aria-label="Filter by category"
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Fiction">Fiction</MenuItem>
          <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
          <MenuItem value="Science">Science</MenuItem>
          <MenuItem value="History">History</MenuItem>
        </Select>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 1 }}>Public Only</Typography>
          <Switch
            checked={filters.is_public || false}
            onChange={(e) => handleFilterChange('is_public', e.target.checked)}
            aria-label="Filter public forums"
          />
        </Box>
      </Box>
      {selected.length > 0 && (
        <Button variant="contained" color="error" onClick={handleBulkDelete} sx={{ mb: 2 }} aria-label="Delete selected forums">
          Delete Selected ({selected.length})
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table aria-label="forum list table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < (data?.data.length || 0)}
                  checked={data?.data.length > 0 && selected.length === data?.data.length}
                  onChange={handleSelectAll}
                  aria-label="Select all forums"
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Public</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((forum: Forum) => (
              <TableRow key={forum.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(forum.id.toString())}
                    onChange={() => handleSelect(forum.id.toString())}
                    aria-label={`Select forum ${forum.name}`}
                  />
                </TableCell>
                <TableCell>
                  <Link to={`/admin/forums/${forum.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {forum.name}
                  </Link>
                </TableCell>
                <TableCell>{forum.description || '-'}</TableCell>
                <TableCell>{forum.category}</TableCell>
                <TableCell>
                  <Switch
                    checked={forum.is_public}
                    onChange={() => handleTogglePublic(forum.id.toString())}
                    aria-label={`Toggle public status for ${forum.name}`}
                  />
                </TableCell>
                <TableCell>{forum.participants_count}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/admin/forums/${forum.id}`} aria-label={`View ${forum.name}`}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(forum)} aria-label={`Edit ${forum.name}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(forum.id.toString())} aria-label={`Delete ${forum.name}`}>
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
      <ForumForm open={editOpen} onClose={() => setEditOpen(false)} forum={editForum} />
    </Box>
  );
};

export default ForumList;