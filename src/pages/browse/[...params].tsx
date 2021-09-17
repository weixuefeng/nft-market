/**
 * @author weixuefeng@diynova.com
 * @time  2021/9/17 11:24 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import 'i18n'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import { NFTokenDataList } from '../../entities'
import { NFT_TOKEN_LIST } from '../../services/queries/list'
import { pageSize, POLLING_INTERVAL } from '../../constant'
import NFTList from '../../components/lists/NFTList'
import { useRouter } from 'next/router'
import { getOrderInfo, getSaleModeInfo } from '../../functions/FilterOrderUtil'

export default function Browse() {
  const { t } = useTranslation()
  const router = useRouter()
  const param = router.query.params || []

  let orderIndex = 0
  let saleModeIndex = 0
  if (param.length === 2) {
    orderIndex = parseInt(param[0].toString().split('=')[1])
    saleModeIndex = parseInt(param[1].toString().split('=')[1])
  }
  const { orderBy, orderDirection } = getOrderInfo(orderIndex)
  const where = getSaleModeInfo(saleModeIndex)

  const { loading, data, fetchMore, error } = useQuery<NFTokenDataList>(NFT_TOKEN_LIST, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: orderBy,
      orderDirection: orderDirection,
      where: where
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL
  })

  if (error) {
    return <p>Error :(</p>
  }

  function uniqBy(a, key) {
    let seen = new Set()
    return a.filter(item => {
      let k = key(item)
      return seen.has(k) ? false : seen.add(k)
    })
  }

  const uniqData = uniqBy(data?.tokens ?? [], item => {
    return item.id
  })

  function onFetchMore() {
    fetchMore({
      variables: {
        skip: data.tokens.length,
        first: pageSize,
        orderBy: orderBy,
        orderDirection: orderDirection
      }
    })
  }

  const info = {
    data: uniqData,
    onFetchMore,
    showSubNav: true,
    saleModeIndex: saleModeIndex,
    filterIndex: orderIndex
  }
  return <NFTList {...info} />
}
