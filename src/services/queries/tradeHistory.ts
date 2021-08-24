/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/19 9:01 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { gql } from '@apollo/client'

export const GET_PRICE_HISTORY = gql(`
  query getTradingHistory($skip: Int, $first: Int, $orderBy: String, $orderDirection: String, $where: TradingHistory_filter) {
    tradingHistories(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      event
      tokenId
      from
      to
      price
      createdAt
      createdTx
    }
  }
`)
