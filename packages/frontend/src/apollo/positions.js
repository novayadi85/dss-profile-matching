import { gql } from '@apollo/client'

export const QUERY_ALL_POSITION = gql`
  query allPositions(
    $first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int
    $filter: PositionFilter
    $condition: PositionCondition
    $orderBy: [PositionsOrderBy!]
  ) {
    allPositions(
      first: $first
      after: $after
      before: $before
      last: $last
      offset: $offset
      condition: $condition
      filter: $filter
      orderBy: $orderBy
    ) {
      nodes {
        _nodeId
        id
        name
        description
        createdAt
        createdBy
        userPositionsByPositionId {
          totalCount
        }
      }
      totalCount
    }
  }
`;

export const GET_POSITION = gql`
  query getPosition($nodeId: ID!){
    position(_nodeId: $nodeId){
      _nodeId
      id
      name
      description
    }
  }
`


export const ADD_POSITION = gql`
  mutation createPosition(
    $name: String!
    $description: String,
  ) {
    createPosition(
      input: {
        position: { name: $name, description: $description }
      }
    ) {
      position {
        id
        name
      }
    }
  }
`
export const DELETE_POSITION = gql`
  mutation deletePosition($nodeId: ID!) {
    deletePosition(input: { _nodeId: $nodeId }) {
      deletedPositionId
    }
  }
`


export const UPDATE_POSITION = gql`
mutation updateDepartment($nodeId: ID!, $name: String, $description: String) {
  updatePosition(
    input: {
      _nodeId: $nodeId
      positionPatch: { name: $name, description: $description }
    }
  ) {
    position {
      name
      description
    }
  }
}

`