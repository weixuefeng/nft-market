/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 5:20 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */

import { gql } from '@apollo/client'
import client from './index'
import { NFTokenData } from '../../entities'

export const TOKEN_FIELDS = `
  fragment TokenFields on Token {
      id
      type
      owners {
        owner {
          id
        }
      }
      numOwners
      mintBlock
      mintTime
      minter
      mintTx
      uri
      forSale
      contract {
        id
        name
        type
      }
      tokenId
      amount
      strategyType
      price
      lastPrice
      lastOrderTime
      numSales
      hot
      black
      orders(where: { status: 1}) {
        id
        currency
        strategy
        strategyType
        recipient
        deadline
        price
        designee
        startPrice
        endPrice
        startBlock
        finalBidOrder {
          id
        }
        status
        owner {
          id
        }
      }
  }
`

export const NFT_TOKEN_LIST = gql(`
  ${TOKEN_FIELDS}
  query GetNFTList($skip: Int, $first: Int, $orderBy: String, $orderDirection: String, $where: Token_filter) {
    tokens(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      ...TokenFields
    }
  }
`)

export const NFT_TOKEN = gql(`
  ${TOKEN_FIELDS}
  query GetNFTToken($id: String) {
    token(id: $id) {
      ...TokenFields
    }
  }
`)

export const NFT_MY_TOKEN = gql(`
  ${TOKEN_FIELDS}
  query GetMyNFTToken($skip: Int, $first: Int, $orderBy: String, $orderDirection: String, $where: OwnerPerToken_filter) {
    ownerPerTokens(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      amount
      token {
        ...TokenFields
      }
    }
  }
`)

export function getTokenInfoById(tokenId) {
  return client.query<NFTokenData>({
    query: NFT_TOKEN,
    variables: {
      id: tokenId
    }
  })
}
