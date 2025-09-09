import React, { useState } from 'react';
import { useBulkUpdateChallenges, useBadges } from '../../hooks/useChallenges';
import {type Badge, type  ReadingChallenge as Challenge } from '../../app/types/readingChallenge';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';

interface BulkUpdateModalProps {
  open: boolean;
  onClose: () => void;
  challengeIds: string[];
}

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({ open, onClose, challengeIds }) => {
  const [updates, setUpdates] = useState<Partial<Challenge>>({});
  const { data: badgesResponse, isLoading: badgesLoading } = useBadges();
  const bulkUpdate = useBulkUpdateChallenges();

  const badges: Badge[] = Array.isArray(badgesResponse?.data) ? badgesResponse.data : [];
  const handleChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
  ) => {
    setUpdates({ ...updates, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    bulkUpdate.mutate(
      { challengeIds, updates },
      {
        onSuccess: (result) => {
          toast.success(`Updated ${result.success_count} challenges successfully`);
          if (result.failure_count > 0) {
            toast.error(`Failed to update ${result.failure_count} challenges: ${result.failed_ids.join(', ')}`);
          }
          onClose();
        },
        onError: () => toast.error('Failed to update challenges'),
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update {challengeIds.length} Challenges</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={updates.is_active ?? false}
                onChange={(e) => setUpdates({ ...updates, is_active: e.target.checked })}
                name="is_active"
              />
            }
            label="Active Status"
          />
        </FormControl>
        <TextField
          label="Start Date"
          type="date"
          name="start_date"
          value={updates.start_date || ''}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          name="end_date"
          value={updates.end_date || ''}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Target Count"
          type="number"
          name="target_count"
          value={updates.target_count || ''}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <Select
            name="badge_id"
            value={updates.badge_id || ''}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">No Change</MenuItem>
            {badgesLoading ? (
              <MenuItem disabled>Loading badges...</MenuItem>
            ) : (
              badges?.map((badge) => (
                <MenuItem key={badge.id} value={badge.id}>
                  {badge.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={bulkUpdate.isPending || Object.keys(updates).length === 0}
        >
          {bulkUpdate.isPending ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUpdateModal;