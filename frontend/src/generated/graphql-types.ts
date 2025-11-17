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

export type AddGiftInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  listId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type Gift = {
  __typename?: 'Gift';
  createdAt: Scalars['DateTimeISO']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  likes: Array<Like>;
  list?: Maybe<List>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  url: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type Group = {
  __typename?: 'Group';
  budget: Scalars['Float']['output'];
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
  addGift: Gift;
  deleteGift: Scalars['Int']['output'];
  login: User;
  logout: Scalars['Boolean']['output'];
  signup: User;
};


export type MutationAddGiftArgs = {
  data: AddGiftInput;
};


export type MutationDeleteGiftArgs = {
  giftId: Scalars['Int']['input'];
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
  getAllUsers: Array<User>;
  getAllUsersAdmin: Array<User>;
  getMeProfile: User;
  testAdmin: Scalars['String']['output'];
  testUser: Scalars['String']['output'];
  welcomeAll: Scalars['String']['output'];
  wishlistItems: Array<Gift>;
};


export type QueryWishlistItemsArgs = {
  listId?: InputMaybe<Scalars['String']['input']>;
};

export type SignupInput = {
  date_of_birth: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
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

export type GetMeProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeProfileQuery = { __typename?: 'Query', getMeProfile: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phone_number?: string | null, date_of_birth: string, createdAt: any, updatedAt: any, image_url?: string | null, isVerified: boolean, isAdmin: boolean } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type WishlistItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type WishlistItemsQuery = { __typename?: 'Query', wishlistItems: Array<{ __typename?: 'Gift', id: string, name: string, description: string, imageUrl: string, url: string, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: string } | null, list?: { __typename?: 'List', id: string } | null }> };

export type AddGiftMutationVariables = Exact<{
  data: AddGiftInput;
}>;


export type AddGiftMutation = { __typename?: 'Mutation', addGift: { __typename?: 'Gift', id: string, name: string, description: string, imageUrl: string, url: string, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: string } | null, list?: { __typename?: 'List', id: string } | null } };


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
export const WishlistItemsDocument = gql`
    query WishlistItems {
  wishlistItems {
    id
    name
    description
    imageUrl
    url
    createdAt
    updatedAt
    user {
      id
    }
    list {
      id
    }
  }
}
    `;

/**
 * __useWishlistItemsQuery__
 *
 * To run a query within a React component, call `useWishlistItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWishlistItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWishlistItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useWishlistItemsQuery(baseOptions?: Apollo.QueryHookOptions<WishlistItemsQuery, WishlistItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WishlistItemsQuery, WishlistItemsQueryVariables>(WishlistItemsDocument, options);
      }
export function useWishlistItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WishlistItemsQuery, WishlistItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WishlistItemsQuery, WishlistItemsQueryVariables>(WishlistItemsDocument, options);
        }
export function useWishlistItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WishlistItemsQuery, WishlistItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WishlistItemsQuery, WishlistItemsQueryVariables>(WishlistItemsDocument, options);
        }
export type WishlistItemsQueryHookResult = ReturnType<typeof useWishlistItemsQuery>;
export type WishlistItemsLazyQueryHookResult = ReturnType<typeof useWishlistItemsLazyQuery>;
export type WishlistItemsSuspenseQueryHookResult = ReturnType<typeof useWishlistItemsSuspenseQuery>;
export type WishlistItemsQueryResult = Apollo.QueryResult<WishlistItemsQuery, WishlistItemsQueryVariables>;
export const AddGiftDocument = gql`
    mutation AddGift($data: AddGiftInput!) {
  addGift(data: $data) {
    id
    name
    description
    imageUrl
    url
    createdAt
    updatedAt
    user {
      id
    }
    list {
      id
    }
  }
}
    `;
export type AddGiftMutationFn = Apollo.MutationFunction<AddGiftMutation, AddGiftMutationVariables>;

/**
 * __useAddGiftMutation__
 *
 * To run a mutation, you first call `useAddGiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddGiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addGiftMutation, { data, loading, error }] = useAddGiftMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddGiftMutation(baseOptions?: Apollo.MutationHookOptions<AddGiftMutation, AddGiftMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddGiftMutation, AddGiftMutationVariables>(AddGiftDocument, options);
      }
export type AddGiftMutationHookResult = ReturnType<typeof useAddGiftMutation>;
export type AddGiftMutationResult = Apollo.MutationResult<AddGiftMutation>;
export type AddGiftMutationOptions = Apollo.BaseMutationOptions<AddGiftMutation, AddGiftMutationVariables>;