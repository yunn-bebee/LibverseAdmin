// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   CircularProgress,
//   Paper,
//   Chip,
//   Autocomplete,
//   Divider,
// } from '@mui/material';
// import { useBook, useCreateBook, useUpdateBook, useSearchGoogleBooks } from '../../hooks/useBooks';
// import type { Book, GoogleBookResult } from '../../app/types/book';

// const BookCreateOrEdit: React.FC = () => {
//   const { id } = useParams<{ id?: string }>();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);

//   // Data hooks
//   const { 
//     data: book, 
//     isLoading: isLoadingBook, 
//     isError: isBookError, 
//     error: bookError 
//   } = useBook(id || '');
  
//   const createMutation = useCreateBook();
//   const updateMutation = useUpdateBook();
//   const searchMutation = useSearchGoogleBooks();

//   // Form state
//   const [formData, setFormData] = useState<Partial<Book>>({
//     title: '',
//     author: '',
//     isbn: '',
//     description: '',
//     genres: [],
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [coverImage, setCoverImage] = useState<File | null>(null);

//   // Initialize form for edit mode
//   useEffect(() => {
//     if (isEditMode && book) {
//       setFormData({
//         title: book.title,
//         author: book.author,
//         isbn: book.isbn || '',
//         description: book.description || '',
//         genres: book.genres || [],
//         publication_year: book.publication_year,
//         publisher: book.publisher || '',
//         subtitle: book.subtitle || '',
//         co_authors: book.co_authors || '',
//       });
//     }
//   }, [book, isEditMode]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleGenreChange = (event: React.SyntheticEvent, newValue: string[]) => {
//     setFormData(prev => ({ ...prev, genres: newValue }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setCoverImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const formDataToSend = new FormData();
    
//     // Append all form data
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         if (Array.isArray(value)) {
//           formDataToSend.append(key, JSON.stringify(value));
//         } else {
//           formDataToSend.append(key, value.toString());
//         }
//       }
//     });
    
//     if (coverImage) {
//       formDataToSend.append('cover_image', coverImage);
//     }

//     try {
//       if (isEditMode && id) {
//         await updateMutation.mutateAsync({ id, data: formDataToSend });
//       } else {
//         // Convert FormData to Book object for create mutation
//         const bookData: Partial<Book> = {
//           title: formDataToSend.get('title') as string,
//           author: formDataToSend.get('author') as string,
//           isbn: formDataToSend.get('isbn') as string,
//           description: formDataToSend.get('description') as string,
        
//           publication_year: formDataToSend.get('publication_year') ? 
//             parseInt(formDataToSend.get('publication_year') as string) : undefined,
//           publisher: formDataToSend.get('publisher') as string,
//           subtitle: formDataToSend.get('subtitle') as string,
//           co_authors: formDataToSend.get('co_authors') as string,
//         };
//         await createMutation.mutateAsync(bookData);
//       }
//       navigate('/admin/books');
//     } catch (error) {
//       console.error('Error saving book:', error);
//     }
//   };

//   const handleGoogleBookSelect = (googleBook: GoogleBookResult => {
//     setFormData(prev => ({
//       ...prev,
//       title: googleBook.title,
//       author: googleBook.author,
//       isbn: googleBook.isbn || prev.isbn,
//       description: googleBook.description || prev.description,
//       publication_year: googleBook.publication_year || prev.publication_year,
//     }));
//     setSearchQuery('');
//   };

//   if (isEditMode && isLoadingBook) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isEditMode && isBookError) {
//     return (
//       <Alert severity="error" sx={{ mb: 2 }}>
//         {bookError?.message || 'Failed to load book'}
//       </Alert>
//     );
//   }

//   return (
//     <Box component={Paper} sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         {isEditMode ? 'Edit Book' : 'Add New Book'}
//       </Typography>

//       {/* Google Books Search Section */}
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h6" gutterBottom>
//           Search Google Books
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//           <TextField
//             fullWidth
//             label="Search Google Books"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <Button 
//             variant="contained" 
//             onClick={() => searchMutation.mutate({ query: searchQuery })}
//             disabled={!searchQuery || searchMutation.isLoading}
//           >
//             {searchMutation.isLoading ? <CircularProgress size={24} /> : 'Search'}
//           </Button>
//         </Box>

//         {searchMutation.data?.items && (
//           <Box sx={{ mb: 4 }}>
//             {searchMutation.data.items.map((book) => (
//               <Box 
//                 key={book.google_books_id} 
//                 sx={{ 
//                   p: 2, 
//                   mb: 1, 
//                   border: '1px solid #eee', 
//                   borderRadius: 1,
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 2,
//                   cursor: 'pointer',
//                   '&:hover': { backgroundColor: '#f5f5f5' }
//                 }}
//                 onClick={() => handleGoogleBookSelect(book)}
//               >
//                 {book.cover_image && (
//                   <img 
//                     src={book.cover_image} 
//                     alt={book.title} 
//                     style={{ width: 50, height: 75, objectFit: 'cover' }} 
//                   />
//                 )}
//                 <Box>
//                   <Typography fontWeight="bold">{book.title}</Typography>
//                   <Typography variant="body2">{book.author}</Typography>
//                   {book.publication_year && (
//                     <Typography variant="body2">{book.publication_year}</Typography>
//                   )}
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>

//       <Divider sx={{ my: 3 }} />

//       {/* Book Form */}
//       <form onSubmit={handleSubmit}>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           <TextField
//             fullWidth
//             label="Title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />

//           <TextField
//             fullWidth
//             label="Author"
//             name="author"
//             value={formData.author}
//             onChange={handleChange}
//             required
//           />

//           <TextField
//             fullWidth
//             label="Subtitle"
//             name="subtitle"
//             value={formData.subtitle || ''}
//             onChange={handleChange}
//           />

//           <TextField
//             fullWidth
//             label="Co-authors"
//             name="co_authors"
//             value={formData.co_authors || ''}
//             onChange={handleChange}
//           />

//           <TextField
//             fullWidth
//             label="ISBN"
//             name="isbn"
//             value={formData.isbn || ''}
//             onChange={handleChange}
//           />

//           <TextField
//             fullWidth
//             label="Publisher"
//             name="publisher"
//             value={formData.publisher || ''}
//             onChange={handleChange}
//           />

//           <TextField
//             fullWidth
//             label="Publication Year"
//             name="publication_year"
//             type="number"
//             value={formData.publication_year || ''}
//             onChange={handleChange}
//             inputProps={{ min: 1900, max: new Date().getFullYear() }}
//           />

//           <Autocomplete
//             multiple
//             freeSolo
//             options={[]}
//             value={formData.genres || []}
//             onChange={handleGenreChange}
//             renderTags={(value: string[], getTagProps) =>
//               value.map((option: string, index: number) => (
//                 <Chip label={option} {...getTagProps({ index })} />
//               ))
//             }
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Genres"
//                 placeholder="Add genres"
//               />
//             )}
//           />

//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Description"
//             name="description"
//             value={formData.description || ''}
//             onChange={handleChange}
//           />

//           <Box>
//             <Typography variant="subtitle1" gutterBottom>
//               Cover Image
//             </Typography>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//             />
//             {isEditMode && book?.cover_image && !coverImage && (
//               <Box sx={{ mt: 2 }}>
//                 <Typography variant="caption">Current Image:</Typography>
//                 <img 
//                   src={`/storage/${book.cover_image}`} 
//                   alt="Current cover" 
//                   style={{ maxWidth: '150px', display: 'block', marginTop: '8px' }} 
//                 />
//               </Box>
//             )}
//           </Box>

//           <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={createMutation.isLoading || updateMutation.isLoading}
//             >
//               {(createMutation.isLoading || updateMutation.isLoading) ? (
//                 <CircularProgress size={24} />
//               ) : isEditMode ? 'Update Book' : 'Add Book'}
//             </Button>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => navigate('/admin/books')}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </form>

//       {(createMutation.isError || updateMutation.isError) && (
//         <Alert severity="error" sx={{ mt: 2 }}>
//           {(
//             (createMutation.error as Error)?.message || 
//             (updateMutation.error as Error)?.message || 
//             'Failed to save book'
//           )}
//         </Alert>
//       )}
//     </Box>
//   );
// };

// export default BookCreateOrEdit;