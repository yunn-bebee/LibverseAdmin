import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Pagination,
  
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Paper,
  Grid,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fab,
  useTheme,
  alpha,
  Card
} from '@mui/material';
import {
  Lock,
  LockOpen,
  PushPin,
  PushPinOutlined,
  MoreVert,
  Search,
  Add,
  Flag,
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteBorder,
  Reply,
  Image,
  VideoFile,
  PictureAsPdf,
  AdminPanelSettings,
  Shield,
  Person
} from '@mui/icons-material';

import { useThread, useToggleThreadPin, useToggleThreadLock, usePosts, useCreatePost, useUploadMedia } from '../../hooks/useForum';
import { useParams } from 'react-router-dom';
import type { Media, Post } from '../../app/types/forum';

const ITEMS_PER_PAGE = 10;

const ThreadView: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  if (!id) {
    console.error('Thread ID is required in the URL parameters');
  }
  
  const [postSearch, setPostSearch] = useState('');
  const [newPost, setNewPost] = useState({ content: '' });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);

  const { data: thread, isLoading: threadLoading, isError: threadError, error: threadErrorObj } = useThread(id || '');
  const toggleThreadPinMutation = useToggleThreadPin(thread?.forum_id.toString() || '');
  const toggleThreadLockMutation = useToggleThreadLock(thread?.forum_id.toString() || '');
  const { data: postsData, isLoading: postsLoading, isError: postsError, error: postsErrorObj } = usePosts(id || '', { search: postSearch }, ITEMS_PER_PAGE);
  const createPostMutation = useCreatePost(id || '');
  const uploadMediaMutation = useUploadMedia();

  const handleToggleThreadPin = () => {
    toggleThreadPinMutation.mutate(id || '');
  };

  const handleToggleThreadLock = () => {
    toggleThreadLockMutation.mutate(id || '');
    setActionMenuAnchor(null);
  };

  const handleCreatePost = () => {
    createPostMutation.mutate(newPost, {
      onSuccess: (newPostData) => {
        setNewPost({ content: '' });
        if (mediaFile) {
          const formData = new FormData();
          formData.append('file', mediaFile);
          uploadMediaMutation.mutate({ postId: newPostData.id.toString(), formData }, {
            onSuccess: () => setMediaFile(null),
          });
        }
      },
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, post: Post) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedPost(post);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedPost(null);
  };

  const handleOpenReplyDialog = (post: Post) => {
    setSelectedPost(post);
    setReplyDialogOpen(true);
  };

  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setSelectedPost(null);
  };

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image color="primary" />;
    if (fileType.includes('video')) return <VideoFile color="secondary" />;
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ color: '#f40f02' }} />;
    return <Image color="primary" />;
  };

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Assuming postsData.data is the list of top-level posts, possibly with nested replies
  const paginatedPosts = postsData?.data || [];
  const totalPages = postsData?.data ? Math.ceil(postsData.data.length / ITEMS_PER_PAGE) : 1;
  const postsCount = thread?.posts_count || postsData?.meta?.pagination?.total || 0;
  console.log('Posts Data:', paginatedPosts, totalPages, postsCount);
  if (threadLoading || postsLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
    </Box>
  );
  
  if (threadError) return <Alert severity="error" sx={{ m: 2 }}>{(threadErrorObj as Error)?.message || 'Failed to load thread'}</Alert>;
  if (postsError) return <Alert severity="error" sx={{ m: 2 }}>{(postsErrorObj as Error)?.message || 'Failed to load posts'}</Alert>;

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      maxWidth: 1400, 
      mx: 'auto', 
      bgcolor: 'background.default',
      minHeight: '100vh'
    }}>
      {/* Thread Header */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: '800', mr: 2 }}>
                {thread?.title}
              </Typography>
              {thread?.is_pinned && (
                <PushPin color="primary" sx={{ fontSize: 28 }} />
              )}
              {thread?.is_locked && (
                <Lock color="error" sx={{ fontSize: 28, ml: 1 }} />
              )}
            </Box>
            
            <Typography variant="body1" sx={{ 
              color: 'text.secondary', 
              lineHeight: 1.6,
              mb: 2 
            }}>
              {thread?.content}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                icon={<AdminPanelSettings />} 
                label={`Posts: ${postsCount}`} 
                color="primary" 
                variant="outlined" 
                size="small"
              />
              <Chip 
                label={`Type: ${thread?.post_type}`} 
                color="secondary" 
                variant="outlined" 
                size="small"
              />
              <Chip 
                icon={<Person />} 
                label={`By: ${thread?.user?.username || thread?.user?.id}`} 
                variant="outlined" 
                size="small"
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={thread?.is_pinned ? 'Unpin Thread' : 'Pin Thread'}>
              <IconButton 
                onClick={handleToggleThreadPin} 
                color={thread?.is_pinned ? 'primary' : 'default'}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, thread?.is_pinned ? 0.1 : 0.05),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                {thread?.is_pinned ? <PushPin /> : <PushPinOutlined />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title={thread?.is_locked ? 'Unlock Thread' : 'Lock Thread'}>
              <IconButton 
                onClick={handleToggleThreadLock} 
                color={thread?.is_locked ? 'error' : 'default'}
                sx={{ 
                  bgcolor: alpha(theme.palette.error.main, thread?.is_locked ? 0.1 : 0.05),
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                }}
              >
                {thread?.is_locked ? <Lock /> : <LockOpen />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Search sx={{ mr: 1, color: 'text.secondary' }} />
          <TextField
            fullWidth
            size="small"
            placeholder="Search posts..."
            value={postSearch}
            onChange={(e) => setPostSearch(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.8)
              }
            }}
          />
        </Box>
      </Paper>

      {/* New Post Card */}
      {!thread?.is_locked && (
        <Paper 
          elevation={1} 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            bgcolor: alpha(theme.palette.primary.main, 0.03)
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Add a Post
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your thoughts..."
            value={newPost.content}
            onChange={(e) => setNewPost({ content: e.target.value })}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Add />}
              size="small"
              sx={{ borderRadius: 3 }}
            >
              Add Media
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,video/mp4,application/pdf"
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
              />
            </Button>
            
            {mediaFile && (
              <Chip 
                icon={getFileIcon(mediaFile.type)} 
                label={mediaFile.name} 
                onDelete={() => setMediaFile(null)}
                variant="outlined"
                size="small"
              />
            )}
            
            <Button 
              onClick={handleCreatePost} 
              variant="contained" 
              disabled={!newPost.content}
              sx={{ borderRadius: 3, px: 3 }}
            >
              Post
            </Button>
          </Box>
        </Paper>
      )}

      {/* Posts List */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          Discussion
          <Chip 
            label={postsCount} 
            color="primary" 
            size="small" 
            sx={{ ml: 2, fontWeight: 600 }} 
          />
        </Typography>
        
        {paginatedPosts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary">
              No posts found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {postSearch ? 'Try a different search term' : 'Be the first to post in this thread'}
            </Typography>
          </Paper>
        ) : (
          <>
            {paginatedPosts.map((post: Post) => (
              <Paper 
                key={post.uuid || post.id} 
                elevation={1}
                sx={{ 
                  mb: 3, 
                  p: 3, 
                  borderRadius: 3,
                  border: post.is_flagged ? `2px solid ${theme.palette.error.main}` : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: post.is_flagged ? alpha(theme.palette.error.main, 0.03) : 'background.paper'
                }}
              >
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        color: 'white', 
                        borderRadius: '50%', 
                        width: 22, 
                        height: 22, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {post.user?.role?.charAt(0)}
                      </Box>
                    }
                  >
                    <Avatar
                      src={post.user?.profile?.profilePicture}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    >
                      {post.user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {post.user?.username}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatRelativeTime(post.created_at)}
                          {post.is_flagged && (
                            <Box component="span" sx={{ ml: 1, color: 'error.main' }}>
                              • Flagged
                            </Box>
                          )}
                        </Typography>
                      </Box>
                      
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleActionMenuOpen(e, post)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    
                    {post.user?.profile?.bio && (
                      <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        {post.user.profile.bio}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {post.content}
                </Typography>
                
                {/* Media */}
                {post.media && post.media.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={1}>
                      {post.media.map((media : Media) => (
                        <Card key={media.id}>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 1, 
                              display: 'flex', 
                              alignItems: 'center', 
                              borderRadius: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.05)
                            }}
                          >
                            {getFileIcon(media.file_type)}
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              {media.caption || 'Attachment'}
                            </Typography>
                          </Paper>
                        </Card>
                      ))}
                    </Grid>
                  </Box>
                )}
                
                {/* Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Tooltip title={post.is_liked ? 'Unlike' : 'Like'}>
                    <IconButton size="small" sx={{ mr: 1 }}>
                      {post.is_liked ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  <Typography variant="caption" sx={{ mr: 2 }}>
                    {post.likes_count}
                  </Typography>
                  
                  <Tooltip title={post.is_saved ? 'Unsave' : 'Save'}>
                    <IconButton size="small" sx={{ mr: 1 }}>
                      {post.is_saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Reply">
                    <IconButton 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenReplyDialog(post)}
                    >
                      <Reply />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Flag">
                    <IconButton size="small">
                      <Flag color={post.is_flagged ? 'error' : 'inherit'} />
                    </IconButton>
                  </Tooltip>
                  
                  <Box sx={{ flexGrow: 1 }} />
                  
                  {post.replies_count > 0 && (
                    <Chip 
                      label={`${post.replies_count} ${post.replies_count === 1 ? 'reply' : 'replies'}`} 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {/* Nested Replies */}
                {post.replies && post.replies.length > 0 && (
                  <Box sx={{ mt: 2, pl: 3, borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                    {post.replies.map((reply) => (
                      <Box key={reply.uuid || reply.id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <Avatar
                            src={reply.user?.profile?.profilePicture}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          >
                            {reply.user?.username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {reply.user?.username}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatRelativeTime(reply.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {reply.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Reply to {selectedPost?.user?.username}'s post
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Write your reply..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseReplyDialog}>
            Post Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={handleActionMenuClose}>
          <ListItemIcon>
            <Flag fontSize="small" />
          </ListItemIcon>
          <ListItemText>{selectedPost?.is_flagged ? 'Unflag Post' : 'Flag Post'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <ListItemIcon>
            <Shield fontSize="small" />
          </ListItemIcon>
          <ListItemText>Moderate Post</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <ListItemIcon>
            <AdminPanelSettings fontSize="small" />
          </ListItemIcon>
          <ListItemText>View User Details</ListItemText>
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'none', md: 'flex' }
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ThreadView;