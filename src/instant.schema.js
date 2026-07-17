import { i } from '@instantdb/react'

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),

    profiles: i.entity({
      name: i.string(),
      university: i.string(),
      userId: i.string(),
      createdAt: i.date(),
    }),

    semesters: i.entity({
      name: i.string(),
      type: i.string(),
      year: i.string(),
      semesterGPA: i.number(),
      totalCredits: i.number(),
      userId: i.string(),
      createdAt: i.date(),
    }),

    subjects: i.entity({
      name: i.string(),
      credits: i.number(),
      grade: i.string(),
      gradePoint: i.number(),
      qualityPoint: i.number(),
      userId: i.string(),
      createdAt: i.date(),
    }),
  },

  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: '$users',
        has: 'one',
        label: 'linkedPrimaryUser',
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'linkedGuestUsers',
      },
    },

    profileUser: {
      forward: { on: 'profiles', has: 'one', label: '$user', onDelete: 'cascade' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },

    userSemesters: {
      forward: { on: 'semesters', has: 'one', label: '$user', onDelete: 'cascade' },
      reverse: { on: '$users', has: 'many', label: 'semesters' },
    },

    semesterSubjects: {
      forward: { on: 'subjects', has: 'one', label: 'semester', onDelete: 'cascade' },
      reverse: { on: 'semesters', has: 'many', label: 'subjects' },
    },
  },
})

export default _schema
