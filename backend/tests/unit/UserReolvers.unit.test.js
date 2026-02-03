"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserResolver_1 = __importDefault(require("../../src/resolvers/UserResolver"));
const User_1 = __importDefault(require("../../src/entities/User"));
describe("UserResolver test unitaire", () => {
    describe("getAllUsers", () => {
        test("renvoie tous les utilisateurs existants", () => __awaiter(void 0, void 0, void 0, function* () {
            // constrie les fausses données
            const fakeUsers = [{ id: 1, firstName: "Alice" }, { id: 2, firstName: "Bob" }];
            // simule la reponse de la bdd avec les fausses données
            jest.spyOn(User_1.default, "find").mockResolvedValue(fakeUsers);
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            // appelle la méthode getAllUsers
            const result = yield resolver.getAllUsers();
            // vérifie que le résultat coorrespond aux fausses données
            expect(result).toEqual(fakeUsers);
            // verifie que la fausse méthode a été appelée une fois
            expect(User_1.default.find).toHaveBeenCalledTimes(1);
        }));
        test("renvoie un tableau vide si aucun utilisateur", () => __awaiter(void 0, void 0, void 0, function* () {
            // simule la reponse de la bdd avec un tableau vide
            jest.spyOn(User_1.default, "find").mockResolvedValue([]);
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            const result = yield resolver.getAllUsers();
            // vérifie que le résultat est un tableau vide
            expect(result).toEqual([]);
        }));
        test("propage une erreur si la DB échoue", () => __awaiter(void 0, void 0, void 0, function* () {
            // simule une erreur de la bdd
            jest.spyOn(User_1.default, "find").mockRejectedValue(new Error("DB down"));
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            // vérifie que le resolver a la bonne erreur
            yield expect(resolver.getAllUsers()).rejects.toThrow("DB down");
        }));
        test("renvoie des utilisateurs avec les bons champs", () => __awaiter(void 0, void 0, void 0, function* () {
            // constrie les fausses données
            const fakeUsers = [{ id: 50, firstName: "toto" }];
            jest.spyOn(User_1.default, "find").mockResolvedValue(fakeUsers);
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            const [user] = yield resolver.getAllUsers();
            // vérifie que le résultat a les bons champs
            expect(user).toHaveProperty("id", 50);
            expect(user).toHaveProperty("firstName", "toto");
        }));
    });
    describe.skip("signup", () => {
        test("crée un utilisateur avec des données valides", () => __awaiter(void 0, void 0, void 0, function* () {
            // simule la création et la sauvegarde d'un utilisateur
            const saveMock = jest.fn().mockResolvedValue(true);
            jest.spyOn(User_1.default, "create").mockReturnValue({ id: 1, isAdmin: false, save: saveMock });
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            // appelle la méthode signup avec des données valides
            const isReussi = yield resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "Alice@gmauil.com",
                password: "securePassword",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } });
            // vérifie que qu'il a bien un booléen en retour
            expect(isReussi).toBe(true);
            expect(typeof isReussi).toBe("boolean");
            // vérifie que la méthode save a été appelée
            expect(saveMock).toHaveBeenCalledTimes(1);
        }));
        test("rejette les emails invalides", () => __awaiter(void 0, void 0, void 0, function* () {
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            // vérifie que les emails invalides sont rejetés
            yield expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "invalid-email",
                password: "securePassword",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } })).rejects.toThrow("Adresse email invalide");
            yield expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "alice@.com",
                password: "securePassword",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } })).rejects.toThrow("Adresse email invalide");
        }));
        test("rejette les mots de passe trop courts", () => __awaiter(void 0, void 0, void 0, function* () {
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            // vérifie que les mots de passe trop courts sont rejetés
            yield expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "Alice@gmail.com",
                password: "123",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } })).rejects.toThrow("Mot de passe trop court");
        }));
        test("rejette les mots de passe trop longs", () => __awaiter(void 0, void 0, void 0, function* () {
            // crée une instance du resolver
            const resolver = new UserResolver_1.default();
            const longPassword = "a".repeat(101);
            // vérifie que les mots de passe trop longs sont rejetés
            yield expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "Alice@gmail.com",
                password: longPassword,
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } })).rejects.toThrow("Mot de passe trop long");
        }));
    });
});
