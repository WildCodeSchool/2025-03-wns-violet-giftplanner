import { gql } from "@apollo/client";

// mutation pour la connexion
export const LOIGIN = gql`
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

// query pour récupérer le profil de l'utilisateur connecté
export const GET_ME_PROFILE = gql`
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

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

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
`

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
