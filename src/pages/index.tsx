import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import { NFTokenDataList, OrderDirection } from '../entities'
import { NFT_TOKEN_LIST } from '../services/queries/list'
import { pageSize, POLLING_INTERVAL } from '../constant'
import { useState } from 'react'
import NFTList from '../components/lists/NFTList'
import { FILTER_START_BLOCK } from '../constant/settings'

export default function Home() {
  const { t } = useTranslation()
  const [orderBy, setOrderBy] = useState('mintBlock')
  const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC)
  const where = { mintBlock_gt: FILTER_START_BLOCK }
  const [filter, setFilter] = useState(where)
  const { loading, data, fetchMore, error } = useQuery<NFTokenDataList>(NFT_TOKEN_LIST, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: orderBy,
      orderDirection: orderDirection,
      where: filter
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL
  })

  if (error) {
    console.log(error)
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
        skip: data.tokens.length
      }
    })
  }

  const info = {
    data: uniqData,
    onFetchMore,
    setOrderBy,
    setOrderDirection,
    setFilter,
    where
  }
  return <NFTList {...info} />
}
