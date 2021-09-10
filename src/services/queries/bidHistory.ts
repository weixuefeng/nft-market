/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/20 4:46 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { gql } from '@apollo/client'

export const GET_BID_HISTORY = gql(`
  query getBidHistory($skip: Int, $first: Int, $orderBy: String, $orderDirection: String, $where: BidOrder_filter) {
    bidOrders(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      strategy
      strategyType
      auctionDeadline
      auctionClaimDeadline
      auctionBestBid
      askOrder {
        deadline
        id
        numBids
        status
        token {
          tokenId
          id
          uri
        }
        price
        finalBidder {
          id        
        }
      }
      bidder {
        id
      }
      amount
      price
      createdAt
      createdTx
      recipient {
        id
      }
      referrer {
        id
      }
    }
  }
`)
