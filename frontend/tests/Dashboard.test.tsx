/// <reference types="@testing-library/jest-dom" />
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import LoginForm from '../src/components/forms/auth/LoginForm'
import RegisterForm from '../src/components/forms/auth/RegisterForm'
import React from 'react'

describe('Affichage des éléments dans le Dashboard', () => {
    test("Si aucun groupe n'existe, la page de placeholder s'affiche", () => {})
    test("Si je fait partie des groupes, les groupes s'affichent", () => {})
    test("Si je fait partie des groupes, les groupes s'affichent", () => {})
})

