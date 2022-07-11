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