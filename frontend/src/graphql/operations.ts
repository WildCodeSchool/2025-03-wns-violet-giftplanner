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

//GROUP OPERATIONS

export const CREATE_GROUP = gql`
mutation CreateGroup($data: CreateGroupInput!) {
  createGroup(data: $data) {
    id
    name
    event_type
    piggy_bank
    deadline
    createdAt
    user_beneficiary {
      id
      firstName
      lastName
      email
    }
    user_admin {
      id
      firstName
      lastName
      email
    }
    groupMember {
      id
      userId
      groupId
    }
  }
}
`;

export const GET_ALL_MY_GROUPS = gql`
  query getAllMyGroups {
    getAllMyGroups {
      groupToken
      groups {
        id
        name
        createdAt
        updatedAt
        event_type
        piggy_bank
        deadline
        groupMember {
          id
          userId
          groupId
        }
      }
    }
  }
`;

export const GET_ALL_MESSAGE_MY_GROUPS = gql`
  query getAllMessageMyGroups {
    getAllMessageMyGroups {
      groupId
      messages {
        id
        content
        createdAt
        updatedAt
        isEdited
        user {
          id
          firstName
          lastName
          image_url
          isAdmin
        }
      }
    }
  }
`;

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
