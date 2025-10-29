import { DataSource } from "typeorm";
import { Gifts } from "../entities/Gifts";
import { GroupMembers } from "../entities/GroupMembers";
import { Groups } from "../entities/Groups";
import { Likes } from "../entities/Likes";
import { Lists } from "../entities/Lists";
import { Messages } from "../entities/Messages";
import Users from "../entities/Users";
import { getVariableEnvMulti } from "../lib/envManager/envManager";

const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = getVariableEnvMulti([
  "DB_HOST",
  "DB_DATABASE",
  "DB_USER",
  "DB_PASSWORD",
]);

const dataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,

  entities: [Users, Gifts, GroupMembers, Groups, Likes, Lists, Messages],
  synchronize: true,
  logging: ["error"],
  // "query"
});

export default dataSource;
