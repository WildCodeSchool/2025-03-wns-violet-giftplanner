import UserResolver from "../../src/resolvers/UserResolver";
import User from "../../src/entities/User";

describe("UserResolver test unitaire", () => {
    describe("getAllUsers", () => {
        test("renvoie tous les utilisateurs existants", async () => {
            // constrie les fausses données
            const fakeUsers = [{ id: 1, firstName: "Alice" }, { id: 2, firstName: "Bob" }] as User[];

            // simule la reponse de la bdd avec les fausses données
            jest.spyOn(User, "find").mockResolvedValue(fakeUsers);

            // crée une instance du resolver
            const resolver = new UserResolver();
            // appelle la méthode getAllUsers
            const result = await resolver.getAllUsers();

            // vérifie que le résultat coorrespond aux fausses données
            expect(result).toEqual(fakeUsers);
            // verifie que la fausse méthode a été appelée une fois
            expect(User.find).toHaveBeenCalledTimes(1);
        });

        test("renvoie un tableau vide si aucun utilisateur", async () => {
            // simule la reponse de la bdd avec un tableau vide
            jest.spyOn(User, "find").mockResolvedValue([]);

            // crée une instance du resolver
            const resolver = new UserResolver();
            const result = await resolver.getAllUsers();

            // vérifie que le résultat est un tableau vide
            expect(result).toEqual([]);
        });

        test("propage une erreur si la DB échoue", async () => {
            // simule une erreur de la bdd
            jest.spyOn(User, "find").mockRejectedValue(new Error("DB down"));

            // crée une instance du resolver
            const resolver = new UserResolver();
            // vérifie que le resolver a la bonne erreur
            await expect(resolver.getAllUsers()).rejects.toThrow("DB down");
        });

        test("renvoie des utilisateurs avec les bons champs", async () => {
            // constrie les fausses données
            const fakeUsers = [{ id: 50, firstName: "toto" }] as User[];
            jest.spyOn(User, "find").mockResolvedValue(fakeUsers);

            // crée une instance du resolver
            const resolver = new UserResolver();
            const [user] = await resolver.getAllUsers();

            // vérifie que le résultat a les bons champs
            expect(user).toHaveProperty("id", 50);
            expect(user).toHaveProperty("firstName", "toto");
        });
    });

    describe.skip("signup", () => {
        test("crée un utilisateur avec des données valides", async () => {
            // simule la création et la sauvegarde d'un utilisateur
            const saveMock = jest.fn().mockResolvedValue(true);
            jest.spyOn(User, "create").mockReturnValue({ id: 1, isAdmin: false, save: saveMock } as any);

            // crée une instance du resolver
            const resolver = new UserResolver();
            // appelle la méthode signup avec des données valides
            const isReussi = await resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "Alice@gmauil.com",
                password: "securePassword",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } } as any);

            // vérifie que qu'il a bien un booléen en retour
            expect(isReussi).toBe(true);
            expect(typeof isReussi).toBe("boolean");
            // vérifie que la méthode save a été appelée
            expect(saveMock).toHaveBeenCalledTimes(1);
        });

        test("rejette les emails invalides", async () => {
            // crée une instance du resolver
            const resolver = new UserResolver();
            // vérifie que les emails invalides sont rejetés
            await expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "invalid-email",
                password: "securePassword",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } } as any)).rejects.toThrow("Adresse email invalide");
            await expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "alice@.com",
                password: "securePassword",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } } as any)).rejects.toThrow("Adresse email invalide");
        });

        test("rejette les mots de passe trop courts", async () => {
            // crée une instance du resolver
            const resolver = new UserResolver();
            // vérifie que les mots de passe trop courts sont rejetés
            await expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "Alice@gmail.com",
                password: "123",
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } } as any)).rejects.toThrow("Mot de passe trop court");
        });

        test("rejette les mots de passe trop longs", async () => {
            // crée une instance du resolver
            const resolver = new UserResolver();
            const longPassword = "a".repeat(101);
            // vérifie que les mots de passe trop longs sont rejetés
            await expect(resolver.signup({
                firstName: "Alice",
                lastName: "Doe",
                email: "Alice@gmail.com",
                password: longPassword,
                date_of_birth: "1990-01-01"
            }, { res: { cookie: jest.fn() } } as any)).rejects.toThrow("Mot de passe trop long");
        });
    });

});
