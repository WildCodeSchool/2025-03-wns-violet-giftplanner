import argon2 from "argon2";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import Users from "../entities/Users";
import cookieManager from "../lib/cookiManager/cookiManager";
import type { ContextType } from "../types/context";
import { createAndSetToken } from "../utils/jwtUtils";

@InputType()
class SignupInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  date_of_birth!: string;
}

@InputType()
class UpdateMyProfileInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  date_of_birth!: string;

  @Field()
  phone_number!: string;
}

@InputType()
class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@Resolver(Users)
export default class UserResolver {
  @Query(() => [Users])
  async getAllUsers() {
    //récupère tout les utilisateurs
    const allUsers = Users.find();

    // renvoir tous les utilisateurs
    return allUsers;
  }

  @Query(() => [Users])
  async getAllUsersAdmin() {
    //récupère tout les utilisateurs
    const allUsers = Users.find({ where: { isAdmin: true } });

    // renvoir tous les utilisateurs
    return allUsers;
  }

  @Query(() => Users)
  async getMeProfile(@Ctx() ctx: ContextType) {
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    //récupère le profil de l'utilisateur connecté
    const user = await Users.findOne({ where: { id: ctx.user.id } });

    // si l'utilisateur a été supprimé (ou inexistant)
    if (!user) throw new Error("Utilisateur supprimé");

    return user as Users;
  }

  @Mutation(() => Users)
  async signup(@Arg("data") data: SignupInput, @Ctx() ctx: ContextType) {
    if (!data.firstName.trim()) throw new Error("Le prénom est obligatoire");
    if (!data.lastName.trim()) throw new Error("Le nom est obligatoire");
    if (!data.date_of_birth.trim()) throw new Error("La date de naissance est obligatoire");
    if (!data.email.trim()) throw new Error("L'email est obligatoire");
    if (!data.password.trim()) throw new Error("Le mot de passe est obligatoire");

    // verifie la validité des données
    const emailRegex =
      /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"[^"]*")@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Adresse email invalide");
    }

    // Vérif mot de passe minimal
    if (data.password.length < 6) {
      throw new Error("Mot de passe trop court");
    }

    if (data.password.length > 100) {
      throw new Error("Mot de passe trop long");
    }

    // hash le mot de passe
    const password_hashed = await argon2.hash(data.password);

    // crée le nouvel utilisateur
    const user = Users.create({ ...data, password_hashed });
    //sauvegarde le nouvel utilisateur dans la bdd
    await user.save();

    // Crée le token & set le cookie
    const payload = { id: user.id, isAdmin: user.isAdmin };
    createAndSetToken(ctx, payload);

    // return le token;
    return user;
  }

  @Mutation(() => Users)
  async login(@Arg("data") data: LoginInput, @Ctx() ctx: ContextType) {
    // essaye de trouver l'utilisateur grace a son mail
    const user = await Users.findOne({ where: { email: data.email } });

    if (!user) throw new Error("Utilisateur introuvable");

    // verifie que le mot de passe est correct (compar le claire avec le hash)
    const isValid = await argon2.verify(user.password_hashed, data.password);
    // en cas d'erreur ca crash
    if (!isValid) throw new Error("mot de passe incorrect");

    // Crée le token & set le cookie
    const payload = { id: user.id, isAdmin: user.isAdmin };
    createAndSetToken(ctx, payload);

    // return le token
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: ContextType) {
    // set le cookie vide pour déconnecter l'utilisateur
    cookieManager.delCookie(ctx, "token", { secure: false });

    // return un boolean de succès
    return true;
  }

  @Mutation(() => Users)
  async UpdateMyProfile(@Arg("data") data: UpdateMyProfileInput, @Ctx() ctx: ContextType) {
    if (!ctx.user) throw new Error("Utilisateur non connecté update impossible");

    // hash le mot de passe
    const password_hashed = await argon2.hash(data.password);

    // modifie l'utilisateur connecté
    await Users.update({ id: ctx.user.id }, { ...data, password_hashed });

    //récupère le profil de l'utilisateur connecté
    const user = await Users.findOne({ where: { id: ctx.user.id } });

    return user as Users;
  }
}
