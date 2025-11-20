import { gql } from "@apollo/client";

//USER OPERATIONS

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data){
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

export const SIGNUP = gql`
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

export const GET_MY_PROFILE = gql`
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

export const UPDATE_ME_PROFILE = gql`
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

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

// WISHLIST OPERATIONS

export const WISHLIST_ITEMS = gql`
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

//GROUP OPERATIONS

export const CREATE_GROUP = gql`
  mutation CreateGroup($data: CreateGroupInput!) {
    createGroup(data: $data) {
      id
      name
      piggy_bank
      event_type
    }
  }
`;

export const GET_ALL_MY_GROUPS = gql`
  query getAllMyGroups {
    getAllMyGroups {
      id
      name
      piggy_bank
      event_type
    }
  }
`;
