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
    search: `${app_base_url}/book/search`,
    show: (bookId: string) => `${app_base_url}/book/${bookId}`,
    update: (bookId: string) => `${app_base_url}/book/${bookId}`,
    destroy: (bookId: string) => `${app_base_url}/book/${bookId}`,
    verify: (bookId: string) => `${app_base_url}/book/${bookId}/verify`,
  },
  challenge: {
    index: `${app_base_url}/challenge`,
    store: `${app_base_url}/challenge`,
    show: (challengeId: string) => `${app_base_url}/challenge/${challengeId}`,
    update: (challengeId: string) => `${app_base_url}/challenge/${challengeId}`,
    destroy: (challengeId: string) => `${app_base_url}/challenge/${challengeId}`,
  },
  event: {
    index: `${app_base_url}/event`,
    store: `${app_base_url}/event`,
    show: (eventId: string) => `${app_base_url}/event/${eventId}`,
    update: (eventId: string) => `${app_base_url}/event/${eventId}`,
    destroy: (eventId: string) => `${app_base_url}/event/${eventId}`,
  },
  forum: {
    index: `${app_base_url}/forum`,
    store: `${app_base_url}/forum`,
    show: (forumId: string) => `${app_base_url}/forum/${forumId}`,
    update: (forumId: string) => `${app_base_url}/forum/${forumId}`,
    destroy: (forumId: string) => `${app_base_url}/forum/${forumId}`,
    threads: {
      index: (forumId: string) => `${app_base_url}/forum/${forumId}/threads`,
      store: (forumId: string) => `${app_base_url}/forum/${forumId}/threads`,
    },
  },
  mention: {
    index: `${app_base_url}/mention`,
    store: `${app_base_url}/mention`,
    show: (mentionId: string) => `${app_base_url}/mention/${mentionId}`,
    update: (mentionId: string) => `${app_base_url}/mention/${mentionId}`,
    destroy: (mentionId: string) => `${app_base_url}/mention/${mentionId}`,
  },
  notification: {
    index: `${app_base_url}/notification`,
    store: `${app_base_url}/notification`,
    show: (notificationId: string) => `${app_base_url}/notification/${notificationId}`,
    update: (notificationId: string) => `${app_base_url}/notification/${notificationId}`,
    destroy: (notificationId: string) => `${app_base_url}/notification/${notificationId}`,
  },
  post: {
    index: `${app_base_url}/post`,
    store: `${app_base_url}/post`,
    show: (postId: string) => `${app_base_url}/post/${postId}`,
    update: (postId: string) => `${app_base_url}/post/${postId}`,
    destroy: (postId: string) => `${app_base_url}/post/${postId}`,
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
  },
  sanctum: {
    csrfCookie: `${app_base_url}/../sanctum/csrf-cookie`,
  },
  test: `${app_base_url}/test`,
};