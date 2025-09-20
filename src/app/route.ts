export const routes = {
  test: '/test',
  login: '/',
  admin: {
    dashboard: '/admin',
    users: {
      index: '/admin/users',
      edit: (userId: string) => `/admin/users/${userId}`,
    },
    books: {
      index: '/admin/books',
      create: '/admin/books/create',
      edit: (bookId: string) => `/admin/books/${bookId}`,
    },
    forums: {
      index: '/admin/forums',
      create: '/admin/forums/create',
      edit: (forumId: string) => `/admin/forums/edit/${forumId}`,
      get: (forumId: string) => `/admin/forums/${forumId}`,
      members: (forumId: string) => `/admin/forums/${forumId}/members`,
      threads: {
        index: (forumId: string) => `/admin/forums/${forumId}/threads`,
        create: (forumId: string) => `/admin/forums/${forumId}/threads/create`,
        show: (threadID: string) => `/admin/forums/threads/${threadID}`,
        edit: (forumId: string, threadId: string) => `/admin/forums/${forumId}/threads/${threadId}`,
       
      },
    },
    posts: {
      reported: '/admin/reported-posts',
      activityFeed: '/admin/activity-feed',
    },
    events: {
      index: '/admin/events',
      edit: (eventId: string) => `/admin/events/${eventId}`,
    },
    challenges: {
      index: '/admin/challenges',
      edit: (challengeId: string) => `/admin/challenges/${challengeId}/edit`,
      create: '/admin/challenges/create',
      view: (challengeId: string) => `/admin/challenges/${challengeId}`,
      participants: (challengeId: string) => `/admin/challenges/${challengeId}/participants`,
      books: (challengeId: string) => `/admin/challenges/${challengeId}/books`,
      badges: '/admin/challenges/badges',
    },
    moderation: '/admin/moderation',
  },
};