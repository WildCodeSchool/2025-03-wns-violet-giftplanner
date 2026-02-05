import { gql } from "@apollo/client";

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

export const ADD_FUNDS_TO_GROUP = gql`
  mutation AddFundsToGroup($data: AddFundsInput!) {
    addFundsToGroup(data: $data) {
      id
      piggy_bank
    }
  }
`;
