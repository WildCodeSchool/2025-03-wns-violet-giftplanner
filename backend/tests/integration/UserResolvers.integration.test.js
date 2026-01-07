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
require("reflect-metadata");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const type_graphql_1 = require("type-graphql");
const db_1 = __importDefault(require("../../src/config/db"));
const User_1 = __importDefault(require("../../src/entities/User"));
const UserResolver_1 = __importDefault(require("../../src/resolvers/UserResolver"));
let server;
let url;
function createData() {
    return __awaiter(this, void 0, void 0, function* () {
        yield User_1.default.save([
            User_1.default.create({ firstName: "bob", lastName: "robert", email: "bob.robert@gmail.com", password_hashed: "defegg", phone_number: "0612345678", date_of_birth: "11/09/2025" }),
            User_1.default.create({ firstName: "michel", lastName: "robert", email: "michel.robert@hotmail.com", password_hashed: "gfydtyfdftiu", phone_number: "0712345678", date_of_birth: "11/09/2025" }),
        ]);
    });
}
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Initialise la DB de test
    yield db_1.default.initialize();
    yield db_1.default.synchronize(true); // reset la DB entre tests
    // data initiale
    yield createData();
    // Construit le schéma GraphQL
    const schema = yield (0, type_graphql_1.buildSchema)({
        resolvers: [UserResolver_1.default],
    });
    server = new server_1.ApolloServer({ schema });
    // Lance Apollo en local sur un port aléatoire
    const { url: serverUrl } = yield (0, standalone_1.startStandaloneServer)(server, { listen: { port: 0 } });
    url = serverUrl;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.stop();
    yield db_1.default.destroy();
}));
describe("UserResolver test integration", () => {
    test("renvoie tous les utilisateurs existants", () => __awaiter(void 0, void 0, void 0, function* () {
        // execute la requête GraphQL
        const res = yield (0, supertest_1.default)(url)
            .post("/")
            .send({ query: "{ getAllUsers { id firstName } }" });
        // verifie qu'il n'y a pas d'erreurs
        expect(res.body.errors).toBeUndefined();
        // verifie que la réponse contient les utilisateurs créés
        expect(res.body.data.getAllUsers).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: "1", firstName: "bob" }),
            expect.objectContaining({ id: "2", firstName: "michel" }),
        ]));
    }));
    test("renvoie un tableau vide si aucun utilisateur", () => __awaiter(void 0, void 0, void 0, function* () {
        // reset la DB
        yield db_1.default.synchronize(true);
        // execute la requête GraphQL
        const res = yield (0, supertest_1.default)(url)
            .post("/")
            .send({ query: "{ getAllUsers { id firstName } }" });
        // verifie qu'il n'y a pas d'erreurs et que la réponse est un tableau vide
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.getAllUsers).toEqual([]);
    }));
    test("respecte le format de réponse attendu", () => __awaiter(void 0, void 0, void 0, function* () {
        // reseed 1 utilisateur
        yield createData();
        const res = yield (0, supertest_1.default)(url)
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
    }));
});
