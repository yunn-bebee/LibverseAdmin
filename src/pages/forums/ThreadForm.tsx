import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateThread, useUpdateThread } from '../../hooks/useForum';
import type { Thread } from '../../app/types/forum';

interface ThreadFormProps {
  open: boolean;
  onClose: () => void;
  thread?: Thread; // Optional thread prop for editing
}

const ThreadForm: React.FC<ThreadFormProps> = ({ open, onClose, thread }) => {
  const { forumId } = useParams<{ forumId: string }>();
  const [formData, setFormData] = useState<{ title: string; content: string; post_type: string }>({
    title: '',
    content: '',
    post_type: 'discussion',
  });
  const createThread = useCreateThread(forumId!);
  const updateThread = useUpdateThread();

  // Populate form with thread data when editing
  useEffect(() => {
    if (thread) {
      setFormData({
        title: thread.title,
        content: thread.content,
        post_type: thread.post_type,
      });
    } else {
      setFormData({ title: '', content: '', post_type: 'discussion' });
    }
  }, [thread]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }
    if (!formData.post_type) {
      toast.error('Post type is required');
      return;
    }

    if (thread) {
      // Update existing thread
      updateThread.mutate(
        { threadId: thread.id.toString(), data: formData },
        {
          onSuccess: () => {
            toast.success('Thread updated');
            onClose();
          },
          onError: () => toast.error('Error updating thread'),
        }
      );
    } else {
      // Create new thread
      createThread.mutate(formData, {
        onSuccess: () => {
          toast.success('Thread created');
          onClose();
        },
        onError: () => toast.error('Error creating thread'),
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="thread-form-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          width: 400,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography id="thread-form-modal" variant="h6" gutterBottom>
          {thread ? 'Edit Thread' : 'Create Thread'}
        </Typography>
        <TextField
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          fullWidth
          required
          size="small"
          sx={{ mt: 2 }}
          aria-label="Thread title"
        />
        <TextField
          label="Content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          fullWidth
          required
          multiline
          rows={4}
          size="small"
          sx={{ mt: 2 }}
          aria-label="Thread content"
        />
        <FormControl fullWidth sx={{ mt: 2 }} required>
          <InputLabel id="post-type-label">Post Type</InputLabel>
          <Select
            labelId="post-type-label"
            value={formData.post_type}
            onChange={(e) => handleChange('post_type', e.target.value)}
            size="small"
            aria-label="Thread post type"
          >
            <MenuItem value="discussion">Discussion</MenuItem>
            <MenuItem value="question">Question</MenuItem>
            <MenuItem value="announcement">Announcement</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button
            onClick={onClose}
            aria-label="Cancel thread form"
            disabled={createThread.isPending || updateThread.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createThread.isPending || updateThread.isPending}
            aria-label={thread ? 'Save thread changes' : 'Create thread'}
          >
            {thread ? 'Save' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ThreadForm;