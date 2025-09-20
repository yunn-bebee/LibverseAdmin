// src/components/admin/forums/ForumDetail.tsx
import React, { useState } from 'react';
import { Box, Button, CircularProgress, Switch, Tab, Tabs, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForum, useToggleForumPublic } from '../../hooks/useForum';
import ThreadList from './ThreadList';
import ForumMembership from './ForumMembership';

const ForumDetail: React.FC = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const { data: forum, isLoading, error } = useForum(forumId!);
  const togglePublic = useToggleForumPublic();

  const handleTogglePublic = () => {
    togglePublic.mutate(forumId!, {
      onSuccess: () => toast.success('Visibility toggled'),
      onError: () => toast.error('Error toggling visibility'),
    });
  };

  if (isLoading) return <CircularProgress />;
  if (error || !forum) return <Typography color="error">Error loading forum</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">{forum.name}</Typography>
      <Typography>{forum.description}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>Public</Typography>
        <Switch checked={forum.is_public} onChange={handleTogglePublic} />
      </Box>
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Threads" />
        <Tab label="Membership" />
      </Tabs>
      {tabValue === 0 && <ThreadList />}
      {tabValue === 1 && <ForumMembership />}
      <Button variant="outlined" onClick={() => navigate('/admin/forums')}>
        Back
      </Button>
    </Box>
  );
};

export default ForumDetail;