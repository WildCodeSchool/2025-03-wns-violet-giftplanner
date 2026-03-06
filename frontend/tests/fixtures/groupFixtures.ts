import type { GetAllMyGroupsQuery } from '../../src/graphql/generated/graphql-types'
import type { Message } from '../../src/types/Message'

export const fakeGroups: GetAllMyGroupsQuery['getAllMyGroups'] = {
  groupToken: 'fake-token-abc123',
  groups: [
    {
      id: '1',
      name: 'Anniversaire de Julie',
      createdAt: '2025-10-01T10:00:00.000Z',
      updatedAt: '2025-10-01T10:00:00.000Z',
      event_type: 'Anniversaire',
      piggy_bank: 50,
      deadline: '2025-12-25T00:00:00.000Z',
      groupMember: [
        {
          id: '10',
          userId: 1,
          groupId: 1,
          isGroupAdmin: true,
          joined_at: '2025-10-01T10:00:00.000Z',
          user: { firstName: 'Alice', lastName: 'Dupont', email: 'alice@test.com' },
        },
        {
          id: '11',
          userId: 2,
          groupId: 1,
          isGroupAdmin: false,
          joined_at: '2025-10-02T10:00:00.000Z',
          user: { firstName: 'Bob', lastName: 'Martin', email: 'bob@test.com' },
        },
      ],
      user_admin: {
        isAdmin: true,
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice@test.com',
      },
    },
    {
      id: '2',
      name: 'Noël en famille',
      createdAt: '2025-11-01T10:00:00.000Z',
      updatedAt: '2025-11-01T10:00:00.000Z',
      event_type: 'Noël',
      piggy_bank: 100,
      deadline: '2025-12-24T00:00:00.000Z',
      groupMember: [
        {
          id: '20',
          userId: 1,
          groupId: 2,
          isGroupAdmin: true,
          joined_at: '2025-11-01T10:00:00.000Z',
          user: { firstName: 'Alice', lastName: 'Dupont', email: 'alice@test.com' },
        },
        {
          id: '21',
          userId: 3,
          groupId: 2,
          isGroupAdmin: false,
          joined_at: '2025-11-02T10:00:00.000Z',
          user: { firstName: 'Clara', lastName: 'Leroy', email: 'clara@test.com' },
        },
        {
          id: '22',
          userId: 4,
          groupId: 2,
          isGroupAdmin: false,
          joined_at: '2025-11-03T10:00:00.000Z',
          user: { firstName: 'David', lastName: 'Moreau', email: 'david@test.com' },
        },
      ],
      user_admin: {
        isAdmin: true,
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice@test.com',
      },
    },
  ],
}

export const emptyGroups: GetAllMyGroupsQuery['getAllMyGroups'] = {
  groupToken: 'fake-token-empty',
  groups: [],
}

const now = new Date().toISOString()

export const fakeMessages: Record<number, Message[]> = {
  1: [
    {
      id: '100',
      content: 'Salut tout le monde !',
      createdAt: now,
      updatedAt: now,
      isEdited: false,
      user: { id: '1', firstName: 'Alice', lastName: 'Dupont', image_url: null, isAdmin: false },
    },
    {
      id: '101',
      content: 'On offre quoi à Julie ?',
      createdAt: now,
      updatedAt: now,
      isEdited: false,
      user: { id: '2', firstName: 'Bob', lastName: 'Martin', image_url: null, isAdmin: false },
    },
  ],
  2: [
    {
      id: '200',
      content: 'Joyeux Noël !',
      createdAt: now,
      updatedAt: now,
      isEdited: false,
      user: { id: '1', firstName: 'Alice', lastName: 'Dupont', image_url: null, isAdmin: false },
    },
  ],
}

export const emptyMessages: Record<number, Message[]> = {}
