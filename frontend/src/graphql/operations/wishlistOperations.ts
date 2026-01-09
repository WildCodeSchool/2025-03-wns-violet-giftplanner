import { gql } from "@apollo/client";

// WISHLIST OPERATIONS

export const MY_WISHLIST_ITEMS = gql`
  query MyWishlistItems {
    myWishlistItems {
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

export const GROUP_WISHLIST_ITEMS = gql`
  query GroupWishlistItems($groupId: Int!) {
    groupWishlistItems(groupId: $groupId) {
      fromWishlist {
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
      fromGroupList {
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
  }
`;

export const ADD_GIFT = gql`
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

export const ADD_GIFT_TO_GROUP_LIST = gql`
  mutation AddGiftToGroupList($groupId: Int!, $data: AddGiftInput!) {
    addGiftToGroupList(groupId: $groupId, data: $data) {
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

export const UPDATE_GIFT = gql`
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

export const DELETE_GIFT = gql`
  mutation DeleteGift($id: Int!) {
    deleteGift(id: $id)
  }
`;
