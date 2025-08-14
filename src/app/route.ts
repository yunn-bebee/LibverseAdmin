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
    },
    events: {
      index: '/admin/events',
      edit: (eventId: string) => `/admin/events/${eventId}`,
    },
    challenges: {
      index: '/admin/challenges',
      edit: (challengeId: string) => `/admin/challenges/${challengeId}`,
    },
    moderation: '/admin/moderation',
  },
};