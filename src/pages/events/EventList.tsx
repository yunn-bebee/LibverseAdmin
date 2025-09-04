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
  IconButton,
  Modal,

  Stack,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CalendarToday,
  LocationOn,
  People,
  Close,
  ArrowBack
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
    per_page: 9, // Show 9 events per page
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  const { data, isLoading, isError, error } = useEvents(filters);
  const deleteMutation = useDeleteEvent();
  const theme = useTheme();

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

  const handleViewEvent = (event: Event) => {
    setViewEvent(event);
    setViewModalOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setViewEvent(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'workshop': return 'primary';
      case 'book_club': return 'secondary';
      case 'author_talk': return 'success';
      default: return 'default';
    }
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

  const events: Event[] = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.meta?.pagination || {
    total: 0,
    per_page: 9,
    current_page: 1,
    total_pages: 1,
  };



  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Event Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ borderRadius: 2 }}
        >
          Create Event
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Filter Events
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search Events"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          />
          <TextField
            select
            label="Event Type"
            value={filters.event_type}
            onChange={(e) => handleFilterChange('event_type', e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
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
            size="small"
          >
            <MenuItem value="">All Locations</MenuItem>
            <MenuItem value="physical">Physical</MenuItem>
            <MenuItem value="virtual">Virtual</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Error Alert for Delete */}
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => deleteMutation.reset()}>
          {(deleteMutation.error as Error)?.message || 'Failed to delete event'}
        </Alert>
      )}

      {/* Events List */}
      {pagination.total === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No events found
          </Typography>
        </Box>
      ) : (
        <>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={3} 
            sx={{ 
              justifyContent: { xs: 'center', sm: 'flex-start' } 
            }}
          >
            {events.map((event: Event) => (
              <Card 
                key={event.id}
                sx={{ 
                  width: { xs: '100%', sm: 320, md: 345 },
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleViewEvent(event)}
              >
                {event.cover_image && (
                  <CardMedia
                    component="img"
                    sx={{ height: 180, objectFit: 'cover' }}
                    image={event.cover_image}
                    alt={event.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {event.title}
                  </Typography>
                  <Stack spacing={1} mt={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.start_time)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {event.location_type === 'physical' 
                          ? event.physical_address 
                          : event.location_type === 'virtual'
                          ? 'Virtual Event'
                          : 'Hybrid Event'
                        }
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <People fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {event.rsvp_counts.going} going, {event.rsvp_counts.interested} interested
                      </Typography>
                    </Box>
                  </Stack>
                  <Box display="flex" gap={1} mt={2}>
                    <Chip 
                      label={event.event_type} 
                      size="small" 
                      color={getEventTypeColor(event.event_type)}
                    />
                    <Chip 
                      label={event.location_type} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(event);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.id);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {pagination?.total_pages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination?.total_pages}
                page={pagination?.current_page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
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
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
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

      {/* Event Detail Modal */}
      <Modal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        aria-labelledby="event-detail-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: '80%', lg: '70%' },
            maxWidth: 800,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'auto',
          }}
        >
          {viewEvent && (
            <>
              <Box sx={{ position: 'relative' }}>
                {viewEvent.cover_image && (
                  <Box
                    sx={{
                      height: 200,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={viewEvent.cover_image}
                      alt={viewEvent.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.2)}, ${alpha(theme.palette.common.black, 0.5)})`,
                      }}
                    />
                  </Box>
                )}
                <IconButton
                  onClick={handleCloseViewModal}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    bgcolor: alpha(theme.palette.common.black, 0.5),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.black, 0.7),
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                  {viewEvent.title}
                </Typography>

                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={viewEvent.event_type} 
                    color={getEventTypeColor(viewEvent.event_type)}
                  />
                  <Chip 
                    label={viewEvent.location_type} 
                    variant="outlined"
                  />
                </Box>

                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                  <Box flex={2}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Description
                    </Typography>
                    <Typography paragraph>
                      {viewEvent.description}
                    </Typography>
                  </Box>

                  <Box flex={1}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Event Details
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <CalendarToday color="action" fontSize="small" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Starts
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(viewEvent.start_time)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <CalendarToday color="action" fontSize="small" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Ends
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(viewEvent.end_time)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <LocationOn color="action" fontSize="small" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body2">
                              {viewEvent.location_type === 'physical' 
                                ? viewEvent.physical_address 
                                : viewEvent.location_type === 'virtual'
                                ? 'Virtual Event'
                                : 'Hybrid Event'
                              }
                            </Typography>
                            {viewEvent.zoom_link && (
                              <Typography variant="body2" color="primary">
                                <a href={viewEvent.zoom_link} target="_blank" rel="noopener noreferrer">
                                  Join Zoom Meeting
                                </a>
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <People color="action" fontSize="small" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Attendees
                            </Typography>
                            <Typography variant="body2">
                              {viewEvent.max_attendees ? 
                                `${viewEvent.rsvp_counts.going} / ${viewEvent.max_attendees} attending` : 
                                `${viewEvent.rsvp_counts.going} attending`
                              }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {viewEvent.rsvp_counts.interested} interested, {viewEvent.rsvp_counts.not_going} not going
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Box>

                <Box display="flex" gap={1} mt={3}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCloseViewModal}
                  >
                    Back to Events
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      handleCloseViewModal();
                      handleEdit(viewEvent);
                    }}
                  >
                    Edit Event
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default EventList;