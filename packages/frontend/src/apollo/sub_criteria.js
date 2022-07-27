import { gql } from '@apollo/client'

export const ADD_SUB_CRITERIA = gql`
mutation createSubCriterion(
  $name: String!
  $value: Int
  $parentId: Int 
){
    createSubCriterion(
        input: {
            subCriterion: {
                name: $name, 
                parentId: $parentId, 
                value: $value
            }
        }
      ) {
        subCriterion {
          _nodeId
          id
          name
          parentId
          value
          createdBy
        }
      }
    
}
`

export const DELETE_SUB_CRITERIA = gql`
  mutation deleteSubCriterion($nodeId: ID!){
    deleteSubCriterion(
      input: {
        _nodeId: $nodeId
      }
    ){
        deletedSubCriterionId
    }
  }
`


export const UPDATE_SUB_CRITERIA = gql`
mutation updateSubCriterion(
    $nodeId: ID!
    $name: String!
    $value: Int
    $parentId: Int 
    $id: Int!
  ){
    updateSubCriterion(
          input: {
            _nodeId: $nodeId,
            subCriterionPatch: {
                  name: $name, 
                  parentId: $parentId, 
                  value: $value
              }
          }
        ) {
          query {
            criterionById(id: $id) {
              _nodeId
            }
          }

          subCriterion {
            _nodeId
            id
            name
            parentId
            value
            createdBy
          }
        }
      
  }
`



export const GET_SUB_CRITERIA = gql`
  query getSubCriteria($nodeId: ID!){
    subCriterion(_nodeId: $nodeId) {
        _nodeId
        id
        name
        parentId
        value
        createdBy      
        criterionByParentId {
          _nodeId
        }                                                                                                   
    }
  }
`

export const GET_CRITERIA_AND_SUBS = gql`
  query allCriteria($first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int){
  allCriteria(first: $first, after: $after, before: $before, last: $last, offset: $offset) {
    nodes {
      _nodeId
      name
      subCriteriaByParentId {
        nodes {
          name
          _nodeId
          id
        }
      }
    }
  }
}
`