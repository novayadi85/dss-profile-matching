import { gql } from "@apollo/client";

export const QUERY_ALL_GAPS = gql`
  query allGaps(
    $first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int
  ) {
    allGaps(first: $first, after: $after, before: $before, last: $last, offset: $offset) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        _nodeId
        createdBy
        gap
        id
        integrity
        subCriteriaId
        note
      }
    }
  }
`


export const GET_GAP = gql`
  query getGap($nodeId: ID!){
    gap(_nodeId: $nodeId) {
      note
      integrity
      id
      gap
      createdBy
      subCriteriaId
      _nodeId
    }
  }
`

export const ADD_GAP = gql`
  mutation createGap(
    $gap: Int
    $integrity: Float
    $note: String
    $subCriteriaId: Int
  ){
    createGap(
      input: {
        gap: {
            gap: $gap,
            integrity: $integrity,
            subCriteriaId: $subCriteriaId,
            note: $note
        }
      }
    ){
      gap {
        _nodeId
        createdBy
        gap
        id
        integrity
        subCriteriaId
        note
      }
    }
  }
`

export const UPDATE_GAP = gql`
  mutation updateGap(
    $nodeId: ID!
    $gap: Int
    $integrity: Float
    $note: String
    $subCriteriaId: Int
  ){
    updateGap(
      input: {
        _nodeId: $nodeId,
        gapPatch: {
            gap: $gap,
            integrity: $integrity,
            subCriteriaId: $subCriteriaId,
            note: $note
        }
      }
    ){
      gap {
        _nodeId
        createdBy
        gap
        id
        integrity
        subCriteriaId
        note
      }
    }
  }
`


export const DELETE_GAP = gql`
  mutation deleteGap($nodeId: ID!){
    deleteGap(
      input: {
        _nodeId: $nodeId
      }
    ){
      deletedGapId
    }
  }
`