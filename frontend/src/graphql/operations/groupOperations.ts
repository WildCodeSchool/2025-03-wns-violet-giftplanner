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

// export const UPDATE_GROUP = gql`
//   mutation UpdateGroup($id: ID!, $data: UpdateGroupInput!) {
//     updateGroup(id: $id, data: $data) {
//       id
//       name
//     }
//   }
// `;



export const GET_GROUP_BY_ID = gql`
  query GetGroupById($id: Float!) {
    getGroupById(id: $id) {
      user_admin {
        firstName
        lastName
        id
        email
      }
      piggy_bank
      name
      id
      groupMember {
        firstName
        lastName
        email
        userId
      }
      deadline
      event_type
      user_beneficiary {
        firstName
        lastName
        id
      }
    }
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup($data: UpdateGroupInput!, $updateGroupId: Float!) {
  updateGroup(data: $data, id: $updateGroupId) {
    id
    event_type
    updatedAt
    name
    piggy_bank
    deadline
  }
}
`;
