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
