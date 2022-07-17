import { gql } from '@apollo/client'
export const ADD_RATING = gql`
  mutation createRating(
    $createdAt: Datetime
    $result: JSON
    $week: Int
    $year: Int
    $position: Positions
    $playerId: Int
  ){
    createRating(
      input: {
        rating: {
            createdAt: $createdAt,  
            result: $result, 
            week: $week,
            year: $year,
            position: $position,                                                                                                                                                         
            playerId: $playerId                                                                                                                                                         
        }
      }
    ){
        rating {
            createdAt
            createdBy
            result
            week
            year
            position
            playerId
          }
    }
  }
  `
  
  export const ALL_RATINGS = gql`
  query allRatings($first: Int = 1, $orderBy: [RatingsOrderBy!] = CREATED_AT_DESC, $in: [Positions!] = []) {
    allRatings(filter: {position: {in: $in}}, orderBy: $orderBy, first: $first) {
      totalCount
      nodes {
        createdAt
        createdBy
        position
        result
        week
        year
      }
      pageInfo {
        endCursor
        hasPreviousPage
        hasNextPage
        startCursor
      }
    }
  }
  
`
