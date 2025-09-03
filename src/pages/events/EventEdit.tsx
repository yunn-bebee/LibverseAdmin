import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
  CircularProgress,
  Typography,
  Avatar,
} from '@mui/material';
import { useCreateEvent, useUpdateEvent } from '../../hooks/useEvents';
import type { Event } from '../../app/types/event';

interface EventFormProps {
  event?: Event | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventEdit: React.FC<EventFormProps> = ({ event, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    start_time: '',
    end_time: '',
    location_type: 'physical' as 'physical' | 'virtual' | 'hybrid',
    physical_address: '',
    zoom_link: '',
    max_attendees: '',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_type: event.event_type || '',
        start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
        end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
        location_type: event.location_type || 'physical',
        physical_address: event.physical_address || '',
        zoom_link: event.zoom_link || '',
        max_attendees: event.max_attendees?.toString() || '',
      });
      
      if (event.cover_image) {
        setCoverImagePreview(event.cover_image);
      }
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImagePreview(null);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.event_type) newErrors.event_type = 'Event type is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.end_time) newErrors.end_time = 'End time is required';
    if (!formData.location_type) newErrors.location_type = 'Location type is required';
    
    if (formData.location_type === 'physical' && !formData.physical_address) {
      newErrors.physical_address = 'Physical address is required for physical events';
    }
    
    if (formData.location_type === 'virtual' && !formData.zoom_link) {
      newErrors.zoom_link = 'Zoom link is required for virtual events';
    }
    
    if (formData.location_type === 'hybrid' && !formData.physical_address && !formData.zoom_link) {
      newErrors.physical_address = 'At least one location (physical or virtual) is required for hybrid events';
      newErrors.zoom_link = 'At least one location (physical or virtual) is required for hybrid events';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    
    // Append all form fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('event_type', formData.event_type);
    formDataToSend.append('start_time', formData.start_time);
    formDataToSend.append('end_time', formData.end_time);
    formDataToSend.append('location_type', formData.location_type);
    
    if (formData.physical_address) {
      formDataToSend.append('physical_address', formData.physical_address);
    }
    
    if (formData.zoom_link) {
      formDataToSend.append('zoom_link', formData.zoom_link);
    }
    
    if (formData.max_attendees) {
      formDataToSend.append('max_attendees', formData.max_attendees);
    }
    
    // Append cover image if selected
    if (coverImage) {
      formDataToSend.append('cover_image', coverImage);
    }
    
    try {
      if (event) {
        await updateMutation.mutateAsync(
          { id: event.id, data: formDataToSend },
          { onSuccess }
        );
      } else {
        await createMutation.mutateAsync(formDataToSend, { onSuccess });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {mutationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(mutationError as Error)?.message || 'An error occurred'}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description}
        margin="normal"
        multiline
        rows={4}
        required
      />
      
      {/* Cover Image Upload */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cover Image
        </Typography>
        
        {coverImagePreview && (
          <Avatar
            src={coverImagePreview}
            variant="rounded"
            sx={{ width: 200, height: 120, mb: 2 }}
          />
        )}
        
        <Button
          variant="outlined"
          component="label"
          sx={{ mr: 2 }}
        >
          Upload Cover Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        
        {coverImage && (
          <Typography variant="body2">
            Selected: {coverImage.name}
          </Typography>
        )}
      </Box>
      
      <FormControl fullWidth margin="normal" error={!!errors.event_type} required>
        <InputLabel>Event Type</InputLabel>
        <Select
          name="event_type"
          value={formData.event_type}
          onChange={(e) => handleSelectChange('event_type', e.target.value)}
          label="Event Type"
        >
          <MenuItem value="workshop">Workshop</MenuItem>
          <MenuItem value="book_club">Book Club</MenuItem>
          <MenuItem value="author_talk">Author Talk</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
        {errors.event_type && <FormHelperText>{errors.event_type}</FormHelperText>}
      </FormControl>
      
      <Box display="flex" gap={2} mt={2}>
        <TextField
          fullWidth
          label="Start Time"
          name="start_time"
          type="datetime-local"
          value={formData.start_time}
          onChange={handleChange}
          error={!!errors.start_time}
          helperText={errors.start_time}
          InputLabelProps={{ shrink: true }}
          required
        />
        
        <TextField
          fullWidth
          label="End Time"
          name="end_time"
          type="datetime-local"
          value={formData.end_time}
          onChange={handleChange}
          error={!!errors.end_time}
          helperText={errors.end_time}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Box>
      
      <FormControl fullWidth margin="normal" error={!!errors.location_type} required>
        <InputLabel>Location Type</InputLabel>
        <Select
          name="location_type"
          value={formData.location_type}
          onChange={(e) => handleSelectChange('location_type', e.target.value)}
          label="Location Type"
        >
          <MenuItem value="physical">Physical</MenuItem>
          <MenuItem value="virtual">Virtual</MenuItem>
          <MenuItem value="hybrid">Hybrid</MenuItem>
        </Select>
        {errors.location_type && <FormHelperText>{errors.location_type}</FormHelperText>}
      </FormControl>
      
      {(formData.location_type === 'physical' || formData.location_type === 'hybrid') && (
        <TextField
          fullWidth
          label="Physical Address"
          name="physical_address"
          value={formData.physical_address}
          onChange={handleChange}
          error={!!errors.physical_address}
          helperText={errors.physical_address}
          margin="normal"
        />
      )}
      
      {(formData.location_type === 'virtual' || formData.location_type === 'hybrid') && (
        <TextField
          fullWidth
          label="Zoom Link"
          name="zoom_link"
          value={formData.zoom_link}
          onChange={handleChange}
          error={!!errors.zoom_link}
          helperText={errors.zoom_link}
          margin="normal"
        />
      )}
      
      <TextField
        fullWidth
        label="Max Attendees"
        name="max_attendees"
        type="number"
        value={formData.max_attendees}
        onChange={handleChange}
        margin="normal"
        inputProps={{ min: 1 }}
      />
      
      <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
        <Button onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={24} /> : (event ? 'Update' : 'Create')}
        </Button>
      </Box>
    </Box>
  );
};

export default EventEdit;