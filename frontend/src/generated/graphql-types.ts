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

export type BanUserResponse = {
  __typename?: 'BanUserResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type CreateGroupInput = {
  deadline: Scalars['DateTimeISO']['input'];
  event_type: Scalars['String']['input'];
  name: Scalars['String']['input'];
  piggy_bank: Scalars['Float']['input'];
};

export type DeleteUserResponse = {
  __typename?: 'DeleteUserResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
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
  addGift: Gift;
  banUser: BanUserResponse;
  createGroup: Group;
  deleteGift: Scalars['Int']['output'];
  deleteMyProfile: DeleteUserResponse;
  deleteUser: DeleteUserResponse;
  login: User;
  logout: Scalars['Boolean']['output'];
  sendMessage: Scalars['Boolean']['output'];
  signup: User;
  unbanUser: BanUserResponse;
  updateGift: Gift;
};


export type MutationUpdateMyProfileArgs = {
  data: UpdateMyProfileInput;
};


export type MutationAddGiftArgs = {
  data: AddGiftInput;
};


export type MutationBanUserArgs = {
  userId: Scalars['Float']['input'];
};


export type MutationCreateGroupArgs = {
  data: CreateGroupInput;
};


export type MutationDeleteGiftArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['Float']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationSendMessageArgs = {
  data: NewMessageInput;
};


export type MutationSignupArgs = {
  data: SignupInput;
};


export type MutationUnbanUserArgs = {
  userId: Scalars['Float']['input'];
};


export type MutationUpdateGiftArgs = {
  data: UpdateGiftInput;
  id: Scalars['Int']['input'];
};

export type MyGroupsResponse = {
  __typename?: 'MyGroupsResponse';
  groupToken: Scalars['String']['output'];
  groups: Array<Group>;
};

export type NewMessageInput = {
  groupId: Scalars['Float']['input'];
  message: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  coucou: Scalars['String']['output'];
  getAllMyGroups: MyGroupsResponse;
  getAllUsers: Array<User>;
  getAllUsersAdmin: Array<User>;
  getAllUsersForAdmin: Array<User>;
  getMyProfile: User;
  testAdmin: Scalars['String']['output'];
  testUser: Scalars['String']['output'];
  welcomeAll: Scalars['String']['output'];
  wishlistItems: Array<Gift>;
};


export type QueryWishlistItemsArgs = {
  listId?: InputMaybe<Scalars['Int']['input']>;
};

export type SignupInput = {
  date_of_birth: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateGiftInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
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
  bannedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  beneficiary_groups: Array<Group>;
  createdAt: Scalars['DateTimeISO']['output'];
  date_of_birth: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gifts: Array<Gift>;
  groupMember: Array<GroupMember>;
  id: Scalars['ID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  isAdmin: Scalars['Boolean']['output'];
  isBanned: Scalars['Boolean']['output'];
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

export type DeleteMyProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteMyProfileMutation = { __typename?: 'Mutation', deleteMyProfile: { __typename?: 'DeleteUserResponse', success: boolean, message: string } };

export type WishlistItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type WishlistItemsQuery = { __typename?: 'Query', wishlistItems: Array<{ __typename?: 'Gift', id: string, name: string, description: string, imageUrl: string, url: string, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: string } | null, list?: { __typename?: 'List', id: string } | null }> };

export type AddGiftMutationVariables = Exact<{
  data: AddGiftInput;
}>;


export type AddGiftMutation = { __typename?: 'Mutation', addGift: { __typename?: 'Gift', id: string, name: string, description: string, imageUrl: string, url: string, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: string } | null, list?: { __typename?: 'List', id: string } | null } };

export type UpdateGiftMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateGiftInput;
}>;


export type UpdateGiftMutation = { __typename?: 'Mutation', updateGift: { __typename?: 'Gift', id: string, name: string, description: string, imageUrl: string, url: string, updatedAt: any } };

export type DeleteGiftMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteGiftMutation = { __typename?: 'Mutation', deleteGift: number };

export type CreateGroupMutationVariables = Exact<{
  data: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'Group', id: string, name: string, piggy_bank: number, event_type: string } };

export type GetAllMyGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMyGroupsQuery = { __typename?: 'Query', getAllMyGroups: { __typename?: 'MyGroupsResponse', groupToken: string, groups: Array<{ __typename?: 'Group', id: string, name: string, createdAt: any, updatedAt: any, event_type: string, piggy_bank: number, deadline: any, messages: Array<{ __typename?: 'Message', id: string, content: string, createdAt: any, isEdited: boolean, user: { __typename?: 'User', id: string, firstName: string, lastName: string, image_url?: string | null, isAdmin: boolean } }> }> } };

export type GetAllUsersForAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersForAdminQuery = { __typename?: 'Query', getAllUsersForAdmin: Array<{ __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isAdmin: boolean, isBanned: boolean, bannedAt?: any | null, createdAt: any, image_url?: string | null }> };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['Float']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'DeleteUserResponse', success: boolean, message: string } };

export type BanUserMutationVariables = Exact<{
  userId: Scalars['Float']['input'];
}>;


export type BanUserMutation = { __typename?: 'Mutation', banUser: { __typename?: 'BanUserResponse', success: boolean, message: string, user?: { __typename?: 'User', id: string, isBanned: boolean } | null } };

export type UnbanUserMutationVariables = Exact<{
  userId: Scalars['Float']['input'];
}>;


export type UnbanUserMutation = { __typename?: 'Mutation', unbanUser: { __typename?: 'BanUserResponse', success: boolean, message: string, user?: { __typename?: 'User', id: string, isBanned: boolean } | null } };


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
export const DeleteMyProfileDocument = gql`
    mutation DeleteMyProfile {
  deleteMyProfile {
    success
    message
  }
}
    `;
export type DeleteMyProfileMutationFn = Apollo.MutationFunction<DeleteMyProfileMutation, DeleteMyProfileMutationVariables>;

/**
 * __useDeleteMyProfileMutation__
 *
 * To run a mutation, you first call `useDeleteMyProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMyProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMyProfileMutation, { data, loading, error }] = useDeleteMyProfileMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteMyProfileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMyProfileMutation, DeleteMyProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMyProfileMutation, DeleteMyProfileMutationVariables>(DeleteMyProfileDocument, options);
      }
export type DeleteMyProfileMutationHookResult = ReturnType<typeof useDeleteMyProfileMutation>;
export type DeleteMyProfileMutationResult = Apollo.MutationResult<DeleteMyProfileMutation>;
export type DeleteMyProfileMutationOptions = Apollo.BaseMutationOptions<DeleteMyProfileMutation, DeleteMyProfileMutationVariables>;
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
export const UpdateGiftDocument = gql`
    mutation UpdateGift($id: Int!, $data: UpdateGiftInput!) {
  updateGift(id: $id, data: $data) {
    id
    name
    description
    imageUrl
    url
    updatedAt
  }
}
    `;
export type UpdateGiftMutationFn = Apollo.MutationFunction<UpdateGiftMutation, UpdateGiftMutationVariables>;

/**
 * __useUpdateGiftMutation__
 *
 * To run a mutation, you first call `useUpdateGiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGiftMutation, { data, loading, error }] = useUpdateGiftMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateGiftMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGiftMutation, UpdateGiftMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGiftMutation, UpdateGiftMutationVariables>(UpdateGiftDocument, options);
      }
export type UpdateGiftMutationHookResult = ReturnType<typeof useUpdateGiftMutation>;
export type UpdateGiftMutationResult = Apollo.MutationResult<UpdateGiftMutation>;
export type UpdateGiftMutationOptions = Apollo.BaseMutationOptions<UpdateGiftMutation, UpdateGiftMutationVariables>;
export const DeleteGiftDocument = gql`
    mutation DeleteGift($id: Int!) {
  deleteGift(id: $id)
}
    `;
export type DeleteGiftMutationFn = Apollo.MutationFunction<DeleteGiftMutation, DeleteGiftMutationVariables>;

/**
 * __useDeleteGiftMutation__
 *
 * To run a mutation, you first call `useDeleteGiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGiftMutation, { data, loading, error }] = useDeleteGiftMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGiftMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGiftMutation, DeleteGiftMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGiftMutation, DeleteGiftMutationVariables>(DeleteGiftDocument, options);
      }
export type DeleteGiftMutationHookResult = ReturnType<typeof useDeleteGiftMutation>;
export type DeleteGiftMutationResult = Apollo.MutationResult<DeleteGiftMutation>;
export type DeleteGiftMutationOptions = Apollo.BaseMutationOptions<DeleteGiftMutation, DeleteGiftMutationVariables>;
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
    groups {
      messages {
        id
        content
        createdAt
        isEdited
        user {
          id
          firstName
          lastName
          image_url
          isAdmin
        }
      }
      id
      name
      createdAt
      updatedAt
      event_type
      piggy_bank
      deadline
    }
    groupToken
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
export const GetAllUsersForAdminDocument = gql`
    query GetAllUsersForAdmin {
  getAllUsersForAdmin {
    id
    email
    firstName
    lastName
    isAdmin
    isBanned
    bannedAt
    createdAt
    image_url
  }
}
    `;

/**
 * __useGetAllUsersForAdminQuery__
 *
 * To run a query within a React component, call `useGetAllUsersForAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersForAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersForAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersForAdminQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersForAdminQuery, GetAllUsersForAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersForAdminQuery, GetAllUsersForAdminQueryVariables>(GetAllUsersForAdminDocument, options);
      }
export function useGetAllUsersForAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersForAdminQuery, GetAllUsersForAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersForAdminQuery, GetAllUsersForAdminQueryVariables>(GetAllUsersForAdminDocument, options);
        }
export function useGetAllUsersForAdminSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersForAdminQuery, GetAllUsersForAdminQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersForAdminQuery, GetAllUsersForAdminQueryVariables>(GetAllUsersForAdminDocument, options);
        }
export type GetAllUsersForAdminQueryHookResult = ReturnType<typeof useGetAllUsersForAdminQuery>;
export type GetAllUsersForAdminLazyQueryHookResult = ReturnType<typeof useGetAllUsersForAdminLazyQuery>;
export type GetAllUsersForAdminSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersForAdminSuspenseQuery>;
export type GetAllUsersForAdminQueryResult = Apollo.QueryResult<GetAllUsersForAdminQuery, GetAllUsersForAdminQueryVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($userId: Float!) {
  deleteUser(userId: $userId) {
    success
    message
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const BanUserDocument = gql`
    mutation BanUser($userId: Float!) {
  banUser(userId: $userId) {
    success
    message
    user {
      id
      isBanned
    }
  }
}
    `;
export type BanUserMutationFn = Apollo.MutationFunction<BanUserMutation, BanUserMutationVariables>;

/**
 * __useBanUserMutation__
 *
 * To run a mutation, you first call `useBanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [banUserMutation, { data, loading, error }] = useBanUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useBanUserMutation(baseOptions?: Apollo.MutationHookOptions<BanUserMutation, BanUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BanUserMutation, BanUserMutationVariables>(BanUserDocument, options);
      }
export type BanUserMutationHookResult = ReturnType<typeof useBanUserMutation>;
export type BanUserMutationResult = Apollo.MutationResult<BanUserMutation>;
export type BanUserMutationOptions = Apollo.BaseMutationOptions<BanUserMutation, BanUserMutationVariables>;
export const UnbanUserDocument = gql`
    mutation UnbanUser($userId: Float!) {
  unbanUser(userId: $userId) {
    success
    message
    user {
      id
      isBanned
    }
  }
}
    `;
export type UnbanUserMutationFn = Apollo.MutationFunction<UnbanUserMutation, UnbanUserMutationVariables>;

/**
 * __useUnbanUserMutation__
 *
 * To run a mutation, you first call `useUnbanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnbanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unbanUserMutation, { data, loading, error }] = useUnbanUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnbanUserMutation(baseOptions?: Apollo.MutationHookOptions<UnbanUserMutation, UnbanUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnbanUserMutation, UnbanUserMutationVariables>(UnbanUserDocument, options);
      }
export type UnbanUserMutationHookResult = ReturnType<typeof useUnbanUserMutation>;
export type UnbanUserMutationResult = Apollo.MutationResult<UnbanUserMutation>;
export type UnbanUserMutationOptions = Apollo.BaseMutationOptions<UnbanUserMutation, UnbanUserMutationVariables>;