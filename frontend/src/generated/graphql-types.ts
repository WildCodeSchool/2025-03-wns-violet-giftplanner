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

export type CreateGroupInput = {
  deadline: Scalars['DateTimeISO']['input'];
  event_type: Scalars['String']['input'];
  name: Scalars['String']['input'];
  piggy_bank: Scalars['Float']['input'];
};

export type Gift = {
  __typename?: 'Gift';
  createdAt: Scalars['DateTimeISO']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  likes: Array<Like>;
  list: List;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  url: Scalars['String']['output'];
  user: User;
};

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['DateTimeISO']['output'];
  deadline: Scalars['DateTimeISO']['output'];
  event_type: Scalars['String']['output'];
  groupMember: Array<GroupMember>;
  id: Scalars['ID']['output'];
  likes: Array<Like>;
  list_group: List;
  messages: Array<Message>;
  name: Scalars['String']['output'];
  piggy_bank: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user_admin: User;
  user_beneficiary: User;
};

export type GroupMember = {
  __typename?: 'GroupMember';
  group: Group;
  id: Scalars['ID']['output'];
  joined_at: Scalars['DateTimeISO']['output'];
  user: User;
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['DateTimeISO']['output'];
  gift: Gift;
  group: Group;
  id: Scalars['ID']['output'];
  user: User;
};

export type List = {
  __typename?: 'List';
  createdAt: Scalars['DateTimeISO']['output'];
  gift: Array<Gift>;
  groups: Array<Group>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user: Array<User>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  group: Group;
  id: Scalars['ID']['output'];
  isEdited: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  UpdateMyProfile: User;
  createGroup: Group;
  login: User;
  logout: Scalars['Boolean']['output'];
  signup: User;
};


export type MutationUpdateMyProfileArgs = {
  data: UpdateMyProfileInput;
};


export type MutationCreateGroupArgs = {
  data: CreateGroupInput;
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
  getAllMyGroups: Array<Group>;
  getAllUsers: Array<User>;
  getAllUsersAdmin: Array<User>;
  getMyProfile: User;
  testAdmin: Scalars['String']['output'];
  testUser: Scalars['String']['output'];
  welcomeAll: Scalars['String']['output'];
  wishlistItems: Array<Gift>;
};

export type SignupInput = {
  date_of_birth: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateMyProfileInput = {
  date_of_birth: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone_number: Scalars['String']['input'];
  pictureBase64?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  admin_groups: Array<Group>;
  beneficiary_groups: Array<Group>;
  createdAt: Scalars['DateTimeISO']['output'];
  date_of_birth: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gifts: Array<Gift>;
  groupMember: Array<GroupMember>;
  id: Scalars['ID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  isAdmin: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  likes: Array<Like>;
  lists: Array<List>;
  messages: Array<Message>;
  phone_number?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phone_number?: string | null, date_of_birth: string, createdAt: any, updatedAt: any, image_url?: string | null, isVerified: boolean, isAdmin: boolean } };

export type SignupMutationVariables = Exact<{
  data: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'User', createdAt: any, date_of_birth: string, email: string, firstName: string, id: string, image_url?: string | null, isAdmin: boolean, isVerified: boolean, lastName: string, phone_number?: string | null, updatedAt: any } };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename?: 'Query', getMyProfile: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phone_number?: string | null, date_of_birth: string, createdAt: any, updatedAt: any, image_url?: string | null, isVerified: boolean, isAdmin: boolean } };

export type UpdateMyProfileMutationVariables = Exact<{
  data: UpdateMyProfileInput;
}>;


export type UpdateMyProfileMutation = { __typename?: 'Mutation', UpdateMyProfile: { __typename?: 'User', createdAt: any, date_of_birth: string, email: string, firstName: string, id: string, image_url?: string | null, isAdmin: boolean, isVerified: boolean, lastName: string, phone_number?: string | null, updatedAt: any } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateGroupMutationVariables = Exact<{
  data: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'Group', id: string, name: string, piggy_bank: number, event_type: string } };

export type GetAllMyGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMyGroupsQuery = { __typename?: 'Query', getAllMyGroups: Array<{ __typename?: 'Group', id: string, name: string, createdAt: any, updatedAt: any, event_type: string, piggy_bank: number, deadline: any }> };


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
export const GetMyProfileDocument = gql`
    query GetMyProfile {
  getMyProfile {
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
 * __useGetMyProfileQuery__
 *
 * To run a query within a React component, call `useGetMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
      }
export function useGetMyProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
export function useGetMyProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
export type GetMyProfileQueryHookResult = ReturnType<typeof useGetMyProfileQuery>;
export type GetMyProfileLazyQueryHookResult = ReturnType<typeof useGetMyProfileLazyQuery>;
export type GetMyProfileSuspenseQueryHookResult = ReturnType<typeof useGetMyProfileSuspenseQuery>;
export type GetMyProfileQueryResult = Apollo.QueryResult<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const UpdateMyProfileDocument = gql`
    mutation UpdateMyProfile($data: UpdateMyProfileInput!) {
  UpdateMyProfile(data: $data) {
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
export type UpdateMyProfileMutationFn = Apollo.MutationFunction<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;

/**
 * __useUpdateMyProfileMutation__
 *
 * To run a mutation, you first call `useUpdateMyProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMyProfileMutation, { data, loading, error }] = useUpdateMyProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateMyProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>(UpdateMyProfileDocument, options);
      }
export type UpdateMyProfileMutationHookResult = ReturnType<typeof useUpdateMyProfileMutation>;
export type UpdateMyProfileMutationResult = Apollo.MutationResult<UpdateMyProfileMutation>;
export type UpdateMyProfileMutationOptions = Apollo.BaseMutationOptions<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
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
export const CreateGroupDocument = gql`
    mutation CreateGroup($data: CreateGroupInput!) {
  createGroup(data: $data) {
    id
    name
    piggy_bank
    event_type
  }
}
    `;
export type CreateGroupMutationFn = Apollo.MutationFunction<CreateGroupMutation, CreateGroupMutationVariables>;

/**
 * __useCreateGroupMutation__
 *
 * To run a mutation, you first call `useCreateGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGroupMutation, { data, loading, error }] = useCreateGroupMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateGroupMutation, CreateGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(CreateGroupDocument, options);
      }
export type CreateGroupMutationHookResult = ReturnType<typeof useCreateGroupMutation>;
export type CreateGroupMutationResult = Apollo.MutationResult<CreateGroupMutation>;
export type CreateGroupMutationOptions = Apollo.BaseMutationOptions<CreateGroupMutation, CreateGroupMutationVariables>;
export const GetAllMyGroupsDocument = gql`
    query getAllMyGroups {
  getAllMyGroups {
    id
    name
    createdAt
    updatedAt
    event_type
    piggy_bank
    deadline
  }
}
    `;

/**
 * __useGetAllMyGroupsQuery__
 *
 * To run a query within a React component, call `useGetAllMyGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllMyGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllMyGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllMyGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllMyGroupsQuery, GetAllMyGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllMyGroupsQuery, GetAllMyGroupsQueryVariables>(GetAllMyGroupsDocument, options);
      }
export function useGetAllMyGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllMyGroupsQuery, GetAllMyGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllMyGroupsQuery, GetAllMyGroupsQueryVariables>(GetAllMyGroupsDocument, options);
        }
export function useGetAllMyGroupsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllMyGroupsQuery, GetAllMyGroupsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllMyGroupsQuery, GetAllMyGroupsQueryVariables>(GetAllMyGroupsDocument, options);
        }
export type GetAllMyGroupsQueryHookResult = ReturnType<typeof useGetAllMyGroupsQuery>;
export type GetAllMyGroupsLazyQueryHookResult = ReturnType<typeof useGetAllMyGroupsLazyQuery>;
export type GetAllMyGroupsSuspenseQueryHookResult = ReturnType<typeof useGetAllMyGroupsSuspenseQuery>;
export type GetAllMyGroupsQueryResult = Apollo.QueryResult<GetAllMyGroupsQuery, GetAllMyGroupsQueryVariables>;