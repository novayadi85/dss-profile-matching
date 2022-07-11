import { gql } from "@apollo/client";

export const QUERY_ALL_PLAYER = gql`
  query allPlayers(
    $first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int
    $condition: PlayerCondition 
    $orderBy: [PlayersOrderBy!]
  ) {
    allPlayers(first: $first, after: $after, before: $before, last: $last, offset: $offset, condition: $condition, orderBy: $orderBy ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        _nodeId
        address
        backNumber
        birth
        createdBy
        id
        name
        phone
        position
      }
    }
  }
`


export const ADD_PlAYER = gql`
  mutation createPlayer(
    $birth: Date!
    $backNumber: String
    $phone: String
    $name: String
    $position: Positions
    $address: String
  ){
    createPlayer(
      input: {
        player: {
          birth: $birth,
          phone: $phone,
          address: $address,
          name: $name,
          position: $position,
          backNumber: $backNumber
        }
      }
    ){
        player {
          _nodeId
          address
          backNumber
          birth
          createdBy
          id
          name
          phone
          position
        }
    }
  }
`



export const DELETE_PLAYER = gql`
  mutation deletePlayer($nodeId: ID!){
    deletePlayer(
      input: {
        _nodeId: $nodeId
      }
    ){
        deletedPlayerId
    }
  }
`


export const UPDATE_PLAYER = gql`
  mutation updatePlayer(
    $nodeId: ID!
    $birth: Date
    $backNumber: String
    $phone: String
    $name: String
    $position: Positions
    $address: String
  ){
    updatePlayer(
      input: {
        _nodeId: $nodeId,
        playerPatch: {
          birth: $birth,
          phone: $phone,
          address: $address,
          name: $name,
          position: $position,
          backNumber: $backNumber
        }
      }
    ){
        player {
          _nodeId
          address
          backNumber
          birth
          createdBy
          id
          name
          phone
          position
        }
    }
  }
`


export const GET_PLAYER = gql`
  query getPlayer($nodeId: ID!){
    player(_nodeId: $nodeId) {
      _nodeId
          address
          backNumber
          birth
          createdBy
          id
          name
          phone
          position
    }
  }
`