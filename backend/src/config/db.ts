import { DataSource } from "typeorm";
import { Gift } from "../entities/Gift";
import { Group } from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { Like } from "../entities/Like";
import { List } from "../entities/List";
import { Message } from "../entities/Message";
import { PendingInvitation } from "../entities/PendingInvitation";
import User from "../entities/User";
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

  entities: [User, Gift, GroupMember, Group, Like, List, Message, PendingInvitation],
  synchronize: true,
  logging: ["error"],
  // "query"
});

export default dataSource;
