import { gql } from '@apollo/client'

export const QUERY_ALL_DEPARTMENT = gql`
  query allDepartments(
    $first: Int!
    $after: Cursor
    $before: Cursor
    $last: Int
    $offset: Int
    $condition: DepartmentCondition
    $filter: DepartmentFilter
    $orderBy: [DepartmentsOrderBy!]
  ) {
    allDepartments(
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
        userDepartmentsByDepartmentId {
          totalCount
        }
      }
      totalCount
    }
  }
`


export const GET_DEPARTMENT = gql`
  query getDepartment($nodeId: ID!){
    department(_nodeId: $nodeId){
      _nodeId
      id
      name
      description
    }
  }
`


export const ADD_DEPARTMENT = gql`
  mutation createDepartment(
    $name: String!
    $description: String
  ){
    createDepartment(
      input: {
        department: {
          name: $name,
          description: $description
        }
      }
    ){
      department {
        id
        name
      }
    }
  }
`
export const DELETE_DEPARTMENT = gql`
  mutation deleteDepartment($nodeId: ID!){
    deleteDepartment(
      input: {
        _nodeId: $nodeId
      }
    ){
      deletedDepartmentId
    }
  }
`


export const UPDATE_DEPARTMENT = gql`
  mutation updateDepartment(
    $nodeId: ID!
    $name: String
    $description: String
  ){
    updateDepartment(
      input: {
        _nodeId: $nodeId,
        departmentPatch: {
          name: $name,
          description: $description
        }
      }
    ){
      department {
        name
        description
      }
    }
  }
`