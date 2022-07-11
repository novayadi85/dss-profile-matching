import { gql } from '@apollo/client'
export const QUERY_ALL_BANKS = gql`query allBanks($first: Int!, $after: Cursor, $before: Cursor, $last: Int, $offset: Int, $condition: BankCondition, $orderBy: [BanksOrderBy!]) {
  allBanks(first: $first, after: $after, before: $before, last: $last, offset: $offset,condition: $condition, orderBy: $orderBy   ){
      nodes{
        id
        name
      }
      totalCount
    }
  }`
