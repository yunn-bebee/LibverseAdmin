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
      threads: {
        index: (forumId: string) => `/admin/forums/${forumId}/threads`,
        create: (forumId: string) => `/admin/forums/${forumId}/threads/create`,
        show: (threadID: string) => `/admin/forums/threads/${threadID}`,
        edit: (forumId: string, threadId: string) => `/admin/forums/${forumId}/threads/${threadId}`,
       
      },
    },
    events: {
      index: '/admin/events',
      edit: (eventId: string) => `/admin/events/${eventId}`,
    },
    challenges: {
      index: '/admin/challenges',
      edit: (challengeId: string) => `/admin/challenges/ ${challengeId}`,
      create: '/admin/challenges/create',
      view: (challengeId: string) => `/admin/challenges/view/${challengeId}`,
    },
    moderation: '/admin/moderation',
  },
};