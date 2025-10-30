import "reflect-metadata";
import request from "supertest";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import dataSource from "../../src/config/db";
import User from "../../src/entities/User";
import UserResolver from "../../src/resolvers/UserResolver";

let server: ApolloServer;
let url: string;


async function createData() {
    await User.save([
        User.create({ firstName: "bob", lastName: "robert", email: "bob.robert@gmail.com", password_hashed: "defegg", phone_number: "0612345678", date_of_birth: "11/09/2025" }),
        User.create({ firstName: "michel", lastName: "robert", email: "michel.robert@hotmail.com", password_hashed: "gfydtyfdftiu", phone_number: "0712345678", date_of_birth: "11/09/2025" }),
    ]);
}

beforeAll(async () => {
    // Initialise la DB de test
    await dataSource.initialize();
    await dataSource.synchronize(true); // reset la DB entre tests

    // data initiale
    await createData();

    // Construit le schéma GraphQL
    const schema = await buildSchema({
        resolvers: [UserResolver],
    });

    server = new ApolloServer({ schema });

    // Lance Apollo en local sur un port aléatoire
    const { url: serverUrl } = await startStandaloneServer(server, { listen: { port: 0 } });
    url = serverUrl;
});

afterAll(async () => {
    await server.stop();
    await dataSource.destroy();
});

describe("UserResolver test integration", () => {
    test("renvoie tous les utilisateurs existants", async () => {
        // execute la requête GraphQL
        const res = await request(url)
            .post("/")
            .send({ query: "{ getAllUsers { id firstName } }" });

        // verifie qu'il n'y a pas d'erreurs
        expect(res.body.errors).toBeUndefined();
        // verifie que la réponse contient les utilisateurs créés
        expect(res.body.data.getAllUsers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: "1", firstName: "bob" }),
                expect.objectContaining({ id: "2", firstName: "michel" }),
            ])
        );
    });

    test("renvoie un tableau vide si aucun utilisateur", async () => {
        // reset la DB
        await dataSource.synchronize(true);

        // execute la requête GraphQL
        const res = await request(url)
            .post("/")
            .send({ query: "{ getAllUsers { id firstName } }" });

        // verifie qu'il n'y a pas d'erreurs et que la réponse est un tableau vide
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.getAllUsers).toEqual([]);
    });

    test("respecte le format de réponse attendu", async () => {
        // reseed 1 utilisateur
        await createData();

        const res = await request(url)
            .post("/")
            .send({ query: "{ getAllUsers { id firstName lastName email phone_number date_of_birth createdAt updatedAt image_url isVerified isAdmin } }" });

        expect(res.body.errors).toBeUndefined();
        const users = res.body.data.getAllUsers;

        // verifie que la réponse a les bons champs
        expect(Array.isArray(users)).toBe(true);
        expect(users[0]).toHaveProperty("id");
        expect(users[0]).toHaveProperty("firstName");
        expect(users[0]).toHaveProperty("lastName");
        expect(users[0]).toHaveProperty("email");
        expect(users[0]).toHaveProperty("phone_number");
        expect(users[0]).toHaveProperty("date_of_birth");
        expect(users[0]).toHaveProperty("createdAt");
        expect(users[0]).toHaveProperty("updatedAt");
        expect(users[0]).toHaveProperty("image_url");
        expect(users[0]).toHaveProperty("isVerified");
        expect(users[0]).toHaveProperty("isAdmin");
    });
});