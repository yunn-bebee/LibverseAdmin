import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  CircularProgress,
  Pagination,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CalendarToday,
  LocationOn,
  People,
} from '@mui/icons-material';
import { useEvents, useDeleteEvent } from '../../hooks/useEvents';
import EventForm from './EventEdit';
import type { Event } from '../../app/types/event';

const EventList: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    event_type: '',
    location_type: '',
    page: 1,
    per_page: 10,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const { data, isLoading, isError, error } = useEvents(filters);
  const deleteMutation = useDeleteEvent();

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {(error as Error)?.message || 'Failed to fetch events'}
      </Alert>
    );
  }

  const events = data?.data || [];
  const pagination = data?.meta || { total: 0, per_page: 10, current_page: 1, last_page: 1 };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Event Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Event
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Search Events"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <TextField
              select
              label="Event Type"
              value={filters.event_type}
              onChange={(e) => handleFilterChange('event_type', e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="book_club">Book Club</MenuItem>
              <MenuItem value="author_talk">Author Talk</MenuItem>
            </TextField>
            <TextField
              select
              label="Location Type"
              value={filters.location_type}
              onChange={(e) => handleFilterChange('location_type', e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Locations</MenuItem>
              <MenuItem value="physical">Physical</MenuItem>
              <MenuItem value="virtual">Virtual</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert for Delete */}
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => deleteMutation.reset()}>
          {(deleteMutation.error as Error)?.message || 'Failed to delete event'}
        </Alert>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No events found
          </Typography>
        </Box>
      ) : (
        <>
          <Box display="flex" flexDirection="column" gap={2}>
            {events.map((event: Event) => (
              <Card key={event.id} variant="outlined">
                <Box display="flex">
                  {event.cover_image && (
                    <CardMedia
                      component="img"
                      sx={{ width: 200, objectFit: 'cover' }}
                      image={event.cover_image}
                      alt={event.title}
                    />
                  )}
                  <Box flex={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(event.start_time)} - {formatDate(event.end_time)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {event.location_type === 'physical' 
                            ? event.physical_address 
                            : event.location_type === 'virtual'
                            ? 'Virtual Event'
                            : 'Hybrid Event'
                          }
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <People fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {event.rsvp_counts.going} going, {event.rsvp_counts.interested} interested
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip label={event.event_type} size="small" />
                        <Chip 
                          label={event.location_type} 
                          size="small" 
                          color={
                            event.location_type === 'physical' ? 'primary' : 
                            event.location_type === 'virtual' ? 'secondary' : 'default'
                          } 
                        />
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.last_page}
                page={pagination.current_page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Event Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Edit Event' : 'Create Event'}
        </DialogTitle>
        <DialogContent>
          <EventForm
            event={selectedEvent}
            onSuccess={handleCloseDialog}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EventList;