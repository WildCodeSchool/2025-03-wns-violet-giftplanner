import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type Gifts = {
  __typename?: 'Gifts';
  createdAt: Scalars['DateTimeISO']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  likes: Array<Likes>;
  list: Lists;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  url: Scalars['String']['output'];
  user: Users;
};

export type GroupMembers = {
  __typename?: 'GroupMembers';
  group: Groups;
  id: Scalars['ID']['output'];
  joined_at: Scalars['DateTimeISO']['output'];
  user: Users;
};

export type Groups = {
  __typename?: 'Groups';
  budget: Scalars['Float']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  deadline: Scalars['DateTimeISO']['output'];
  event_type: Scalars['String']['output'];
  groupMember: Array<GroupMembers>;
  id: Scalars['ID']['output'];
  likes: Array<Likes>;
  list_group: Lists;
  messages: Array<Messages>;
  name: Scalars['String']['output'];
  piggy_bank: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user_admin: Users;
  user_beneficiary: Users;
};

export type Likes = {
  __typename?: 'Likes';
  createdAt: Scalars['DateTimeISO']['output'];
  gift: Gifts;
  group: Groups;
  id: Scalars['ID']['output'];
  user: Users;
};

export type Lists = {
  __typename?: 'Lists';
  createdAt: Scalars['DateTimeISO']['output'];
  gift: Array<Gifts>;
  groups: Array<Groups>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user: Array<Users>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Messages = {
  __typename?: 'Messages';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  group: Groups;
  id: Scalars['ID']['output'];
  isEdited: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user: Users;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: Users;
  logout: Scalars['Boolean']['output'];
  signup: Users;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationSignupArgs = {
  data: SignupInput;
};

export type Query = {
  __typename?: 'Query';
  coucou: Scalars['String']['output'];
  getAllUsers: Array<Users>;
  getAllUsersAdmin: Array<Users>;
  getMeProfile: Users;
  testAdmin: Scalars['String']['output'];
  testUser: Scalars['String']['output'];
  welcomeAll: Scalars['String']['output'];
  wishlistItems: Array<Gifts>;
};

export type SignupInput = {
  date_of_birth: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Users = {
  __typename?: 'Users';
  admin_groups: Array<Groups>;
  beneficiary_groups: Array<Groups>;
  createdAt: Scalars['DateTimeISO']['output'];
  date_of_birth: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gifts: Array<Gifts>;
  groupMember: Array<GroupMembers>;
  id: Scalars['ID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  isAdmin: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  likes: Array<Likes>;
  lists: Array<Lists>;
  messages: Array<Messages>;
  phone_number?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Users', id: string, firstName: string, lastName: string, email: string, phone_number?: string | null, date_of_birth: string, createdAt: any, updatedAt: any, image_url?: string | null, isVerified: boolean, isAdmin: boolean } };

export type SignupMutationVariables = Exact<{
  data: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'Users', createdAt: any, date_of_birth: string, email: string, firstName: string, id: string, image_url?: string | null, isAdmin: boolean, isVerified: boolean, lastName: string, phone_number?: string | null, updatedAt: any } };

export type GetMeProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeProfileQuery = { __typename?: 'Query', getMeProfile: { __typename?: 'Users', id: string, firstName: string, lastName: string, email: string, phone_number?: string | null, date_of_birth: string, createdAt: any, updatedAt: any, image_url?: string | null, isVerified: boolean, isAdmin: boolean } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };


export const LoginDocument = gql`
    mutation Login($data: LoginInput!) {
  login(data: $data) {
    id
    firstName
    lastName
    email
    phone_number
    date_of_birth
    createdAt
    updatedAt
    image_url
    isVerified
    isAdmin
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const SignupDocument = gql`
    mutation Signup($data: SignupInput!) {
  signup(data: $data) {
    createdAt
    date_of_birth
    email
    firstName
    id
    image_url
    isAdmin
    isVerified
    lastName
    phone_number
    updatedAt
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const GetMeProfileDocument = gql`
    query GetMeProfile {
  getMeProfile {
    id
    firstName
    lastName
    email
    phone_number
    date_of_birth
    createdAt
    updatedAt
    image_url
    isVerified
    isAdmin
  }
}
    `;

/**
 * __useGetMeProfileQuery__
 *
 * To run a query within a React component, call `useGetMeProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetMeProfileQuery, GetMeProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeProfileQuery, GetMeProfileQueryVariables>(GetMeProfileDocument, options);
      }
export function useGetMeProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeProfileQuery, GetMeProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeProfileQuery, GetMeProfileQueryVariables>(GetMeProfileDocument, options);
        }
export function useGetMeProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeProfileQuery, GetMeProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeProfileQuery, GetMeProfileQueryVariables>(GetMeProfileDocument, options);
        }
export type GetMeProfileQueryHookResult = ReturnType<typeof useGetMeProfileQuery>;
export type GetMeProfileLazyQueryHookResult = ReturnType<typeof useGetMeProfileLazyQuery>;
export type GetMeProfileSuspenseQueryHookResult = ReturnType<typeof useGetMeProfileSuspenseQuery>;
export type GetMeProfileQueryResult = Apollo.QueryResult<GetMeProfileQuery, GetMeProfileQueryVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;