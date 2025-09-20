// src/components/admin/forums/ForumManagementDashboard.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ForumList from './ForumList';
import ForumForm from './ForumForm';

const ForumManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Forums Management
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Create Forum
        </Button>
        <Button variant="outlined" onClick={() => navigate('/admin')}>
          Back
        </Button>
      </Box>
      <ForumList />
      <ForumForm open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
};

export default ForumManagementDashboard;