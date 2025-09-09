import React, { useState } from 'react';
import { useChallenges, useDeleteChallenge } from '../../hooks/useChallenges';
import type{ ReadingChallenge, ChallengeFilters } from '../../app/types/readingChallenge';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  CircularProgress,
  Typography,
 type  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Group as GroupIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BulkUpdateModal from './BulkUpdateModel';
import { toast } from 'react-toastify';

const ChallengeList: React.FC = () => {
  const [filters, setFilters] = useState<ChallengeFilters>({ active: undefined, search: '' });
  
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useChallenges({ ...filters, page, per_page: 15 });
  const deleteChallenge = useDeleteChallenge();
  const challenges = (data?.data ?? []) as ReadingChallenge[];
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(challenges.map((challenge: ReadingChallenge) => challenge.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      deleteChallenge.mutate(id, {
        onSuccess: () => toast.success('Challenge deleted successfully'),
        onError: () => toast.error('Failed to delete challenge'),
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reading Challenges
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        
        <TextField
          label="Search by name"
          name="search"
          value={filters.search || ''}
          onChange={handleSelectChange}
          sx={{ flex: 1 }}
        />
        <Select
          name="active"
          value={filters.active === undefined ? 'all' : filters.active ? 'true' : 'false'}
          onChange={handleFilterChange}
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </Select>
        <Button
          variant="contained"
          onClick={() => navigate('/admin/challenges/create')}
        >
          Create Challenge
        </Button>
        <Button
          variant="contained"
          disabled={selectedIds.length === 0}
          onClick={() => setIsBulkModalOpen(true)}
        >
          Bulk Actions
        </Button>
      </Box>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Error loading challenges</Typography>}
      {data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.length === data?.meta?.pagination?.total && data?.meta?.pagination?.total > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {challenges.map((challenge: ReadingChallenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(challenge.id)}
                      onChange={() => handleSelect(challenge.id)}
                    />
                  </TableCell>
                  <TableCell>{challenge.name}</TableCell>
                  <TableCell>
                    <Typography color={challenge.is_active ? 'success.main' : 'text.secondary'}>
                      {challenge.is_active ? 'Active' : 'Inactive'}
                    </Typography>
                  </TableCell>
                  <TableCell>{challenge.start_date}</TableCell>
                  <TableCell>{challenge.end_date}</TableCell>
                  <TableCell>{challenge.target_count}</TableCell>
                  <TableCell>{challenge.participants_count || 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/admin/challenges/${challenge.id}/participants`)}>
                      <GroupIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/admin/challenges/${challenge.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(challenge.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {data?.meta.pagination && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2 }}>
            Page {page} of {data.meta.pagination.total_pages}
          </Typography>
          <Button
            disabled={page === data.meta.pagination.total_pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      )}
      <BulkUpdateModal
        open={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        challengeIds={selectedIds}
      />
    </Box>
  );
};

export default ChallengeList;