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
import { useBooks, useDeleteBook } from '../../hooks/useBooks';

const ITEMS_PER_PAGE = 10;

const BookList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  const navigate = useNavigate();

  // Fetch all books once (no filters passed to useBooks)
  const { 
    data: allBooks = [], 
    isLoading, 
    isError, 
    error 
  } = useBooks();

  const deleteMutation = useDeleteBook();

  // Filter and paginate books on the client side
  const { filteredBooks, totalPages, totalFilteredItems } = useMemo(() => {
    let result = [...allBooks];
    
    // Apply search filter (matches title, author, or ISBN)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.isbn && book.isbn.toLowerCase().includes(term)))
    }

    // Apply author filter
    if (authorFilter) {
      const term = authorFilter.toLowerCase();
      result = result.filter(book => 
        book.author.toLowerCase().includes(term))
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
  }, [allBooks, searchTerm, authorFilter, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box>
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
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
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
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label="Author"
          value={authorFilter}
          onChange={handleAuthorChange}
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
                {searchTerm || authorFilter
                  ? 'No books match your search criteria' 
                  : 'No books available'}
              </Typography>
            </Box>
          )}

          {/* Table (only show if we have results) */}
          {totalFilteredItems > 0 && (
            <>
              <Table headers={['ID', 'Library ID', 'Title', 'Author', 'ISBN', 'Added By', 'Actions']}>
                {filteredBooks.map((book) => (
                  <AdminTableRow
                    key={book.id}
                    row={{
                      id: book.id,
                      library_book_id: book.library_book_id || 'N/A',
                      title: book.title,
                      author: book.author,
                      isbn: book.isbn || 'N/A',
                      added_by: book.added_by?.email || 'Unknown',
                    }}
                    onEdit={() => navigate(`/admin/books/edit/${book.id}`)}
                    onDelete={() => handleDelete(book.id.toString())}
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