/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Pagination,
} from '@mui/material';
import Table from '../../components/Table';
import AdminTableRow from '../../components/AdminTableRow';
import { bookService } from '../../services/BookServices';
import type { Book } from '../../app/types/book';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const [filters, setFilters] = useState<{ 
    search?: string; 
    author?: string; 
    min_year?: number 
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getBooks(filters, currentPage, perPage);
      if (!response || !response.data) throw new Error('No books data returned from API');
      setBooks(response.data);
      setTotalPages(10); // Replace with actual total from API
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, perPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'min_year' 
        ? (value ? parseInt(value) : undefined) 
        : value || undefined,
    }));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        fetchBooks();
      } catch (err: any) {
        setError(err?.message || 'Failed to delete book');
      }
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await bookService.verifyBook(id);
      fetchBooks();
    } catch (err: any) {
      setError(err?.message || 'Failed to verify book');
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ 
      width:{xs:'100%',sm:'100%' ,md:'100%' , lg:'85%', xl:'100'},
      maxWidth: 1280,
      ml: '200px',
      float:'right',
      py: 1,
      px: { xs: 2, sm: 3 },
    }}>
      {/* Header */}
      <Box sx={{ 
        width: '100%',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        mb: 4, 
        gap: 2 
      }}>
        <Typography variant="h4" fontWeight={700}>
          Books Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/books/create')}
          disabled={loading}
        >
          Add Book
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 2,
        mb: 4
      }}>
        <TextField
          fullWidth
          label="Search by Title, Author, or ISBN"
          name="search"
          value={filters.search || ''}
          onChange={handleFilterChange}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Author"
          name="author"
          value={filters.author || ''}
          onChange={handleFilterChange}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Min Publication Year"
          name="min_year"
          type="number"
          value={filters.min_year ?? ''}
          onChange={handleFilterChange}
          disabled={loading}
          inputProps={{ min: 0 }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Table */}
          <Table headers={['ID', 'Library ID', 'Title', 'Author', 'ISBN', 'Verified', 'Added By']}>
            {books.map((book) => (
              <AdminTableRow
                key={book.id}
                row={{
                  id: book.id,
                  library_book_id: book.library_book_id,
                  title: book.title,
                  author: book.author,
                  isbn: book.isbn || 'N/A',
                  verified: book.verified ? 'Yes' : 'No',
                  added_by: book.added_by?.email || 'Unknown',
                }}
                onEdit={() => navigate(`/admin/books/edit/${book.id}`)}
                onDelete={() => handleDelete(book.id)}
                onBan={() => handleVerify(book.id)}
                showActions
              />
            ))}
          </Table>

          {/* Pagination */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default BookList;