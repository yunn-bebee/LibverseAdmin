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
  Chip,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useChallenges, useDeleteChallenge, useJoinChallenge } from '../../hooks/useChallenges';
import { routes } from '../../app/route';
import type { ReadingChallenge as Challenge} from '../../app/types/readingChallenge';

const ITEMS_PER_PAGE = 10;

const ChallengeList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const navigate = useNavigate();

  const {
    data: allChallenges = { data: [] },
    isLoading,
    isError,
    error,
    refetch,
  } = useChallenges();

  const deleteMutation = useDeleteChallenge();
  const joinMutation = useJoinChallenge();

  // Filter and paginate challenges on the client side
  const { filteredChallenges, totalPages, totalFilteredItems } = useMemo(() => {
    let result = [...allChallenges.data];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(challenge =>
        challenge.name.toLowerCase().includes(term) ||
        challenge.description.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      if (statusFilter === 'active') {
        result = result.filter(challenge => challenge.is_active);
      } else if (statusFilter === 'inactive') {
        result = result.filter(challenge => !challenge.is_active);
      } else if (statusFilter === 'current') {
        const now = new Date();
        result = result.filter(challenge => 
          new Date(challenge.start_date) <= now && new Date(challenge.end_date) >= now
        );
      }
    }

    // Calculate pagination
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Paginate results
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedChallenges = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      filteredChallenges: paginatedChallenges,
      totalPages,
      totalFilteredItems: totalItems,
    };
  }, [allChallenges.data, searchTerm, statusFilter, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedChallenge) {
      await deleteMutation.mutateAsync(selectedChallenge.id);
      setDeleteDialogOpen(false);
      setSelectedChallenge(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedChallenge(null);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    await joinMutation.mutateAsync(challengeId);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        gap: 2,
      }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Challenges Management
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(routes.admin.challenges.create)}
        >
          Create Challenge
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        flexWrap: 'wrap',
      }}>
        <TextField
          label="Search Challenges"
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={isLoading}
          sx={{ minWidth: 200 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={handleStatusChange}
            disabled={isLoading}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="current">Current</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alerts */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error)?.message || 'Failed to fetch challenges'}
        </Alert>
      )}
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => deleteMutation.reset()}>
          {(deleteMutation.error as Error)?.message || 'Failed to delete challenge'}
        </Alert>
      )}
      {joinMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => joinMutation.reset()}>
          {(joinMutation.error as Error)?.message || 'Failed to join challenge'}
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
              mb: 4,
            }}>
              <Typography variant="h6" color="textSecondary">
                {searchTerm || statusFilter
                  ? 'No challenges match your search criteria'
                  : 'No challenges available'}
              </Typography>
            </Box>
          )}

          {/* Challenges Grid */}
          {totalFilteredItems > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredChallenges.map((challenge: Challenge) => (
                <Card key={challenge.id} sx={{ width: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {challenge.name}
                      </Typography>
                      <Chip
                        label={challenge.is_active ? 'Active' : 'Inactive'}
                        color={challenge.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {challenge.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={`Target: ${challenge.target_count} books`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`Starts: ${formatDate(challenge.start_date)}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`Ends: ${formatDate(challenge.end_date)}`}
                        variant="outlined"
                        size="small"
                      />
                      {challenge.has_joined && (
                        <Chip
                          label="Joined"
                          color="primary"
                          size="small"
                        />
                      )}
                    </Box>

                    {challenge.badge && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2">Badge:</Typography>
                        <Chip
                          label={challenge.badge.name}
                          size="small"
                        />
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(routes.admin.challenges.edit(challenge.id))}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => navigate(routes.admin.challenges.view(challenge.id))}
                    >
                      View Details
                    </Button>
                    {!challenge.has_joined && (
                      <Button
                        size="small"
                        onClick={() => handleJoinChallenge(challenge.id)}
                        disabled={joinMutation.isPending}
                      >
                        Join
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(challenge)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))}

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
            </Box>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Challenge</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the challenge "{selectedChallenge?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChallengeList;