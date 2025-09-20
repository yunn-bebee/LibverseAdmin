// src/components/admin/forums/ForumForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, MenuItem, Modal, Select, Switch, TextField, Typography } from '@mui/material';
// import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useCreateForum, useUpdateForum } from '../../hooks/useForum';
// import { challengeService } from '../../services/ChallengeServices'; // Assume imported
import type { Forum } from '../../app/types/forum';
// import type { Book } from '../../app/types/forum';
import { useChallengeBooks } from '../../hooks/useChallenges';

interface ForumFormProps {
  open: boolean;
  onClose: () => void;
  forum?: Forum;
}

const ForumForm: React.FC<ForumFormProps> = ({ open, onClose, forum }) => {
  const [formData, setFormData] = useState<Partial<Forum>>({});
  const createForum = useCreateForum();
  const updateForum = useUpdateForum();
 const { data  } = useChallengeBooks('1');
  const books = data?.data;
  const booksLoading = !data;

  useEffect(() => {
    if (forum) {
      setFormData(forum);
    } else {
      setFormData({});
    }
  }, [forum]);

  const handleChange = (key: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
    if (forum?.id) {
      updateForum.mutate({ id: forum.id.toString(), data: formData }, {
        onSuccess: () => {
          toast.success('Forum updated');
          onClose();
        },
        onError: () => toast.error('Error updating forum'),
      });
    } else {
      createForum.mutate(formData, {
        onSuccess: () => {
          toast.success('Forum created');
          onClose();
        },
        onError: () => toast.error('Error creating forum'),
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, width: 400 }}>
        <Typography variant="h6">{forum ? 'Edit Forum' : 'Create Forum'}</Typography>
        <TextField
          label="Name"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <TextField
          label="Description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          fullWidth
          multiline
          sx={{ mt: 2 }}
        />
        <Select
          value={formData.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          fullWidth
          displayEmpty
          sx={{ mt: 2 }}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Fiction">Fiction</MenuItem>
          <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
          {/* Add more */}
        </Select>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography>Public</Typography>
          <Switch checked={!!formData.is_public} onChange={(e) => handleChange('is_public', e.target.checked)} />
        </Box>
        <Select
          value={formData?.book?.id || ''}
          onChange={(e) => handleChange('book_id', e.target.value)}
          fullWidth
          displayEmpty
          sx={{ mt: 2 }}
          disabled={booksLoading}
        >
          <MenuItem value="">No Book</MenuItem>
          {books?.map((book) => (
            <MenuItem key={book.id} value={book.id}>{book.title}</MenuItem>
          ))}
        </Select>
        {booksLoading && <CircularProgress size={24} />}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={createForum.isPending || updateForum.isPending}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ForumForm;