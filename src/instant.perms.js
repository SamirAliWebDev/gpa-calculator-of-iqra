const rules = {
  $default: {
    allow: {
      $default: 'false',
    },
  },

  $users: {
    allow: {
      view: 'isSelf',
      update: 'isSelf',
    },
    bind: {
      isSelf: 'auth.id != null && auth.id == data.id',
    },
  },

  profiles: {
    allow: {
      view: 'isOwner',
      create: 'isOwner',
      update: 'isOwner',
    },
    bind: {
      isOwner: 'auth.id != null && auth.id == data.userId',
    },
  },

  semesters: {
    allow: {
      view: 'isOwner',
      create: 'isOwner',
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: {
      isOwner: 'auth.id != null && auth.id == data.userId',
    },
  },

  subjects: {
    allow: {
      view: 'isOwner',
      create: 'isOwner',
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: {
      isOwner: 'auth.id != null && auth.id == data.userId',
    },
  },

  attrs: {
    allow: {
      $default: 'false',
    },
  },
}

export default rules
