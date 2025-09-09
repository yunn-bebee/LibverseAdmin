import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  useChallenge,
  useChallengeParticipants,
  useRemoveParticipant,
  useResetParticipantProgress,
  useAwardBadge,
  useRevokeBadge,
} from '../../hooks/useChallenges';
import type { UserProgress } from '../../app/types/readingChallenge';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  IconButton,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon, Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ChallengeParticipants: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const navigate = useNavigate();
  const [perPage] = useState(15);

  if (!challengeId) {
     navigate('/admin/challenges');
    }
  const { data: challenge, isLoading: isChallengeLoading, error: challengeError } = useChallenge(challengeId || '');
  const { data: participants, isLoading: isParticipantsLoading, error: participantsError } = useChallengeParticipants(
    challengeId || '1',
    { page, per_page: perPage }
  );
  const participantsList = Array.isArray(participants?.data) ? participants.data : [];
  const removeParticipant = useRemoveParticipant();
  const resetProgress = useResetParticipantProgress();
  const awardBadge = useAwardBadge();
  const revokeBadge = useRevokeBadge();

  const handleRemove = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user from the challenge?')) {
      removeParticipant.mutate(
        { challengeId: challengeId!, userId },
        {
          onSuccess: () => toast.success('User removed successfully'),
          onError: () => toast.error('Failed to remove user'),
        }
      );
    }
  };

  const handleReset = (userId: string) => {
    if (window.confirm('Are you sure you want to reset this user’s progress? This will revoke their badge.')) {
      resetProgress.mutate(
        { challengeId: challengeId!, userId },
        {
          onSuccess: () => toast.success('Progress reset successfully'),
          onError: () => toast.error('Failed to reset progress'),
        }
      );
    }
  };

  const handleAwardBadge = (userId: string, badgeId: string) => {
    if (window.confirm('Award badge to this user?')) {
      awardBadge.mutate(
        { challengeId: challengeId!, userId, badgeId },
        {
          onSuccess: () => toast.success('Badge awarded successfully'),
          onError: () => toast.error('Failed to award badge'),
        }
      );
    }
  };

  const handleRevokeBadge = (userId: string, badgeId: string) => {
    if (window.confirm('Revoke badge from this user?')) {
      revokeBadge.mutate(
        { challengeId: challengeId!, userId, badgeId },
        {
          onSuccess: () => toast.success('Badge revoked successfully'),
          onError: () => toast.error('Failed to revoke badge'),
        }
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate('/admin/challenges')} sx={{ mb: 2 }}>
        Back to Challenges
      </Button>
      {isChallengeLoading && <CircularProgress />}
      {challengeError && <Typography color="error">Error loading challenge: {challengeError.message}</Typography>}
      {challenge && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5">{challenge.name}</Typography>
            <Typography>Description: {challenge.description || 'No description'}</Typography>
            <Typography>Status: {challenge.is_active ? 'Active' : 'Inactive'}</Typography>
            <Typography>Start Date: {challenge.start_date || 'N/A'}</Typography>
            <Typography>End Date: {challenge.end_date || 'N/A'}</Typography>
            <Typography>Target Books: {challenge.target_count || 0}</Typography>
            {challenge.badge && (
              <Typography>
                Badge: {challenge.badge.name} (
                <img src={challenge.badge.icon_url} alt={challenge.badge.name} width={50} />)
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
      <Typography variant="h6" gutterBottom>
        Participants
      </Typography>
      {isParticipantsLoading && <CircularProgress />}
      {participantsError && <Typography color="error">Error loading participants: {participantsError.message}</Typography>}
      {participants && participants.meta.pagination.count > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Books Completed</TableCell>
                <TableCell>Progress (%)</TableCell>
                <TableCell>Badge Awarded</TableCell>
                <TableCell>Joined At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participantsList.map((participant: UserProgress) => (
                <TableRow key={participant.user_id}>
                  <TableCell>{participant.username || 'N/A'}</TableCell>
                  <TableCell>{participant.email || 'N/A'}</TableCell>
                  <TableCell>{participant.progress.books_completed || 0}</TableCell>
                  <TableCell>{participant.progress.percentage || 0}%</TableCell>
                  <TableCell>
                    {participant.progress.has_badge ? (
                      <IconButton onClick={() => handleRevokeBadge(participant.user_id, challenge?.badge?.id || '')}>
                        <StarIcon color="warning" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleAwardBadge(participant.user_id, challenge?.badge?.id || '')}>
                        <StarBorderIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>{participant.joined_at || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemove(participant.user_id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleReset(participant.user_id)}>
                      <RefreshIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No participants found.</Typography>
      )}
      {participants?.meta.pagination && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2 }}>
            Page {page} of {participants.meta.pagination.total_pages}
          </Typography>
          <Button
            disabled={page === participants.meta.pagination.total_pages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChallengeParticipants;
