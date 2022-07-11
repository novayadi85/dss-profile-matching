import { gql } from "@apollo/client";

export const QUERY_ALL_CATEGORY = gql`
  query allCategories(
    $first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int
    $condition: CategoryCondition 
    $orderBy: [CategoriesOrderBy!]
  ) {
    allCategories(first: $first, after: $after, before: $before, last: $last, offset: $offset, condition: $condition, orderBy: $orderBy ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        _nodeId
        id
        percentage
        title
      }
    }
  }
`



export const GET_CATEGORY = gql`
  query getCategory($nodeId: ID!){
    category(_nodeId: $nodeId) {
      title
      percentage
      _nodeId
    }
  }
`

export const ADD_CATEGORY = gql`
  mutation createCategory(
    $title: String
    $percentage: Int
  ){
    createCategory(
      input: {
        category: {
            title: $title,
            percentage: $percentage
        }
      }
    ){
      category {
        title
        percentage
        _nodeId
      }
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation updateCategory(
    $nodeId: ID!
    $title: String
    $percentage: Int
  ){
    updateCategory(
      input: {
        _nodeId: $nodeId,
        categoryPatch: {
            title: $title,
            percentage: $percentage
        }
      }
    ){
        category {
            title
            percentage
            _nodeId
          }
    }
  }
`