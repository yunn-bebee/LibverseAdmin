import React, { useState } from 'react';
import { useBadges, useCreateBadge, useUpdateBadge, useDeleteBadge } from '../../hooks/useChallenges';
import { type Badge } from '../../app/types/readingChallenge';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const BadgesTable: React.FC = () => {
  
  const [openForm, setOpenForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState<
    (Partial<Badge> & { file?: File }) | null
  >(null);

  const { data: badge, isLoading, error } = useBadges(20);
  const createBadge = useCreateBadge();
  const updateBadge = useUpdateBadge();
  const deleteBadge = useDeleteBadge();
  const data = (badge?.data ?? []) as Badge[];

  const handleOpenForm = (badge?: Badge) => {
    setEditingBadge(
      badge || { name: '', description: '', icon_url: '', type: '' }
    );
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingBadge(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditingBadge({ ...editingBadge, file, icon_url: previewUrl });
    }
  };

  const handleSubmit = async () => {
    if (!editingBadge) return;

    const formData = new FormData();
    if (editingBadge.name) formData.append('name', editingBadge.name);
    if (editingBadge.description) formData.append('description', editingBadge.description);
    if (editingBadge.type) formData.append('type', editingBadge.type);
    if (editingBadge.file) formData.append('icon_url', editingBadge.file);

    try {
      if (editingBadge.id) {
        await updateBadge.mutateAsync({ id: editingBadge.id, data: formData });
        toast.success('Badge updated successfully');
      } else {
        await createBadge.mutateAsync(formData);
        toast.success('Badge created successfully');
      }
      handleCloseForm();
    } catch {
      toast.error(editingBadge.id ? 'Failed to update badge' : 'Failed to create badge');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this badge?')) {
      deleteBadge.mutate(id, {
        onSuccess: () => toast.success('Badge deleted successfully'),
        onError: () => toast.error('Failed to delete badge'),
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Badges Management
      </Typography>
      <Button variant="contained" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
        Create Badge
      </Button>

      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Error loading badges</Typography>}

      {/* Cards in a responsive flex layout */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {data.map((badge: Badge) => (
          <Card
            key={badge.id}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              width: { xs: '100%', sm: '48%', md: '30%', lg: '22%' },
              flexGrow: 1,
            }}
          >
            <CardMedia
              component="img"
              image={badge.icon_url}
              alt={badge.name}
              sx={{ height: 120, objectFit: 'contain', p: 2 }}
            />
            <CardContent>
              <Typography variant="h6" noWrap>
                {badge.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {badge.description}
              </Typography>
              <Typography variant="caption" color="primary">
                {badge.type}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <IconButton onClick={() => handleOpenForm(badge)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(badge.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBadge?.id ? 'Edit Badge' : 'Create Badge'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editingBadge?.name || ''}
            onChange={(e) => setEditingBadge({ ...editingBadge, name: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            value={editingBadge?.description || ''}
            onChange={(e) =>
              setEditingBadge({ ...editingBadge, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload Icon
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
          {editingBadge?.icon_url && (
            <Box sx={{ mt: 2 }}>
              <img
                src={editingBadge.icon_url}
                alt="Preview"
                style={{ width: 80, height: 80, objectFit: 'contain' }}
              />
            </Box>
          )}
          <TextField
            label="Type"
            value={editingBadge?.type || ''}
            onChange={(e) => setEditingBadge({ ...editingBadge, type: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createBadge.isPending || updateBadge.isPending}
          >
            {createBadge.isPending || updateBadge.isPending ? (
              <CircularProgress size={24} />
            ) : editingBadge?.id ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BadgesTable;
