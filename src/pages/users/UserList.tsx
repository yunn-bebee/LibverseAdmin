// components/UserList.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Alert, 
  CircularProgress, 
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  MoreVert, 
  Delete, 
  Visibility,
  PersonOff,
  AdminPanelSettings 
} from '@mui/icons-material';
import { useUsers, useDeleteUser, useDisableUser, useUpdateUserRole, useUserStats } from '../../hooks/useUsers';
import type { User } from '../../app/types/user';

const UserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  
  const { data, isLoading, isError, error } = useUsers(
    page, 
    perPage, 
    { search: searchTerm, role: roleFilter, status: statusFilter }
  );

// Only call useUserStats when we have a valid user ID
const { data: userStats, isLoading: statsLoading, refetch: refetchStats } = useUserStats(
  selectedUser?.id || '');

// Add debug logging
console.log('Selected user ID:', selectedUser?.id);
console.log('User stats:', userStats);
console.log('Stats loading:', statsLoading);
  const deleteMutation = useDeleteUser();
  const disableMutation = useDisableUser();
  const updateRoleMutation = useUpdateUserRole();

  // Refetch stats when the dialog opens
  useEffect(() => {
    if (statsDialogOpen && selectedUser) {
      refetchStats();
    }
  }, [statsDialogOpen, selectedUser, refetchStats]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleViewStats = () => {
    setStatsDialogOpen(true);
   setMenuAnchor(null);
  };

  const handleChangeRole = () => {
    setRoleDialogOpen(true);
     setMenuAnchor(null);
  };

  const handleRoleUpdate = async () => {
    if (selectedUser && newRole) {
      try {
        await updateRoleMutation.mutateAsync({ id: selectedUser.id, role: newRole });
        setRoleDialogOpen(false);
        setNewRole('');
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      if (window.confirm(`Are you sure you want to delete user ${selectedUser.username}?`)) {
        await deleteMutation.mutateAsync(selectedUser.id);
      }
    }
    handleMenuClose();
  };

  const handleDisable = async () => {
    if (selectedUser) {
      if (window.confirm(`Are you sure you want to disable user ${selectedUser.username}?`)) {
        await disableMutation.mutateAsync(selectedUser.id);
      }
    }
    handleMenuClose();
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'banned': return 'error';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'moderator': return 'warning';
      case 'member': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="moderator">Moderator</MenuItem>
            <MenuItem value="member">Member</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="banned">Banned</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alerts */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : 'Failed to fetch users'}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Users Table */}
      {data && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.memberId}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {user.username}
                        {user.isDisabled && (
                          <Chip label="Disabled" size="small" color="error" variant="outlined" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        size="small" 
                        color={getRoleColor(user.role)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.approvalStatus} 
                        size="small" 
                        color={getStatusColor(user.approvalStatus)} 
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {data.meta.pagination.total_pages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={data.meta.pagination.total_pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewStats}>
          <Visibility sx={{ mr: 1 }} /> View Stats
        </MenuItem>
        <MenuItem onClick={handleChangeRole}>
          <AdminPanelSettings sx={{ mr: 1 }} /> Change Role
        </MenuItem>
        <MenuItem onClick={handleDisable} disabled={selectedUser?.isDisabled}>
          <PersonOff sx={{ mr: 1 }} /> {selectedUser?.isDisabled ? 'Disabled' : 'Disable User'}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Delete User
        </MenuItem>
      </Menu>

      {/* Stats Dialog */}
      <Dialog open={statsDialogOpen} onClose={() => setStatsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          User Statistics: {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          {statsLoading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          ) : userStats ? (
            <Box>
              <Typography><strong>Books Read:</strong> {userStats.books_read}</Typography>
              <Typography><strong>Badges Earned:</strong> {userStats.badges_earned}</Typography>
              <Typography><strong>Threads Created:</strong> {userStats.threads_created}</Typography>
              <Typography><strong>Posts Created:</strong> {userStats.posts_created}</Typography>
              <Typography><strong>Comments Created:</strong> {userStats.comments_created}</Typography>
            </Box>
          ) : (
            <Typography>No statistics available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Change Role for {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Role</InputLabel>
            <Select
              value={newRole}
              label="New Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
           
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRoleUpdate} 
            disabled={!newRole || updateRoleMutation.isPending}
            variant="contained"
          >
            {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;