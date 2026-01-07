import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://backend:3310/graphql",
  documents: ["src/graphql/operations.ts"],
  overwrite: true,
  generates: {
    "src/generated/graphql-types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        withHooks: true,
        // withHOC: false,
        // withComponent: false,
        // apolloReactHooksImportFrom: "@apollo/client",
        // apolloReactCommonImportFrom: "@apollo/client",
        // reactApolloVersion: 3
      }
    }
  }
};

export default config;