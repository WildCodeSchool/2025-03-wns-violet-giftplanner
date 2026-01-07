import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client/react';
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

export type Query = {
  __typename?: 'Query';
  welcomeAll: Scalars['String']['output'];
  wishlistItems: Array<WishlistItem>;
};

export type WishlistItem = {
  __typename?: 'WishlistItem';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  listId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type WishlistItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type WishlistItemsQuery = { __typename?: 'Query', wishlistItems: Array<{ __typename?: 'WishlistItem', id: string, name: string, description?: string | null, imageUrl?: string | null, price?: number | null }> };


export const WishlistItemsDocument = gql`
    query WishlistItems {
  wishlistItems {
    id
    name
    description
    imageUrl
    price
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