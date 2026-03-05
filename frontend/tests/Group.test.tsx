/// <reference types="@testing-library/jest-dom" />
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { fakeGroups, fakeMessages, emptyGroups, emptyMessages } from './fixtures/groupFixtures'

const mocks = vi.hoisted(() => {
  const mockCreateGroup = vi.fn().mockResolvedValue({ data: { createGroup: { id: 99 } } })
  const mockUpdateGroup = vi.fn()
  const mockDeleteGroup = vi.fn()
  const mockRemoveMembers = vi.fn()
  const groupByIdResult = { data: null as any, loading: false, error: undefined as any }

  return {
    mockCreateGroup,
    mockUpdateGroup,
    mockDeleteGroup,
    mockRemoveMembers,
    createGroupResult: [mockCreateGroup] as const,
    deleteGroupResult: [mockDeleteGroup] as const,
    removeMembersResult: [mockRemoveMembers] as const,
    updateGroupResult: [mockUpdateGroup] as const,
    groupByIdResult,
    profileState: { userProfile: null as any, setUserProfile: vi.fn(), clearUserProfile: vi.fn() },
  }
})

vi.mock('../src/graphql/generated/graphql-types', () => ({
  useCreateGroupMutation: () => mocks.createGroupResult,
  useDeleteGroupMutation: () => mocks.deleteGroupResult,
  useGetGroupByIdQuery: () => mocks.groupByIdResult,
  useRemoveMembersFromGroupMutation: () => mocks.removeMembersResult,
  useUpdateGroupMutation: () => mocks.updateGroupResult,
}))

vi.mock('../src/zustand/myProfileStore', () => ({
  useMyProfileStore: (selector?: (state: any) => any) => {
    return selector ? selector(mocks.profileState) : mocks.profileState
  },
}))

import Groups from '../src/components/groups/Groups'
import GroupFormindex from '../src/components/forms/groups/index'

const defaultProps = {
  groups: fakeGroups,
  setActiveGroup: vi.fn(),
  loading: false,
  messages: fakeMessages,
  getNbNewMessages: vi.fn().mockReturnValue(0),
  updateLastVu: vi.fn(),
}

describe('Créer un groupe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("l'utilisateur clique sur le bouton 'Ajouter un groupe', la modale s'ouvre et le formulaire s'affiche", async () => {
    const user = userEvent.setup()
    render(<Groups {...defaultProps} />)

    await user.click(screen.getByText('Ajouter un groupe'))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    const dialog = screen.getByRole('dialog')

    expect(within(dialog).getByTestId('create-group-form')).toBeInTheDocument()
    expect(within(dialog).getByTestId('name-input')).toBeInTheDocument()
    expect(within(dialog).getByTestId('event-type-select')).toBeInTheDocument()
    expect(within(dialog).getByTestId('piggy-bank-input')).toBeInTheDocument()
    expect(within(dialog).getByTestId('users-input')).toBeInTheDocument()
    expect(within(dialog).getByTestId('submit-create-group-button')).toBeInTheDocument()
    expect(within(dialog).getByTestId('cancel-button')).toBeInTheDocument()
  })

  test("l'utilisateur peut quitter le formulaire via le bouton 'Annuler'", async () => {
    const user = userEvent.setup()
    render(<Groups {...defaultProps} />)

    await user.click(screen.getByTestId('create-group-button'))
    await waitFor(() => {
      expect(screen.getByTestId('create-group-modal')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('cancel-button'))

    await waitFor(() => {
      expect(screen.queryByTestId('create-group-modal')).not.toBeInTheDocument()
    })
    expect(mocks.mockCreateGroup).not.toHaveBeenCalled()
    // expect(defaultProps.onCancel).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.queryByTestId('create-group-modal')).not.toBeInTheDocument()
    })
  })

  test("l'utilisateur peut quitter le formulaire via un clic sur l'overlay", async () => {
    const user = userEvent.setup()
    render(<Groups {...defaultProps} />)

    await user.click(screen.getByTestId('create-group-button'))
    await waitFor(() => {
      expect(screen.getByTestId('create-group-modal')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('create-group-modal'))

    await waitFor(() => {
      expect(screen.queryByTestId('create-group-modal')).not.toBeInTheDocument()
    })
    expect(mocks.mockCreateGroup).not.toHaveBeenCalled()
  })

  test("l'utilisateur peut soumettre le formulaire et créer un groupe", async () => {
    const user = userEvent.setup()
    render(<Groups {...defaultProps} />)
    await user.click(screen.getByTestId('create-group-button'))
    await waitFor(() => {
      expect(screen.getByTestId('create-group-modal')).toBeInTheDocument()
    })

    await user.type(screen.getByTestId('name-input'), 'Anniversaire de Julie')

    // SearchSelectInput: click to open dropdown, then click the option
    await user.click(screen.getByText("Quel est l'événement ?"))
    await user.click(screen.getByRole('option', { name: 'Anniversaire' }))

    await user.clear(screen.getByTestId('piggy-bank-input'))
    await user.type(screen.getByTestId('piggy-bank-input'), '100')

    await user.click(screen.getByTestId('toggle-switch'))
    await user.type(screen.getByTestId('toggle-beneficiary-input'), 'julie@gmail.com')

    await user.type(screen.getByTestId('deadline-input'), '2030-01-01')

    await user.type(screen.getByTestId('users-input'), 'alice@gmail.com')
    await user.keyboard('{Enter}')
    await user.type(screen.getByTestId('users-input'), 'bob@gmail.com')
    await user.keyboard('{Enter}')
    await user.type(screen.getByTestId('users-input'), 'charlie@gmail.com')
    await user.keyboard('{Enter}')

    await user.click(screen.getByTestId('submit-create-group-button'))

    await waitFor(() => {
      expect(mocks.mockCreateGroup).toHaveBeenCalledWith({
        variables: {
          data: expect.objectContaining({
            name: 'Anniversaire de Julie',
            event_type: 'Anniversaire',
            piggy_bank: 100,
            deadline: expect.any(Date),
            user_beneficiary: 'julie@gmail.com',
            users: ['alice@gmail.com', 'bob@gmail.com', 'charlie@gmail.com'],
          }),
        },
      })
    })

    // expect(screen.getByText('Anniversaire de Julie')).toBeInTheDocument()
  })

  test("affiche un message d'erreur si le formulaire est invalide", async () => {
    const user = userEvent.setup()
    render(<Groups {...defaultProps} />)
    await user.click(screen.getByTestId('create-group-button'))
    await waitFor(() => {
      expect(screen.getByTestId('create-group-modal')).toBeInTheDocument()
    })

    // Typing a short name triggers validation on all required fields
    await user.type(screen.getByTestId('name-input'), 'ab')

    const nameError = screen.getByText('Le nom du groupe doit faire au moins 6 charactères de long')
    const eventError = screen.getByText("Veuillez-sélectionner le type d'évènement")
    const deadlineError = screen.getByText("La date butoire de l'évènement est requise")

    expect(nameError).toBeInTheDocument()
    expect(nameError).toHaveClass('text-orange')
    expect(eventError).toBeInTheDocument()
    expect(eventError).toHaveClass('text-orange')
    expect(deadlineError).toBeInTheDocument()
    expect(deadlineError).toHaveClass('text-orange')

    await user.click(screen.getByTestId('submit-create-group-button'))
    expect(mocks.mockCreateGroup).not.toHaveBeenCalled()
  })
})

describe('Modifier un groupe', () => {
  const editGroupData = {
    getGroupById: {
      id: 1,
      name: 'Fête de Julie',
      event_type: 'Anniversaire',
      piggy_bank: 50,
      deadline: '2030-06-15T00:00:00.000Z',
      user_beneficiary: null,
      user_admin: { id: '1' },
      groupMember: [
        { user: { id: '1', email: 'admin@test.com' } },
        { user: { id: '2', email: 'member@test.com' } },
        { user: { id: '3', email: 'alice@test.com' } },
      ],
    },
  }

  const adminProfile = { id: '1', email: 'admin@test.com' }
  const memberProfile = { id: '2', email: 'member@test.com' }
  const onSuccess = vi.fn()
  const onCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.groupByIdResult.data = editGroupData
    mocks.groupByIdResult.loading = false
    mocks.groupByIdResult.error = undefined
  })

  afterEach(() => {
    mocks.profileState.userProfile = null
    mocks.groupByIdResult.data = null
  })

  test("l'admin du groupe peut modifier le groupe", async () => {
    mocks.profileState.userProfile = adminProfile
    const user = userEvent.setup()
    render(<GroupFormindex groupId={1} onSuccess={onSuccess} onCancel={onCancel} />)

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Fête de Julie')
    })

    await user.clear(screen.getByTestId('name-input'))
    await user.type(screen.getByTestId('name-input'), 'Anniversaire de Julie')

    await user.click(screen.getByTestId('edit-group-button'))

    await waitFor(() => {
      expect(mocks.mockUpdateGroup).toHaveBeenCalledWith({
        variables: {
          data: expect.objectContaining({
            name: 'Anniversaire de Julie',
          }),
          updateGroupId: 1,
        },
      })
    })
  })

  test("l'admin du groupe peut ajouter des participants au groupe", async () => {
    mocks.profileState.userProfile = adminProfile
    const user = userEvent.setup()
    render(<GroupFormindex groupId={1} onSuccess={onSuccess} onCancel={onCancel} />)

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Fête de Julie')
    })

    await user.type(screen.getByTestId('users-input'), 'newmember@test.com')
    await user.keyboard('{Enter}')

    await user.click(screen.getByTestId('edit-group-button'))

    await waitFor(() => {
      expect(mocks.mockUpdateGroup).toHaveBeenCalledWith({
        variables: {
          data: expect.objectContaining({
            users: expect.arrayContaining(['newmember@test.com']),
          }),
          updateGroupId: 1,
        },
      })
    })
  })

  test("l'admin du groupe peut supprimer des participants du groupe", async () => {
    mocks.profileState.userProfile = adminProfile
    const user = userEvent.setup()
    render(<GroupFormindex groupId={1} onSuccess={onSuccess} onCancel={onCancel} />)

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    })

    const aliceTag = screen.getByText('alice@test.com').closest('div')!
    await user.click(within(aliceTag).getByRole('button'))

    await user.click(screen.getByTestId('edit-group-button'))

    await waitFor(() => {
      expect(mocks.mockUpdateGroup).toHaveBeenCalled()
      expect(mocks.mockRemoveMembers).toHaveBeenCalledWith({
        variables: {
          groupId: 1,
          data: { userEmails: ['alice@test.com'] },
        },
      })
    })
  })

  test("un utilisateur du groupe non admin ne peut pas modifier le groupe", async () => {
    mocks.profileState.userProfile = memberProfile
    render(<GroupFormindex groupId={1} onSuccess={onSuccess} onCancel={onCancel} />)

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Fête de Julie')
    })

    expect(screen.getByTestId('name-input')).toBeDisabled()
    expect(screen.getByTestId('piggy-bank-input')).toBeDisabled()
    expect(screen.getByTestId('deadline-input')).toBeDisabled()
    expect(screen.queryByTestId('edit-group-button')).not.toBeInTheDocument()
  })

  test("un utilisateur du groupe non admin ne peut pas supprimer des participants du groupe", async () => {
    mocks.profileState.userProfile = memberProfile
    render(<GroupFormindex groupId={1} onSuccess={onSuccess} onCancel={onCancel} />)

    await waitFor(() => {
      expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    })

    expect(screen.getByTestId('users-input')).toBeDisabled()

    const aliceTag = screen.getByText('alice@test.com').closest('div')!
    expect(within(aliceTag).getByRole('button')).toBeDisabled()
  })

  test("l'utilisateur peut quitter le groupe", async () => {
    mocks.profileState.userProfile = memberProfile
    const user = userEvent.setup()
    render(<GroupFormindex groupId={1} onSuccess={onSuccess} onCancel={onCancel} />)

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Fête de Julie')
    })

    await user.click(screen.getAllByRole('button', { name: 'Quitter' })[0])

    await waitFor(() => {
      expect(mocks.mockRemoveMembers).toHaveBeenCalledWith({
        variables: {
          groupId: 1,
          data: { userIds: [2] },
        },
      })
    })
  })

  test("l'admin du groupe peut supprimer le groupe", async () => {
    mocks.profileState.userProfile = adminProfile
    const user = userEvent.setup()
    render(<GroupFormindex groupId={1} onSuccess={onSuccess} onCancel={onCancel} />)

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Fête de Julie')
    })

    await user.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])

    await waitFor(() => {
      expect(mocks.mockDeleteGroup).toHaveBeenCalledWith({
        variables: { deleteGroupId: 1 },
      })
    })
  })
})

describe('Affichage des groupes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('affiche les groupes existants avec leurs informations', () => {
    render(<Groups {...defaultProps} />)

    expect(screen.getByText('Anniversaire de Julie')).toBeInTheDocument()
    expect(screen.getByText('Noël en famille')).toBeInTheDocument()
    expect(screen.getByText(/2 participants/)).toBeInTheDocument()
    expect(screen.getByText(/3 participants/)).toBeInTheDocument()
  })

  test('affiche un indicateur de chargement', () => {
    render(<Groups {...defaultProps} loading={true} />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test("affiche un message d'erreur", () => {
    render(<Groups {...defaultProps} error="Impossible de charger les groupes" />)

    expect(screen.getByText('Error: Impossible de charger les groupes')).toBeInTheDocument()
  })
})

describe('Interaction avec les groupes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('cliquer sur un groupe appelle setActiveGroup et updateLastVu', async () => {
    const setActiveGroup = vi.fn()
    const updateLastVu = vi.fn()
    const user = userEvent.setup()

    render(
      <Groups
        {...defaultProps}
        setActiveGroup={setActiveGroup}
        updateLastVu={updateLastVu}
      />
    )

    await user.click(screen.getByText('Anniversaire de Julie'))

    expect(setActiveGroup).toHaveBeenCalledWith(fakeGroups.groups[0])
    expect(updateLastVu).toHaveBeenCalledWith(1, fakeMessages[1][0].createdAt)
  })

  test('le groupe actif est visuellement distingué', () => {
    render(<Groups {...defaultProps} activeGroupId={1} />)

    const activeCard = screen.getByText('Anniversaire de Julie').closest('button')
    expect(activeCard).toHaveClass('bg-[#CECFEB]')
  })
})
