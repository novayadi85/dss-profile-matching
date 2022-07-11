import { gql } from "@apollo/client";

export const QUERY_ALL_MODULES_WORKFLO = gql`query allModules($first: Int!, $after: Cursor, $before: Cursor, $last: Int, $offset: Int, $condition: ModuleCondition, $orderBy: [ModulesOrderBy!]){
    allModules(first: $first, after: $after, before: $before, last: $last, offset: $offset,condition: $condition, orderBy: $orderBy, filter: {id: {in:[2, 7, 8, 9]}}){
        nodes{
            id
            name
            design
            workflowsByModuleId {
                totalCount
            }
        }
        totalCount
    }
  }`


export const MUTATION_SINGLEUPLOAD = gql`mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      content
    }
  }`

export const REGISTER_FLOW = gql`query registerWorkFlow{
    allTblRoles{
        nodes{
            _nodeId
            id
            name
        }
    }  
}`