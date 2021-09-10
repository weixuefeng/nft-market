/**
 * @author weixuefeng@diynova.com
 * @time  2021/9/10 11:06 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */

import { gql } from '@apollo/client'

export const GET_ASK_ORDER_HISTORY = gql(`
  query getAskOrders($skip: Int, $first: Int, $orderBy: String, $orderDirection: String, $where: AskOrder_filter) {
    askOrders(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      token {
        id
        uri
      }
      id
      startPrice
      deadline
      claimDeadline
      amount
      numBids
      price
      endPrice
      status
      finalBidOrder {
        price
      }
    }
  }
`)
