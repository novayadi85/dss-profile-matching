import { gql } from '@apollo/client'

export const QUERY_ALL_USER_WITH_VARIABLE = gql`
  query allUsers {
    allUsers {
      totalCount
      nodes {
        createdAt
        firstName
        id
        lastName
        _nodeId
      }
    }
  }

`

export const QUERY_ALL_USER = gql`query{
    allUsers {
      nodes {
        createdAt
        firstName
        id
        lastName
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage 
        hasPreviousPage
        startCursor 
      }
    }
  }`

export const LOGIN_MUTATION = gql`mutation($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
    token {
      AccessToken
      RefreshToken
    }
    user {
      id
      name
      email
      token
    }
  }
}
`


export const AUTH_MUTATION = gql`mutation($email: String!, $password: String!) {
  authenticate(input: { email: $email, password: $password }) {
    jwt
  }
}`

export const QUERY_USER_BYID = gql`
query getUser($id: Int!) {
  tblUserById(id: $id) {
    _nodeId
    description
    email
    fullName
  }
}
`

export const REGISTER_MUTATION = gql`
  mutation register(
    $input: RegisterUser!
  ){
    register(
      input: $input
    ){
      token {
        AccessToken
        RefreshToken
      }
      user {
        id
        name
        email
        token
      }
    }
  }
`;


export const REGISTER_DATA = gql`
  query registerDropdownData{
    allCountries {
      nodes {
        id
        countryCode
        countryName
        phoneCode
      }
    }
    allBanks {
      nodes {
        id
        name
        description
      }
    }
  }
`

export const GET_USER = gql`
  query getUser($nodeId: ID!){
    user(_nodeId: $nodeId) {
      firstName
      id
      lastName
      _nodeId
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser(
    $_nodeId: ID!
    $firstName: String
    $lastName: String
  ) {
  updateUser(
    input: {
      _nodeId: $_nodeId, 
      userPatch: {
        firstName: $firstName,
        lastName: $lastName
      }
    }
  ) {
    user {
      _nodeId
    }
  }
}

`
export const GET_ACCOUNT = gql`
mutation userAccountById($id: Int!){
  userAccountById(input: {id: $id}) {
    userAccount {
      email
      userId
    }
  }
}
`

export const MODIFY_ACCOUNT = gql`
  mutation modifyUser(
    $firstname: String!
    $lastname: String!
    $username: String!
    $password: String!
    $userid: Int!
  ){
    modifyUser(
      input: {firstname: $firstname, lastname: $lastname, username: $username, password: $password, userid: $userid}
    ) {
      user {
        _nodeId
        firstName
        lastName
        createdAt
      }
    }
}
`