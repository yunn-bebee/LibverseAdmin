import React, { useState, useMemo } from 'react';
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
import { useBooks, useDeleteBook, useVerifyBook } from '../../hooks/useBooks';

const ITEMS_PER_PAGE = 10;

const BookList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ 
    search?: string; 
    author?: string; 
  }>({});

  const navigate = useNavigate();

  // Fetch all books
  const { 
    data: allBooks = [], 
    isLoading, 
    isError, 
    error 
  } = useBooks();

  const deleteMutation = useDeleteBook();
  const verifyMutation = useVerifyBook();

  // Filter and paginate books on the frontend
  const { filteredBooks, totalPages, totalFilteredItems } = useMemo(() => {
    let result = [...allBooks];
    
    // Apply search filter (matches title, author, or ISBN)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchTerm))) 
    }

    // Apply author filter
    if (filters.author) {
      const authorTerm = filters.author.toLowerCase();
      result = result.filter(book => 
        book.author.toLowerCase().includes(authorTerm))
    }

    // Calculate pagination
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Paginate results
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBooks = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      filteredBooks: paginatedBooks,
      totalPages,
      totalFilteredItems: totalItems
    };
  }, [allBooks, filters, currentPage]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || undefined,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleVerify = async (id: string) => {
    await verifyMutation.mutateAsync(id);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ 
      width: { xs: '100%', sm: '100%', md: '100%', lg: '85%', xl: '100%' },
      maxWidth: 1280,
      ml: '200px',
      float: 'right',
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label="Author"
          name="author"
          value={filters.author || ''}
          onChange={handleFilterChange}
          disabled={isLoading}
        />
      </Box>

      {/* Error Alerts */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error)?.message || 'Failed to fetch books'}
        </Alert>
      )}
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => deleteMutation.reset()}>
          {(deleteMutation.error as Error)?.message || 'Failed to delete book'}
        </Alert>
      )}
      {verifyMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => verifyMutation.reset()}>
          {(verifyMutation.error as Error)?.message || 'Failed to verify book'}
        </Alert>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* No Results Message */}
          {totalFilteredItems === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              border: '1px dashed #ccc',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              mb: 4
            }}>
              <Typography variant="h6" color="textSecondary">
                {Object.values(filters).some(Boolean) 
                  ? 'No books match your search criteria' 
                  : 'No books available'}
              </Typography>
            </Box>
          )}

          {/* Table (only show if we have results) */}
          {totalFilteredItems > 0 && (
            <>
              <Table headers={['ID', 'Library ID', 'Title', 'Author', 'ISBN', 'Verified', 'Added By']}>
                {filteredBooks.map((book) => (
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
              {totalPages > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default BookList;