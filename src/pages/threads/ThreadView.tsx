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

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,

  useTheme,
  
} from '@mui/material';
import {
  Lock,
  LockOpen,
  PushPin,
  PushPinOutlined,
  MoreVert,

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

  Edit,
  Delete,

} from '@mui/icons-material';

import {
  useThread,
  useToggleThreadPin,
  useToggleThreadLock,
  usePosts,
  useCreatePost,
  useUploadMedia,
  useTogglePostLike,
  useTogglePostSave,
  useTogglePostFlag,
  useCreateComment,
  useUpdatePost,
  useDeletePost,
} from '../../hooks/useForum';
import { useParams } from 'react-router-dom';
import type { Post } from '../../app/types/forum';

const ITEMS_PER_PAGE = 10;

const ThreadView: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  if (!id) {
    console.error('Thread ID is required in the URL parameters');
  }
  const threadId = id || '';

  const [postSearch, setPostSearch] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editPost, setEditPost] = useState<{ id: string; content: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);


  const { data: thread, isLoading: threadLoading, isError: threadError, error: threadErrorObj } = useThread(threadId);
  const toggleThreadPinMutation = useToggleThreadPin(thread?.forum_id.toString() || '');
  const toggleThreadLockMutation = useToggleThreadLock(thread?.forum_id.toString() || '');
  const { data: postsData, isLoading: postsLoading, isError: postsError, error: postsErrorObj } = usePosts(threadId, { search: postSearch, page: currentPage }, ITEMS_PER_PAGE);

  // --- Post Interaction Hooks ---
  const createPostMutation = useCreatePost(threadId);
  const uploadMediaMutation = useUploadMedia();
  const toggleLikeMutation = useTogglePostLike();
  const toggleSaveMutation = useTogglePostSave();
  const toggleFlagMutation = useTogglePostFlag();
  const createCommentMutation = useCreateComment();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();


  const handleToggleThreadPin = () => toggleThreadPinMutation.mutate(threadId);
  const handleToggleThreadLock = () => toggleThreadLockMutation.mutate(threadId);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    createPostMutation.mutate({ content: newPostContent }, {
      onSuccess: (newPostData) => {
        setNewPostContent('');
        if (mediaFile && newPostData.uuid) {
          const formData = new FormData();
          formData.append('file', mediaFile);
          uploadMediaMutation.mutate({ postId: newPostData.uuid, formData }, {
            onSuccess: () => setMediaFile(null),
          });
        }
      },
    });
  };

  const handleToggleLike = (post: Post) => toggleLikeMutation.mutate({ postId: post.uuid, action: post.is_liked ? 'unlike' : 'like' });
  const handleToggleSave = (post: Post) => toggleSaveMutation.mutate({ postId: post.uuid, action: post.is_saved ? 'unsave' : 'save' });
  const handleToggleFlag = () => {
    if (!selectedPost) return;
    toggleFlagMutation.mutate(selectedPost.uuid);
    handleActionMenuClose();
  };

  const handlePostReply = () => {
    if (!selectedPost || !replyContent.trim()) return;
    createCommentMutation.mutate({ postId: selectedPost.uuid, data: { content: replyContent } }, {
      onSuccess: () => {
        setReplyContent('');
        handleCloseReplyDialog();
      }
    });
  };
  
  const handleUpdatePost = () => {
      if (!editPost) return;
      updatePostMutation.mutate({ postId: editPost.id, data: { content: editPost.content } }, {
          onSuccess: () => setEditPost(null)
      });
  };

  const handleDeletePost = () => {
      if (!confirmDelete) return;
      deletePostMutation.mutate(confirmDelete.uuid, {
          onSuccess: () => setConfirmDelete(null)
      });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => setCurrentPage(page);
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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image color="primary" />;
    if (fileType.includes('video')) return <VideoFile color="secondary" />;
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ color: '#f40f02' }} />;
    return <Image color="primary" />;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const paginatedPosts = postsData?.data || [];
  const totalPages = postsData?.meta?.pagination?.count || 1;
  const postsCount = thread?.posts_count || postsData?.meta?.pagination?.total || 0;

  if (threadLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (threadError) return <Alert severity="error">{(threadErrorObj as Error)?.message || 'Failed to load thread'}</Alert>;

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={2} sx={{ mb: 3, p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: '700' }}>{thread?.title}</Typography>
            <Box>
                <Tooltip title={thread?.is_pinned ? 'Unpin' : 'Pin'}>
                    <IconButton onClick={handleToggleThreadPin} color={thread?.is_pinned ? 'primary' : 'default'}>
                        {thread?.is_pinned ? <PushPin /> : <PushPinOutlined />}
                    </IconButton>
                </Tooltip>
                <Tooltip title={thread?.is_locked ? 'Unlock' : 'Lock'}>
                    <IconButton onClick={handleToggleThreadLock} color={thread?.is_locked ? 'error' : 'default'}>
                        {thread?.is_locked ? <Lock /> : <LockOpen />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{thread?.content}</Typography>
        <Chip label={`Posts: ${postsCount}`} color="primary" variant="outlined" size="small"/>
      </Paper>

      {!thread?.is_locked && (
        <Paper elevation={1} sx={{ mb: 3, p: 2, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add a Post</Typography>
          <TextField fullWidth multiline rows={3} placeholder="Share your thoughts..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} sx={{ mb: 2 }}/>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button component="label" variant="outlined" startIcon={<Add />} size="small">
              Add Media
              <input type="file" hidden onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
            </Button>
            {mediaFile && <Chip icon={getFileIcon(mediaFile.type)} label={mediaFile.name} onDelete={() => setMediaFile(null)} size="small" />}
            <Button onClick={handleCreatePost} variant="contained" disabled={!newPostContent.trim() || createPostMutation.isPending}>Post</Button>
          </Box>
        </Paper>
      )}

      {postsLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> :
       postsError ? <Alert severity="error">{(postsErrorObj as Error)?.message || 'Failed to load posts'}</Alert> :
       paginatedPosts.length === 0 ? <Paper sx={{ p: 4, textAlign: 'center' }}><Typography>No posts yet.</Typography></Paper> :
       (
        <>
          {paginatedPosts.map((post: Post) => (
            <Paper key={post.uuid} elevation={1} sx={{ mb: 2, p: 2, borderRadius: 3, borderLeft: post.is_flagged ? `4px solid ${theme.palette.error.main}` : 'none' }}>
                {editPost?.id === post.uuid ? (
                    <Box>
                        <TextField fullWidth multiline value={editPost.content} onChange={(e) => setEditPost({...editPost, content: e.target.value })} sx={{ mb: 1 }} />
                        <Button onClick={handleUpdatePost} disabled={updatePostMutation.isPending}>Save</Button>
                        <Button onClick={() => setEditPost(null)}>Cancel</Button>
                    </Box>
                ) : (
                <>
                <Box sx={{ display: 'flex', mb: 2 }}>
                    <Avatar src={post.user?.profile?.profilePicture} sx={{ mr: 2 }}>{post.user?.username?.charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600">{post.user?.username}</Typography>
                                <Typography variant="caption" color="textSecondary">{formatRelativeTime(post.created_at)}</Typography>
                            </Box>
                            <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, post)}><MoreVert /></IconButton>
                        </Box>
                        <Typography variant="body1" sx={{ my: 1 }}>{post.content}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Tooltip title="Like"><IconButton onClick={() => handleToggleLike(post)} size="small">{post.is_liked ? <Favorite color="error" /> : <FavoriteBorder />}</IconButton></Tooltip>
                    <Typography variant="caption" sx={{ mr: 2 }}>{post.likes_count}</Typography>
                    <Tooltip title="Save"><IconButton onClick={() => handleToggleSave(post)} size="small">{post.is_saved ? <Bookmark color="primary" /> : <BookmarkBorder />}</IconButton></Tooltip>
                    <Tooltip title="Reply"><IconButton onClick={() => handleOpenReplyDialog(post)} size="small"><Reply /></IconButton></Tooltip>
                    <Box sx={{ flexGrow: 1 }} />
                    {post.replies_count > 0 && <Chip label={`${post.replies_count} replies`} size="small" />}
                </Box>
                </>
                )}

                {post.replies && post.replies.length > 0 && (
                    <Box sx={{ mt: 2, pl: 4, borderLeft: `2px solid ${theme.palette.divider}` }}>
                        {/* Render replies here, or use a recursive component */}
                    </Box>
                )}
            </Paper>
          ))}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination count={totalPages | 1} page={currentPage} onChange={handlePageChange} color="primary" />
            </Box>
          )}
        </>
      )}

      <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog} fullWidth>
        <DialogTitle>Reply to {selectedPost?.user?.username}</DialogTitle>
        <DialogContent>
          <TextField autoFocus multiline rows={4} fullWidth variant="outlined" placeholder="Write your reply..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>Cancel</Button>
          <Button onClick={handlePostReply} variant="contained" disabled={!replyContent.trim() || createCommentMutation.isPending}>Post Reply</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this post by {confirmDelete?.user.username}? This cannot be undone.</Typography></DialogContent>
        <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button onClick={handleDeletePost} color="error" disabled={deletePostMutation.isPending}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={actionMenuAnchor} open={Boolean(actionMenuAnchor)} onClose={handleActionMenuClose}>
        <MenuItem onClick={() => { setEditPost({ id: selectedPost!.uuid, content: selectedPost!.content }); handleActionMenuClose(); }}><ListItemIcon><Edit fontSize="small" /></ListItemIcon><ListItemText>Edit Post</ListItemText></MenuItem>
        <MenuItem onClick={() => { setConfirmDelete(selectedPost); handleActionMenuClose(); }}><ListItemIcon><Delete fontSize="small" /></ListItemIcon><ListItemText>Delete Post</ListItemText></MenuItem>
        <MenuItem onClick={handleToggleFlag}><ListItemIcon><Flag fontSize="small" /></ListItemIcon><ListItemText>{selectedPost?.is_flagged ? 'Unflag' : 'Flag'}</ListItemText></MenuItem>
      </Menu>
    </Box>
  );
};

export default ThreadView;
