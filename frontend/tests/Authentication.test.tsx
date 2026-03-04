/// <reference types="@testing-library/jest-dom" />
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import LoginForm from '../src/components/forms/auth/LoginForm'
import RegisterForm from '../src/components/forms/auth/RegisterForm'
import React from 'react'

const { mockNavigate, mockLogin, mockSetUserProfile, mockRegister } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockLogin: vi.fn(),
  mockRegister: vi.fn(),
  mockSetUserProfile: vi.fn(),
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../src/graphql/generated/graphql-types', () => ({
  useLoginMutation: () => [mockLogin],
  useSignupMutation: () => [mockRegister],
}))

vi.mock('../src/zustand/myProfileStore', () => ({
  useMyProfileStore: () => ({ setUserProfile: mockSetUserProfile }),
}))

vi.mock('../src/hooks/erreurMod', () => ({ default: vi.fn() }))

const renderLoginForm = () => render(<LoginForm />, { wrapper: MemoryRouter })
const renderRegisterForm = () => render(<RegisterForm />, { wrapper: MemoryRouter })

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('affiche les champs email, mot de passe et le bouton connexion', () => {
    renderLoginForm()
    expect(screen.getByTestId('emailLogin')).toBeInTheDocument()
    expect(screen.getByTestId('passwordLogin')).toBeInTheDocument()
    expect(screen.getByTestId('buttonLogin')).toBeInTheDocument()
  })

  test("l'utilisateur peut remplir le formulaire et se connecter", async () => {
    mockLogin.mockResolvedValue({ data: { login: { id: '1', email: 'chloe@gmail.com' } } })
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByTestId('emailLogin'), 'chloe@gmail.com')
    await user.type(screen.getByTestId('passwordLogin'), '123456')
    await user.click(screen.getByTestId('buttonLogin'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  test("affiche un message d'erreur si les identifiants sont incorrects", async () => {
    mockLogin.mockRejectedValue({
      graphQLErrors: [{ message: 'Utilisateur introuvable' }],
    })
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByTestId('emailLogin'), 'mauvais@email.com')
    await user.type(screen.getByTestId('passwordLogin'), 'mauvaismdp')
    await user.click(screen.getByTestId('buttonLogin'))

    await waitFor(() => {
      expect(screen.getByText('Utilisateur introuvable')).toBeInTheDocument()
    })
  })
})


describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('affiche les champs du formulaire', () => {
    renderRegisterForm()
    expect(screen.getByTestId('lastNameRegister')).toBeInTheDocument()
    expect(screen.getByTestId('firstNameRegister')).toBeInTheDocument()
    expect(screen.getByTestId('emailRegister')).toBeInTheDocument()
    expect(screen.getByTestId('birthdayRegister')).toBeInTheDocument()
    expect(screen.getByTestId('passwordRegister')).toBeInTheDocument()
    expect(screen.getByTestId('passwordConfirmRegister')).toBeInTheDocument()
  })

  test("l'utilisateur peut remplir le formulaire et s'inscrire'", async () => {
    mockRegister.mockResolvedValue({ data: { signup: { id: '1', email: 'chloe@gmail.com' } } })
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByTestId('lastNameRegister'), 'Chloe')
    await user.type(screen.getByTestId('firstNameRegister'), 'Bretnacher')
    await user.type(screen.getByTestId('emailRegister'), 'chloe@gmail.com')
    await user.type(screen.getByTestId('birthdayRegister'), '1997-06-26')
    await user.type(screen.getByTestId('passwordRegister'), '123456')
    await user.type(screen.getByTestId('passwordConfirmRegister'), '123456')
    await user.click(screen.getByTestId('buttonRegister'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  test("affiche un message d'erreur si les inputs ne sont pas remplis correctement", async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    // Champs obligatoires vides
    await user.click(screen.getByTestId('buttonRegister'))
    await waitFor(() => {
      expect(screen.getByText('Tous les champs obligatoires doivent être remplis')).toBeInTheDocument()
    })

    // Email invalide
    await user.type(screen.getByTestId('lastNameRegister'), 'Chloe')
    await user.type(screen.getByTestId('firstNameRegister'), 'Bretnacher')
    await user.type(screen.getByTestId('birthdayRegister'), '1997-06-26')
    await user.type(screen.getByTestId('emailRegister'), 'emailinvalide')
    await user.click(screen.getByTestId('buttonRegister'))
    await waitFor(() => {
      expect(screen.getByText('Adresse email invalide')).toBeInTheDocument()
    })

    // Mot de passe trop court
    await user.clear(screen.getByTestId('emailRegister'))
    await user.type(screen.getByTestId('emailRegister'), 'chloe@gmail.com')
    await user.type(screen.getByTestId('passwordRegister'), '123')
    await user.click(screen.getByTestId('buttonRegister'))
    await waitFor(() => {
      expect(screen.getByText('Mot de passe trop court')).toBeInTheDocument()
    })

    // Mots de passe ne correspondent pas
    await user.clear(screen.getByTestId('passwordRegister'))
    await user.type(screen.getByTestId('passwordRegister'), '123456')
    await user.type(screen.getByTestId('passwordConfirmRegister'), 'different')
    await user.click(screen.getByTestId('buttonRegister'))
    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument()
    })
  })

  test('tous les champs doivent être remplis', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.click(screen.getByTestId('buttonRegister'))

    await waitFor(() => {
      expect(screen.getByText('Tous les champs obligatoires doivent être remplis')).toBeInTheDocument()
    })

    expect(screen.getByTestId('lastNameRegister')).toHaveValue('')
    expect(screen.getByTestId('firstNameRegister')).toHaveValue('')
    expect(screen.getByTestId('emailRegister')).toHaveValue('')
    expect(screen.getByTestId('birthdayRegister')).toHaveValue('')
    expect(screen.getByTestId('passwordRegister')).toHaveValue('')
    expect(screen.getByTestId('passwordConfirmRegister')).toHaveValue('')
  })
})


