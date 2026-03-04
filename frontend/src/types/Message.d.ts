import type { GetAllMessageMyGroupsQuery } from "../graphql/generated/graphql-types";

export type Message = GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"][number];
