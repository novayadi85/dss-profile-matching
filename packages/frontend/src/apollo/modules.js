import { gql } from "@apollo/client"

export const QUERY_ALL_MODULES = gql`query allModules($first: Int!, $after: Cursor, $before: Cursor, $last: Int, $offset: Int, $condition: ModuleCondition, $orderBy: [ModulesOrderBy!]){
  allModules(first: $first, after: $after, before: $before, last: $last, offset: $offset,condition: $condition, orderBy: $orderBy){
      nodes{
          id
          name
          design
      }
      totalCount
  }
}`