import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useChallengeBooks, useAddBookToChallenge, useRemoveBookFromChallenge } from '../../hooks/useChallenges';
import { useBooks } from '../../hooks/useBooks';
import type { Book } from '../../app/types/book';

const ChallengeBookList: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [selectedBookId, setSelectedBookId] = useState<string>('');

  const { data: booksResponse, isLoading, error: booksError } = useChallengeBooks(challengeId!, { page, per_page: perPage });
  const { data: allBooksResponse, error: allBooksError } = useBooks();
  const addBookMutation = useAddBookToChallenge();
  const removeBookMutation = useRemoveBookFromChallenge();

  const handleAddBook = () => {
    if (!selectedBookId) {
      alert('Please select a book to add');
      return;
    }
    addBookMutation.mutate(
      { challengeId: challengeId!, bookId: selectedBookId },
      {
        onSuccess: () => {
          alert('Book added successfully');
          setSelectedBookId('');
        },
        onError: (error) => {
          alert(error.message || 'Failed to add book');
        },
      }
    );
  };

  const handleRemoveBook = (bookId: string) => {
    if (window.confirm('Are you sure you want to remove this book from the challenge?')) {
      removeBookMutation.mutate(
        { challengeId: challengeId!, bookId },
        {
          onSuccess: () => alert('Book removed successfully'),
          onError: (error) => alert(error.message || 'Failed to remove book'),
        }
      );
    }
  };



  const handlePerPageChange = (event: { target: { value: number | string; }; }) => {
    const value = event.target.value;
    setPerPage(Number(value));
    setPage(1); // Reset to first page when changing page size
  };

  if (booksError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading books: {booksError.message}
      </Alert>
    );
  }

  if (allBooksError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading available books: {allBooksError.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Challenge Book List
      </Typography>

      {/* Add Book Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel id="book-select-label">Select a book to add</InputLabel>
          <Select
            labelId="book-select-label"
            value={selectedBookId}
            label="Select a book to add"
            onChange={(e) => setSelectedBookId(e.target.value as string)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {(allBooksResponse ?? []).map((book: Book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title} by {book.author}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          onClick={handleAddBook}
          disabled={!selectedBookId || addBookMutation.isPending}
          startIcon={addBookMutation.isPending ? <CircularProgress size={16} /> : null}
        >
          {addBookMutation.isPending ? 'Adding...' : 'Add Book'}
        </Button>
      </Box>

      {/* Books Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              booksResponse?.data.map((book: Book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveBook(book.id.toString())}
                      disabled={removeBookMutation.isPending}
                      title="Remove book"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {booksResponse?.meta?.pagination && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Per Page</InputLabel>
            <Select
              value={perPage}
              label="Per Page"
              onChange={handlePerPageChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          <Pagination
            count={Math.ceil(booksResponse.meta.pagination.total / perPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ChallengeBookList;