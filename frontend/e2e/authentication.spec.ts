import { test, expect } from '@playwright/test';

function generateRandomEmail() {
  return `test-${Math.random()}@example.com`;
}

const randomEmail = generateRandomEmail();

test('inscription', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Vérifier que la homepage est chargée
  await expect(page.getByRole('heading', { name: 'Le site magique pour ne plus se prendre la tête pour les cadeaux communs.', level: 1 })).toBeVisible();

  // Inscription
  await page.getByRole('link', { name: 'Inscription' }).click();
  await expect(page.getByRole('heading', { name: 'Créer mon compte', level: 2 })).toBeVisible();

  // Remplir le formulaire d'inscription
  await page.getByTestId('lastNameRegister').fill('Doe');
  await page.getByTestId('firstNameRegister').fill('John');
  await page.getByTestId('emailRegister').fill(randomEmail);
  await page.getByTestId('birthdayRegister').fill('1990-01-01');
  await page.getByTestId('passwordRegister').fill('Unmdp123!');
  await page.getByTestId('passwordConfirmRegister').fill('Unmdp123!');
  await page.getByTestId('buttonRegister').click();

  // Vérifier que l'utilisateur est redirigé vers le dashboard
    await expect(page.getByRole('heading', { name: 'Mes groupes', level: 2 })).toBeVisible();
    await expect(page.getByText('Aucun groupe de discussion')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer un groupe' })).toBeVisible();

    // Accéder au profil
    await page.getByTestId('[object Object]').nth(2).click();
    await expect(page.getByRole('heading', { name: 'Mon profil', level: 1 })).toBeVisible();

    // Modifier le profil
    const btnModifier = page.getByRole('button', { name: 'Modifier mes infos' });
    await btnModifier.scrollIntoViewIfNeeded();
    await btnModifier.click();

    // Remplir le formulaire de modification
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('email').fill('jane.doe@example.com');
    await page.getByTestId('phoneNumber').fill('1234567890');
    await page.getByTestId('birthday').fill('1990-01-01');

    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Profil mis à jour avec succès !')).toBeVisible();

    // Supprimer le profil
    const btnSupprimer = page.getByRole('button', { name: 'Supprimer mon profil' });
    await btnSupprimer.scrollIntoViewIfNeeded();
    await btnSupprimer.click();

    // Vérifier que le modal de suppression est ouvert
    await expect(page.getByTestId('modal-delete-profile')).toBeVisible();
    await page.getByRole('button', { name: 'Confirmer' }).click();
    

    // Vérifier que l'utilisateur est déconnecté
    await expect(page.getByText('Votre profil a bien été supprimé.')).toBeVisible();
    await expect(page.url()).toBe('http://localhost:3000/');
    await expect(page.getByRole('link', { name: 'Connexion' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inscription' })).toBeVisible();

});

