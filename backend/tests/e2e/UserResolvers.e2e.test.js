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
const supertest_1 = __importDefault(require("supertest"));
const envManager_1 = require("../../src/lib/envManager/envManager");
const PORT = (0, envManager_1.getVariableEnv)("SERVEUR_PORT", true);
// url du vrai serveur
const url = `http://localhost:${PORT}`;
describe.skip("E2E UserResolver", () => {
    test("getAllUsers", () => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Signup
        const signup = yield (0, supertest_1.default)(url)
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
        }
        else {
            // Vérifie que signup renvoie bien un token JWT
            expect(typeof data.signup).toBe("string");
            expect(data.signup).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
        }
        const token = signup.body.data.login;
        const res = yield (0, supertest_1.default)(url)
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: "{ getAllUsers { id firstName email } }" });
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.getAllUsers).toEqual(expect.arrayContaining([
            expect.objectContaining({ email: "alice@test.com", firstName: "Alice" }),
        ]));
    }));
});
