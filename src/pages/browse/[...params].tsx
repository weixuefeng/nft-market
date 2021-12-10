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
import { pageShowSize, pageSize, POLLING_INTERVAL } from '../../constant'
import NFTList from '../../components/lists/NFTList'
import { useRouter } from 'next/router'
import { getOrderInfo, getSaleModeInfo } from '../../functions/FilterOrderUtil'
import { useEffect, useState } from 'react'
import { logPageView } from '../../functions/analysis'

export default function Browse() {
  const { t } = useTranslation()
  const router = useRouter()
  const param = router.query.params || []

  useEffect(() => {
    logPageView()
  }, [])

  let orderIndex = 0
  let saleModeIndex = 0
  if (param.length === 2) {
    orderIndex = parseInt(param[0].toString().split('=')[1])
    saleModeIndex = parseInt(param[1].toString().split('=')[1])
  }
  const { orderBy, orderDirection } = getOrderInfo(orderIndex)
  const currentTimeStamp = parseInt(Date.now() / 1000 + '')
  const [timeNow, setTimeNow] = useState(currentTimeStamp)
  const where = getSaleModeInfo(saleModeIndex, timeNow)

  const [pageNumber, setPageNumber] = useState(1)
  const [tokenData, setTokenData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { loading, data, fetchMore, error } = useQuery<NFTokenDataList>(NFT_TOKEN_LIST, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: orderBy,
      orderDirection: orderDirection,
      where: where
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL,
    onCompleted: data => {
      const uniqData = uniqBy(data?.tokens ?? [], item => {
        return item.id
      })
      if (uniqData.length > pageShowSize * pageNumber) {
        // has more
        uniqData.pop()
        setHasMore(true)
        setTokenData(uniqData)
      } else {
        setHasMore(false)
        setTokenData(uniqData)
      }
    }
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

  function onFetchMore() {
    setPageNumber(pageNumber + 1)
    fetchMore({
      variables: {
        skip: tokenData.length,
        first: pageSize,
        orderBy: orderBy,
        orderDirection: orderDirection,
        where: where
      }
    })
  }

  const info = {
    data: tokenData,
    onFetchMore: hasMore ? onFetchMore : null,
    showSubNav: true,
    saleModeIndex: saleModeIndex,
    filterIndex: orderIndex,
    pageNumber,
    setPageNumber,
    setTimeNow,
    loading
  }
  return <NFTList {...info} />
}
