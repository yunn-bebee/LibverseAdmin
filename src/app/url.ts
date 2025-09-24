const app_base_url = "http://localhost:8000/api/v1";

export const url = {
  auth: {
    login: `${app_base_url}/auth/login`,
    logout: `${app_base_url}/auth/logout`,
    register: `${app_base_url}/auth/register`,
    admin: {
      approveUser: (userId: string) => `${app_base_url}/auth/admin/approve-user/${userId}`,
      pendingUsers: `${app_base_url}/auth/admin/pending-users`,
      rejectUser: (userId: string) => `${app_base_url}/auth/admin/reject-user/${userId}`,
    },
  },

  badge: {
    index: `${app_base_url}/badge`,
    store: `${app_base_url}/badge`,
    show: (badgeId: string) => `${app_base_url}/badge/${badgeId}`,
    update: (badgeId: string) => `${app_base_url}/badge/${badgeId}`,
    destroy: (badgeId: string) => `${app_base_url}/badge/${badgeId}`,
  },

  book: {
    index: `${app_base_url}/book`,
    store: `${app_base_url}/book`,
    searchGoogle: `${app_base_url}/book/search/google`,
    createFromGoogle: `${app_base_url}/book/google`,
    show: (bookId: string) => `${app_base_url}/book/${bookId}`,
    update: (bookId: string) => `${app_base_url}/book/${bookId}`,
    destroy: (bookId: string) => `${app_base_url}/book/${bookId}`,
  },

    challenge: {
    index: `${app_base_url}/challenges`,
    store: `${app_base_url}/admin/challenges`,
    show: (challengeId: string) => `${app_base_url}/challenges/${challengeId}`,
    update: (challengeId: string) => `${app_base_url}/admin/challenges/${challengeId}`,
    destroy: (challengeId: string) => `${app_base_url}/admin/challenges/${challengeId}`,
    join: (challengeId: string) => `${app_base_url}/challenges/${challengeId}/join`,
    books: (challengeId: string) => `${app_base_url}/challenges/${challengeId}/books`,
    addBook: (challengeId: string) => `${app_base_url}/admin/challenges/${challengeId}/books`,
    removeBook: (challengeId: string, bookId: string) => `${app_base_url}/admin/challenges/${challengeId}/books/${bookId}`,
    addUserBook: (challengeId: string, userId: string) => `${app_base_url}/admin/challenges/${challengeId}/users/${userId}/books`,
    removeUserBook: (challengeId: string, userId: string, bookId: string) => `${app_base_url}/admin/challenges/${challengeId}/users/${userId}/books/${bookId}`,
    updateBook: (recordId: string) => `${app_base_url}/challenges/books/${recordId}/status`,
    progress: (challengeId: string) => `${app_base_url}/challenges/${challengeId}/progress`,
    leaderboard: (challengeId: string) => `${app_base_url}/challenges/${challengeId}/leaderboard`,
    participants: (challengeId: string) => `${app_base_url}/admin/challenges/${challengeId}/users`,
    bulkUpdate: `${app_base_url}/admin/challenges/bulk-update`,
    removeUser: (challengeId: string, userId: string) => `${app_base_url}/admin/challenges/${challengeId}/users/${userId}`,
    resetProgress: (challengeId: string, userId: string) => `${app_base_url}/admin/challenges/${challengeId}/users/${userId}/reset`,
    awardBadge: (userId: string) => `${app_base_url}/admin/users/${userId}/badges`,
    revokeBadge: (userId: string, badgeId: string) => `${app_base_url}/admin/users/${userId}/badges/${badgeId}`,
    stats: `${app_base_url}/admin/challenges/stats`,
  },

  event: {
    index: `${app_base_url}/events`,
    store: `${app_base_url}/events`,
    show: (eventId: string) => `${app_base_url}/events/${eventId}`,
    update: (eventId: string) => `${app_base_url}/events/${eventId}`,
    destroy: (eventId: string) => `${app_base_url}/events/${eventId}`,
    rsvp: (eventId: string) => `${app_base_url}/events/${eventId}/rsvp`,
    rsvpCounts: (eventId: string) => `${app_base_url}/events/${eventId}/rsvp-counts`,
  },

  forum: {
    index: `${app_base_url}/forums`,
    store: `${app_base_url}/forums`,
    show: (forumId: string) => `${app_base_url}/forums/${forumId}`,
    update: (forumId: string) => `${app_base_url}/forums/${forumId}`,
    destroy: (forumId: string) => `${app_base_url}/forums/${forumId}`,
    togglePublic: (forumId: string) => `${app_base_url}/forums/${forumId}/toggle-public`,
    join: (forumId: string) => `${app_base_url}/forums/${forumId}/join`,
    leave: (forumId: string) => `${app_base_url}/forums/${forumId}/leave`,
    members: (forumId: string) => `${app_base_url}/forums/${forumId}/members`,
    approveJoin: (forumId: string) => `${app_base_url}/forums/${forumId}/approve-join`,
    rejectJoin: (forumId: string) => `${app_base_url}/forums/${forumId}/reject-join`,
    activityFeed: `${app_base_url}/activity-feed`,
    
    threads: {
      index: (forumId: string) => `${app_base_url}/forums/${forumId}/threads`,
      store: (forumId: string) => `${app_base_url}/forums/${forumId}/threads`,
      show: (threadId: string) => `${app_base_url}/threads/${threadId}`,
      update: (threadId: string) => `${app_base_url}/threads/${threadId}`,
      destroy: (threadId: string) => `${app_base_url}/threads/${threadId}`,
      togglePin: (forumId: string, threadId: string) =>
        `${app_base_url}/forums/${forumId}/threads/${threadId}/toggle-pin`,
      toggleLock: (forumId: string, threadId: string) =>
        `${app_base_url}/forums/${forumId}/threads/${threadId}/toggle-lock`,
    },
  },

  posts: {
    index: (threadId: string) => `${app_base_url}/threads/${threadId}/posts`,
    store: (threadId: string) => `${app_base_url}/threads/${threadId}/posts`,
    show: (postId: string) => `${app_base_url}/posts/${postId}`,
    update: (postId: string) => `${app_base_url}/posts/${postId}`,
    destroy: (postId: string) => `${app_base_url}/posts/${postId}`,
    like: (postId: string) => `${app_base_url}/posts/${postId}/like`,
    save: (postId: string) => `${app_base_url}/posts/${postId}/save`,
    comment: (postId: string) => `${app_base_url}/posts/${postId}/comment`,
    report: (postId: string) => `${app_base_url}/posts/${postId}/report`,
    uploadMedia: (postId: string) => `${app_base_url}/posts/${postId}/media`,
    updateMedia: (postId: string , mediaId:string) => `${app_base_url}/posts/${postId}/media/${mediaId}`,
    deleteMedia: (postId: string , mediaId:string) => `${app_base_url}/posts/${postId}/media/${mediaId}`,
    unflag: (postId: string) => `${app_base_url}/posts/admin/posts/${postId}/unflag`,
    flag: (postId: string) => `${app_base_url}/posts/admin/posts/${postId}/flag`,
    reported: `${app_base_url}/posts/admin/reported-posts`,
  },

  notification: {
    index: `${app_base_url}/notifications`,
    counts: `${app_base_url}/notifications/counts`,
    updatePreferences: `${app_base_url}/notifications/preferences`,
    markAllAsRead: `${app_base_url}/notifications/read-all`,
    clearAll: `${app_base_url}/notifications`,
    destroy: (id: string) => `${app_base_url}/notifications/${id}`,
    markAsRead: (id: string) => `${app_base_url}/notifications/${id}/read`,
  },

  profile: {
    show: `${app_base_url}/profile`,
    update: `${app_base_url}/profile`,
    destroy: `${app_base_url}/profile`,
  },

  user: {
    index: `${app_base_url}/user`,
    store: `${app_base_url}/user`,
    show: (userId: string) => `${app_base_url}/user/${userId}`,
    update: (userId: string) => `${app_base_url}/user/${userId}`,
    destroy: (userId: string) => `${app_base_url}/user/${userId}`,
    ban: (userId: string) => `${app_base_url}/user/${userId}/ban`,
    follow: (userId: string) => `${app_base_url}/users/${userId}/follow`,
    unfollow: (userId: string) => `${app_base_url}/users/${userId}/follow`,
    followers: (userId: string) => `${app_base_url}/users/${userId}/followers`,
    following: (userId: string) => `${app_base_url}/users/${userId}/following`,
    stats: (userId: string) => `${app_base_url}/users/${userId}/stats`,
    
    updateRole: (userId: string) => `${app_base_url}/admin/users/${userId}/role`,
    disable: (userId: string) => `${app_base_url}/admin/users/${userId}/disable`,
    enable: (userId: string) => `${app_base_url}/admin/users/${userId}/enable`,
    dashboard:  `${app_base_url}/admin/stats`,
  },

  sanctum: {
    csrfCookie: `${app_base_url}/../sanctum/csrf-cookie`,
  },

  test: `${app_base_url}/test`,
};
