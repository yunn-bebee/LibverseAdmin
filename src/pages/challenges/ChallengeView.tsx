import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useChallenge, useDeleteChallenge, useChallengeProgress, useChallengeLeaderboard } from '../../hooks/useChallenges';
import { routes } from '../../app/route';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`challenge-tabpanel-${index}`}
      aria-labelledby={`challenge-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ChallengeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: challenge, isLoading, isError, error } = useChallenge(id || '');
  const { data: progress, isLoading: progressLoading } = useChallengeProgress(id || '');
  const { data: leaderboard, isLoading: leaderboardLoading } = useChallengeLeaderboard(id || '');

  const deleteMutation = useDeleteChallenge();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (id) {
      await deleteMutation.mutateAsync(id);
      navigate(routes.admin.challenges.index);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !challenge) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {(error as Error)?.message || 'Failed to fetch challenge'}
      </Alert>
    );
  }
  if(progressLoading){
    return(
        <CircularProgress/>
    )
  }
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(routes.admin.challenges.index)}
        >
          Back to Challenges
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {challenge.name}
        </Typography>
        <Chip
          label={challenge.is_active ? 'Active' : 'Inactive'}
          color={challenge.is_active ? 'success' : 'default'}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(routes.admin.challenges.edit(challenge.id))}
        >
          Edit Challenge
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
        >
          Delete Challenge
        </Button>
      </Box>

      {/* Basic Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Challenge Details
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {challenge.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Chip label={`Target: ${challenge.target_count} books`} />
            <Chip label={`Starts: ${formatDate(challenge.start_date)}`} />
            <Chip label={`Ends: ${formatDate(challenge.end_date)}`} />
            {challenge.badge && (
              <Chip label={`Badge: ${challenge.badge.name}`} />
            )}
          </Box>

          {challenge.has_joined && progress && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Progress: {progress.books_read} of {progress.target_count} books completed
                ({progress.percentage}%)
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Suggested Books" />
          <Tab label="Leaderboard" />
          <Tab label="Statistics" />
        </Tabs>

        {/* Suggested Books Tab */}
        <TabPanel value={activeTab} index={0}>
          {challenge.suggested_books && challenge.suggested_books.length > 0 ? (
            <List>
              {challenge.suggested_books.map((book) => (
                <ListItem key={book.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <BookIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={book.title}
                    secondary={`By ${book.author}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No suggested books for this challenge.
            </Typography>
          )}
        </TabPanel>

        {/* Leaderboard Tab */}
        <TabPanel value={activeTab} index={1}>
          {leaderboardLoading ? (
            <CircularProgress />
          ) : leaderboard && leaderboard.length > 0 ? (
            <List>
              {leaderboard.map((entry, index) => (
                <ListItem key={entry.user.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${index + 1}. ${entry.user.name} (@${entry.user.username})`}
                    secondary={`${entry.books_read} books completed`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No participants yet.
            </Typography>
          )}
        </TabPanel>

        {/* Statistics Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Challenge Statistics
          </Typography>
          {progress ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2">Books Read: {progress.books_read}</Typography>
                <Typography variant="body2">Books Remaining: {progress.books_remaining}</Typography>
                <Typography variant="body2">Completion: {progress.percentage}%</Typography>
                <Typography variant="body2">
                  Status: {progress.is_completed ? 'Completed' : 'In Progress'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">
              No statistics available. Join the challenge to track progress.
            </Typography>
          )}
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Challenge</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this challenge? This action cannot be undone.
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

export default ChallengeView;