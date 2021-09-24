/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 5:29 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GRAPH_ENDPOINT } from '../../constant/settings'

function skipLimitPagination(keyArgs) {
  if (keyArgs === void 0) {
    keyArgs = false
  }
  return {
    keyArgs: keyArgs,
    merge: function (existing, incoming, _a) {
      let args = _a.args
      let merged = existing ? existing.slice(0) : []
      if (args) {
        let _b = args.skip,
          offset = _b === void 0 ? 0 : _b
        if (offset === 0) {
          merged = []
        }
        for (let i = 0; i < incoming.length; ++i) {
          merged[offset + i] = incoming[i]
        }
      } else {
        merged.push.apply(merged, incoming)
      }
      // console.log('merged:', merged)
      return merged
    }
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tokens: skipLimitPagination(['orderDirection', 'orderBy']),
          priceHistories: skipLimitPagination(['orderDirection', 'orderBy']),
          ownerPerTokens: skipLimitPagination(['orderDirection', 'orderBy']),
          tradingHistories: skipLimitPagination(['orderDirection', 'orderBy'])
        }
      }
    }
  }),
  uri: GRAPH_ENDPOINT
})

export default client
