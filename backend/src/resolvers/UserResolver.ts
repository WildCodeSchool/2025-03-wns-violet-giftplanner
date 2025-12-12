import argon2 from "argon2";
import axios from "axios";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { IsNull } from "typeorm";
import User from "../entities/User";
import cookieManager from "../lib/cookieManager/cookieManager";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
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

  @Field(() => String, { nullable: true })
  pictureBase64?: string;
}

@InputType()
class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
class DeleteUserResponse {
  @Field()
  success!: boolean;

  @Field()
  message!: string;
}

@ObjectType()
class BanUserResponse {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export default class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    //récupère tout les utilisateurs
    const allUsers = User.find({ where: { deletedAt: IsNull() } });
    // renvoir tous les utilisateurs
    return allUsers;
  }

  @Query(() => [User])
  async getAllUsersAdmin() {
    //récupère tout les utilisateurs
    const allUsers = User.find({ where: { isAdmin: true } });

    // renvoir tous les utilisateurs
    return allUsers;
  }

  @Query(() => User)
  async getMyProfile(@Ctx() ctx: ContextType) {
    if (!ctx.user) throw new Error("Utilisateur non connecté");
    const user = await User.findOne({
      where: {
        id: ctx.user.id,
        deletedAt: IsNull(),
      },
      relations: ["lists"],
    });
    if (!user) {
      cookieManager.delCookie(ctx, "token", { secure: false });
      throw new Error("Utilisateur supprimé");
    }
    // Vérifier si l'utilisateur est banni
    if (user.isBanned) {
      cookieManager.delCookie(ctx, "token", { secure: false });
      throw new Error("Votre compte a été banni");
    }
    return user as User;
  }

  @Query(() => [User])
  @UseMiddleware(RoleMiddleware(true))
  async getAllUsersForAdmin(@Ctx() ctx: ContextType) {
    // Récupérer tous les utilisateurs (y compris les bannis, mais pas les supprimés)
    const allUsers = await User.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: "DESC" },
    });

    return allUsers;
  }

  @Mutation(() => User)
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
    const user = User.create({ ...data, password_hashed });
    //sauvegarde le nouvel utilisateur dans la bdd
    await user.save();

    // Crée le token & set le cookie
    const payload = { id: user.id, isAdmin: user.isAdmin };
    createAndSetToken(ctx, payload);

    // return le user;
    return user;
  }

  @Mutation(() => User)
  async login(@Arg("data") data: LoginInput, @Ctx() ctx: ContextType) {
    // essaye de trouver l'utilisateur grace a son mail
    const user = await User.findOne({ where: { email: data.email }, relations: ["lists"] });

    if (!user) throw new Error("Utilisateur introuvable");

    // Vérifier si l'utilisateur est supprimé (soft delete)
    if (user.deletedAt) {
      throw new Error("Ce compte a été supprimé");
    }

    // Vérifier si l'utilisateur est banni
    if (user.isBanned) {
      throw new Error("Votre compte a été banni. Vous ne pouvez pas vous connecter.");
    }

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

  @Mutation(() => User)
  async UpdateMyProfile(@Arg("data") data: UpdateMyProfileInput, @Ctx() ctx: ContextType) {
    if (!ctx.user) throw new Error("Utilisateur non connecté update impossible");

    let urlImage = null;
    if (data.pictureBase64) {
      try {
        urlImage = await axios.post("http://picture-service:3410/service/picture/uploads", {
          imageBase64: data.pictureBase64,
        });
      } catch (error) {
        throw new Error("Erreur lors de l'upload de l'image");
      }
    }

    // hash le mot de passe
    const password_hashed = await argon2.hash(data.password);
    const newData = {
      ...data,
      password_hashed,
      password: undefined,
      image_url: urlImage ? urlImage.data.url : undefined,
      pictureBase64: undefined,
    };

    // modifie l'utilisateur connecté
    await User.update({ id: ctx.user.id }, newData);

    //récupère le profil de l'utilisateur connecté
    const user = await User.findOne({ where: { id: ctx.user.id } });

    return user as User;
  }

  @Mutation(() => DeleteUserResponse)
  @UseMiddleware(RoleMiddleware(true))
  async deleteUser(@Arg("userId") userId: number, @Ctx() ctx: ContextType): Promise<DeleteUserResponse> {
    // RoleMiddleware protège déjà l'accès (utilisateur authentifié et admin)

    // Empêcher l'admin de se supprimer lui-même
    if (ctx.user!.id === userId) {
      return {
        success: false,
        message: "Vous ne pouvez pas vous supprimer vous-même",
      };
    }

    // Vérifier que l'utilisateur existe
    const userToDelete = await User.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });

    if (!userToDelete) {
      return {
        success: false,
        message: "Utilisateur introuvable ou déjà supprimé",
      };
    }

    // Soft delete : mettre à jour le champ deletedAt et modifier l'email pour permettre la réutilisation
    const deletedEmail = `${userToDelete.email}_deleted_${Date.now()}`;
    await User.update(
      { id: userId },
      {
        deletedAt: new Date(),
        email: deletedEmail,
      },
    );

    return {
      success: true,
      message: `Utilisateur ${userToDelete.firstName} ${userToDelete.lastName} supprimé avec succès`,
    };
  }

  @Mutation(() => BanUserResponse)
  @UseMiddleware(RoleMiddleware(true))
  async banUser(@Arg("userId") userId: number, @Ctx() ctx: ContextType): Promise<BanUserResponse> {
    // RoleMiddleware protège déjà l'accès (utilisateur authentifié et admin)

    // Empêcher l'admin de se bannir lui-même
    if (ctx.user!.id === userId) {
      return {
        success: false,
        message: "Vous ne pouvez pas vous bannir vous-même",
        user: undefined,
      };
    }

    // Vérifier que l'utilisateur existe
    const userToBan = await User.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });

    if (!userToBan) {
      return {
        success: false,
        message: "Utilisateur introuvable",
        user: undefined,
      };
    }

    // Vérifier s'il est déjà banni
    if (userToBan.isBanned) {
      return {
        success: false,
        message: "Cet utilisateur est déjà banni",
        user: userToBan,
      };
    }

    // Bannir l'utilisateur
    await User.update(
      { id: userId },
      {
        isBanned: true,
        bannedAt: new Date(),
      },
    );

    const bannedUser = (await User.findOne({ where: { id: userId } })) ?? undefined;

    return {
      success: true,
      message: `Utilisateur ${userToBan.firstName} ${userToBan.lastName} banni définitivement`,
      user: bannedUser,
    };
  }

  @Mutation(() => BanUserResponse)
  @UseMiddleware(RoleMiddleware(true))
  async unbanUser(@Arg("userId") userId: number, @Ctx() ctx: ContextType): Promise<BanUserResponse> {
    // RoleMiddleware protège déjà l'accès (utilisateur authentifié et admin)

    // Vérifier que l'utilisateur existe
    const userToUnban = await User.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });

    if (!userToUnban) {
      return {
        success: false,
        message: "Utilisateur introuvable",
        user: undefined,
      };
    }

    // Vérifier s'il n'est pas banni
    if (!userToUnban.isBanned) {
      return {
        success: false,
        message: "Cet utilisateur n'est pas banni",
        user: userToUnban,
      };
    }

    // Débannir l'utilisateur
    await User.update(
      { id: userId },
      {
        isBanned: false,
        bannedAt: undefined,
      },
    );

    const unbannedUser = (await User.findOne({ where: { id: userId } })) ?? undefined;

    return {
      success: true,
      message: `Utilisateur ${userToUnban.firstName} ${userToUnban.lastName} débanni avec succès`,
      user: unbannedUser,
    };
  }

  @Mutation(() => DeleteUserResponse)
  async deleteMyProfile(@Ctx() ctx: ContextType): Promise<DeleteUserResponse> {
    // Vérifier que l'utilisateur est connecté
    if (!ctx.user) {
      return {
        success: false,
        message: "Vous devez être connecté pour supprimer votre profil",
      };
    }

    // Récupérer l'utilisateur
    const user = await User.findOne({
      where: {
        id: ctx.user.id,
        deletedAt: IsNull(),
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Utilisateur introuvable ou déjà supprimé",
      };
    }

    // Soft delete : mettre à jour le champ deletedAt et modifier l'email pour permettre la réutilisation
    const deletedEmail = `${user.email}_deleted_${Date.now()}`;
    await User.update(
      { id: ctx.user.id },
      {
        deletedAt: new Date(),
        email: deletedEmail,
      },
    );

    // Supprimer le cookie de session
    cookieManager.delCookie(ctx, "token", { secure: false });

    return {
      success: true,
      message: "Votre profil a été supprimé avec succès",
    };
  }
}
