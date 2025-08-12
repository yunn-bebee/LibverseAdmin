import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useBook, useCreateBook, useUpdateBook, useSearchGoogleBooks, useCreateFromGoogleBooks } from '../../hooks/useBooks';
import type { GoogleBookResultItem } from '../../app/types/book';

type BookFormData = {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  genres?: string[];
};

const BookCreateOrEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGoogleResults, setShowGoogleResults] = useState(false);
  const [selectedGoogleBook, setSelectedGoogleBook] = useState<GoogleBookResultItem | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form hooks
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      description: '',
      genres: [],
    },
  });

  // Query hooks
  const { data: existingBook } = useBook(id || '');
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const searchGoogleMutation = useSearchGoogleBooks();
  const createFromGoogleMutation = useCreateFromGoogleBooks();

  // Search Google Books
  const handleSearchGoogleBooks = () => {
    if (searchQuery.trim()) {
      searchGoogleMutation.mutate({ query: searchQuery });
      setShowGoogleResults(true);
    }
  };

  // Select a Google Book result
  const handleSelectGoogleBook = (book: GoogleBookResultItem) => {
    setSelectedGoogleBook(book);
    setValue('title', book.title);
    setValue('author', book.author);
    setValue('isbn', book.isbn || '');
    setValue('description', book.description || '');
    setActiveTab(0); // Switch back to manual form tab
  };

  // Create book from Google Books data
  const handleCreateFromGoogle = () => {
    if (selectedGoogleBook) {
      createFromGoogleMutation.mutate(
        {
          googleBooksId: selectedGoogleBook.google_books_id,
          additionalData: {
            description: selectedGoogleBook.description || '',
          },
        },
        {
          onSuccess: () => {
            navigate('/admin/books');
          },
        }
      );
    }
  };

  // Submit form
  const onSubmit: SubmitHandler<BookFormData> = (data) => {
    const formattedData = {
      ...data,
      genres: data.genres || [],
    };

    if (isEditMode && id) {
      updateBookMutation.mutate(
        { id, data: formattedData },
        {
          onSuccess: () => {
            navigate('/admin/books');
          },
        }
      );
    } else {
      createBookMutation.mutate(formattedData, {
        onSuccess: () => {
          navigate('/admin/books');
        },
      });
    }
  };

  // Reset form when existing book data loads
  useEffect(() => {
    if (existingBook) {
      reset({
        title: existingBook.title,
        author: existingBook.author,
        isbn: existingBook.isbn || '',
        description: existingBook.description || '',
        genres: existingBook.genres || [],
      });
    }
  }, [existingBook, reset]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Book' : 'Add New Book'}
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Manual Entry" />
        <Tab label="Import from Google Books" disabled={isEditMode} />
      </Tabs>

      {activeTab === 0 ? (
        // Manual Entry Form
        <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                rules={{ required: 'Author is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Author"
                    fullWidth
                    error={!!errors.author}
                    helperText={errors.author?.message}
                  />
                )}
              />
            </Stack>

            <Controller
              name="isbn"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ISBN"
                  fullWidth
                  error={!!errors.isbn}
                  helperText={errors.isbn?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Controller
              name="genres"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Genres (comma separated)"
                  fullWidth
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => {
                    const genres = e.target.value
                      .split(',')
                      .map((genre) => genre.trim())
                      .filter((genre) => genre.length > 0);
                    field.onChange(genres);
                  }}
                  error={!!errors.genres}
                  helperText={errors.genres?.message}
                />
              )}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/books')}
                disabled={
                  createBookMutation.isPending ||
                  updateBookMutation.isPending ||
                  createFromGoogleMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  createBookMutation.isPending ||
                  updateBookMutation.isPending ||
                  createFromGoogleMutation.isPending
                }
              >
                {isEditMode ? 'Update Book' : 'Create Book'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        // Google Books Import Tab
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Google Books
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
              <TextField
                fullWidth
                label="Search by title, author, or ISBN"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearchGoogleBooks();
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearchGoogleBooks}
                disabled={searchGoogleMutation.isPending || !searchQuery.trim()}
                startIcon={<SearchIcon />}
                sx={{ minWidth: 'fit-content' }}
              >
                Search
              </Button>
            </Stack>

            {searchGoogleMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {searchGoogleMutation.error.message || 'Failed to search Google Books'}
              </Alert>
            )}
          </Paper>

          {showGoogleResults && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>

              {searchGoogleMutation.isPending ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : searchGoogleMutation.data?.items?.length ? (
                <Stack direction="row" flexWrap="wrap" gap={3}>
                  {searchGoogleMutation.data.items.map((book) => (
                    <Card
                      key={book.google_books_id}
                      sx={{
                        width: { xs: '100%', sm: 300 },
                        display: 'flex',
                        flexDirection: 'column',
                        border: selectedGoogleBook?.google_books_id === book.google_books_id
                          ? '2px solid #1976d2'
                          : '1px solid rgba(0, 0, 0, 0.12)',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => handleSelectGoogleBook(book)}
                    >
                      <Box sx={{ display: 'flex', height: '100%' }}>
                        {book.cover_image && (
                          <CardMedia
                            component="img"
                            sx={{ width: 120, objectFit: 'cover' }}
                            image={book.cover_image}
                            alt={`Cover of ${book.title}`}
                          />
                        )}
                        <CardContent sx={{ flex: 1 }}>
                          <Typography variant="h6" component="div">
                            {book.title}
                          </Typography>
                          <Typography color="text.secondary" gutterBottom>
                            {book.author}
                          </Typography>
                          {book.isbn && (
                            <Typography variant="body2" color="text.secondary">
                              ISBN: {book.isbn}
                            </Typography>
                          )}
                          {book.exists_in_db && (
                            <Chip
                              label="Already in database"
                              color="warning"
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </CardContent>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">No books found matching your search</Alert>
              )}
            </Box>
          )}

          {selectedGoogleBook && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Selected Book</Typography>
                <IconButton onClick={() => setSelectedGoogleBook(null)}>
                  <ClearIcon />
                </IconButton>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 1 }}>
                {selectedGoogleBook.cover_image && (
                  <Box sx={{ width: { xs: '100%', md: 200 }, flexShrink: 0 }}>
                    <img
                      src={selectedGoogleBook.cover_image}
                      alt={`Cover of ${selectedGoogleBook.title}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{selectedGoogleBook.title}</Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {selectedGoogleBook.author}
                  </Typography>
                  {selectedGoogleBook.isbn && (
                    <Typography variant="body2" color="text.secondary">
                      ISBN: {selectedGoogleBook.isbn}
                    </Typography>
                  )}
                  {selectedGoogleBook.description && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Description:</Typography>
                      <Typography variant="body2">
                        {selectedGoogleBook.description.length > 300
                          ? `${selectedGoogleBook.description.substring(0, 300)}...`
                          : selectedGoogleBook.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={createFromGoogleMutation.isPending}
                  startIcon={<AddIcon />}
                >
                  Create Book from This
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {/* Loading indicator for mutations */}
      {(createBookMutation.isPending ||
        updateBookMutation.isPending ||
        createFromGoogleMutation.isPending) && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress color="primary" size={60} />
        </Box>
      )}

      {/* Error alerts */}
      {createBookMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => createBookMutation.reset()}>
          {createBookMutation.error.message || 'Failed to create book'}
        </Alert>
      )}
      {updateBookMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => updateBookMutation.reset()}>
          {updateBookMutation.error.message || 'Failed to update book'}
        </Alert>
      )}
      {createFromGoogleMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => createFromGoogleMutation.reset()}>
          {createFromGoogleMutation.error.message || 'Failed to create book from Google Books'}
        </Alert>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Book Creation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to create a new book record based on the selected Google Books
            data?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowConfirmDialog(false);
              handleCreateFromGoogle();
            }}
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookCreateOrEdit;