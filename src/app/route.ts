export const routes = {
  login: '/',
  admin: {
    dashboard: '/admin',
    users: {
      index: '/admin/users',
      edit: (userId: string) => `/admin/users/${userId}`,
    },
    forums: {
      index: '/admin/forums',
      edit: (forumId: string) => `/admin/forums/${forumId}`,
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