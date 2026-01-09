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
      lists {
        id
        name
      }
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
      lists {
        id
        name
      }
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
      lists {
        id
        name
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const DELETE_MY_PROFILE = gql`
  mutation DeleteMyProfile {
    deleteMyProfile {
      success
      message
    }
  }
`;

// permission operations

export const GET_ALL_USERS_FOR_ADMIN = gql`
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

export const DELETE_USER = gql`
  mutation DeleteUser($userId: Float!) {
    deleteUser(userId: $userId) {
      success
      message
    }
  }
`;

export const BAN_USER = gql`
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

export const UNBAN_USER = gql`
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
