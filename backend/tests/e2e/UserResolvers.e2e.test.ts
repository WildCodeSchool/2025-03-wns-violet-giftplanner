import request from "supertest";
import { getVariableEnv } from "../../src/lib/envManager/envManager";

const PORT = getVariableEnv("SERVEUR_PORT", true);
// url du vrai serveur
const url = `http://localhost:${PORT}`;

describe.skip("E2E UserResolver", () => {
    test("getAllUsers", async () => {
        // 1. Signup
        const signup = await request(url)
            .post("/")
            .send({
                query: `
          mutation {
            signup(data: {
              firstName: "Alice",
              lastName: "Doe",
              email: "alice@test.com",
              password: "secret123",
              date_of_birth: "2000-01-01"
            })
          }
        `,
            });

        const { data, errors } = signup.body;

        if (errors) {
            // on accepte UNIQUEMENT l'erreur duplicate
            expect(errors[0].message).toMatch(/duplicate key/i);
            expect(errors[0].extensions.code).toBe("INTERNAL_SERVER_ERROR");
        } else {
            // Vérifie que signup renvoie bien un token JWT
            expect(typeof data.signup).toBe("string");
            expect(data.signup).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
        }

        const token = signup.body.data.login;

        const res = await request(url)
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: "{ getAllUsers { id firstName email } }" });

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.getAllUsers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ email: "alice@test.com", firstName: "Alice" }),
            ])
        );
    });
});