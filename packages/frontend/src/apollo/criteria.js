import { gql } from '@apollo/client'
export const QUERY_ALL_CRITERIA = gql`query allCriteria($first: Int!, $after: Cursor, $before: Cursor, $last: Int, $offset: Int, $condition: CriterionCondition, $orderBy: [CriteriaOrderBy!]) {
    allCriteria(first: $first, after: $after, before: $before, last: $last, offset: $offset,condition: $condition, orderBy: $orderBy   ){
      nodes{
        _nodeId
        createdBy
        id
        name
        type
        position
        idealValue
        parentId
        subCriteriaByParentId {
            totalCount
        }
      }
      totalCount
    }
  }`



export const ADD_CRITERIA = gql`
mutation createCriterion(
  $name: String!
  $type: Types
  $position: [Positions] 
  $idealValue: Int
  $parentId: Int
){
    createCriterion(
    input: {
        criterion: {
            name: $name,
            type: $type,  
            position: $position, 
  idealValue: $idealValue,
  parentId: $parentId                                                                                                                                                           
      }
    }
  ){
    criterion {
        _nodeId
        createdBy
        id
        name
        type
        parentId
        position
        idealValue
      }
  }
}
`

export const DELETE_CRITERIA = gql`
  mutation deleteCriterion($nodeId: ID!){
    deleteCriterion(
      input: {
        _nodeId: $nodeId
      }
    ){
        deletedCriterionId
    }
  }
`


export const UPDATE_CRITERIA = gql`
  mutation updateCriterion(
    $nodeId: ID!
    $name: String!
    $type: Types
    $position: [Positions] 
    $idealValue: Int
    $parentId: Int

  ){
    updateCriterion(
      input: {
        _nodeId: $nodeId,
        criterionPatch: {
            name: $name,
            type: $type,
            position: $position, 
  idealValue: $idealValue,
  parentId: $parentId
        }
      }
    ){
        criterion {
            _nodeId
            createdBy
            id
            name
            type
            position
            parentId
        idealValue
        }
    }
  }
`

export const QUERY_ALL_SUB_CRITERIA = gql`
query allSubCriteria($first: Int!, $after: Cursor, $before: Cursor, $last: Int, $offset: Int, $condition: SubCriterionCondition, $orderBy: [SubCriteriaOrderBy!])
{
  allSubCriteria(first: $first, after: $after, before: $before, last: $last, offset: $offset, condition: $condition , orderBy: $orderBy ){
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
      id
      name
      value
      parentId
    }
  }
}


`

export const GET_CRITERIA = gql`
  query getCriteria($nodeId: ID!){
    criterion(_nodeId: $nodeId) {
      id
      name
      createdBy
      _nodeId
      type
            position
        idealValue    
        parentId                                                                                                        
    }
  }
`

export const GET_CRITERIA_WITH_CHILDS = gql`query MyQuery($contains: [Positions]) {
  allCategories {
    nodes {
      _nodeId
      id
      percentage
      title
      subCriteria: criteriaByParentId(filter: {position: {contains: $contains}})   {
        nodes {
          _nodeId
          name
          id
          idealValue
          type
          position
          parentId
          values: subCriteriaByParentId {
            nodes {
              id
              name
              value
              _nodeId
            }
            totalCount
          }
        }
        totalCount
      }
    }
    totalCount
  }
}

`


export const GET_CRITERIA_WITH_ALL_CHILDS = gql`query MyQuery{
  allCategories {
    nodes {
      _nodeId
      id
      percentage
      title
      subCriteria: criteriaByParentId {
        nodes {
          _nodeId
          name
          id
          idealValue
          type
          position
          parentId
          values: subCriteriaByParentId {
            nodes {
              id
              name
              _nodeId
            }
          }
        }
        totalCount
      }
    }
    totalCount
  }
}

`

/*

mutation {
  createSubCriterion(
    input: {subCriterion: {name: "< 2.5", parentId: 1, value: 10}}
  ) {
    subCriterion {
      _nodeId
      id
      name
      parentId
      value
    }
  }
}


*/

