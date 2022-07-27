import { gql } from "@apollo/client";

export const QUERY_ALL_PLAYER = gql`
  query allPlayers(
    $first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int
    $filter: PlayerFilter
    $condition: PlayerCondition 
    $orderBy: [PlayersOrderBy!] = POSITION_ASC
    $ScoreCondition: ScoreCondition
  ) {
    allPlayers(first: $first, after: $after, before: $before, last: $last, offset: $offset, condition: $condition, filter: $filter, orderBy: $orderBy ) {
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
      scores: scoresByPlayerId(condition: $ScoreCondition) {
        totalCount
      }
    }
  }
`

export const QUERY_ALL_PLAYER_SCORES = gql`
  query allPlayers(
    $first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int
    $filter: PlayerFilter
    $condition: PlayerCondition 
    $orderBy: [PlayersOrderBy!] = POSITION_ASC
    $ScoreCondition: ScoreCondition
  ) {
    allPlayers(first: $first, after: $after, before: $before, last: $last, offset: $offset, condition: $condition, filter: $filter, orderBy: $orderBy ) {
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
      scores: scoresByPlayerId(condition: $ScoreCondition) {
        totalCount
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
    $photo: Upload
  ){
    createPlayer(
      input: {
        player: {
          birth: $birth,
          phone: $phone,
          address: $address,
          name: $name,
          position: $position,
          backNumber: $backNumber,
          photo: $photo
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
          photo
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
    $photo: Upload
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
          photo: $photo
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
          photo
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
          photo
    }
  }
`


export const GET_PLAYER_WITH_SCORE_BY_WEEK = gql`
query getPlayer($nodeId: ID!, $condition: ScoreCondition ){
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
        score: scoresByPlayerId(condition: $condition) {
          nodes {
            _nodeId
            playerId
            value
            week
            createdAt
          }
        }
  }
}
`

export const ADD_PlAYER_SCORE = gql`
  mutation createScore(
    $playerId: Int
    $value: JSON
    $week: Int
  ){
    createScore(
      input: {
        score: {
          playerId: $playerId,
          value: $value,
          week: $week
        }
      }
    ){
      score {
          _nodeId
          createdAt
          id
          playerId
          week
          value
        }
    }
  }
`

export const UPDATE_PlAYER_SCORE = gql`
  mutation updateScore(
    $nodeId: ID!
    $playerId: Int
    $value: JSON
    $week: Int
  ){
    updateScore(
      input: {
        _nodeId: $nodeId,
        scorePatch: {
          playerId: $playerId,
          value: $value,
          week: $week
        }
      }
    ){
      score {
          _nodeId
          createdAt
          id
          playerId
          week
          value
        }
    }
  }
`

export const GET_ALL_PLAYER_BY_POSITION_AND_GET_SCORES = gql`
query allPlayers(
    $PlayerCondition:  PlayerCondition
    $ScoreCondition: ScoreCondition
  ){
    allPlayers(condition: $PlayerCondition) {
      totalCount
      nodes {
        id
        backNumber
        name
        phone
        position
        birth
        createdBy
        address
        _nodeId
        scores: scoresByPlayerId(condition: $ScoreCondition, last: 1) {
          nodes {
            value
            week
          }
        }
      }
      
    }
  }
`
