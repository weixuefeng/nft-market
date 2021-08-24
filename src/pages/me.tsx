import { useTranslation } from 'react-i18next'
import { OwnerPerDataList } from '../entities'
import { useQuery } from '@apollo/client'
import { NFT_MY_TOKEN } from '../services/queries/list'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { pageSize, POLLING_INTERVAL } from '../constant'
import NFTList from '../components/lists/NFTList'

function Me() {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  if (!account) {
    return <>Please Connect Wallet</>
  }
  const [orderBy, setOrderBy] = useState('amount')
  const [orderDirection, setOrderDirection] = useState('asc')
  const nftWhere = { owner: account.toLowerCase() }
  const where = {}
  const [filter, setFilter] = useState(where)
  const { loading, data, fetchMore, error } = useQuery<OwnerPerDataList>(NFT_MY_TOKEN, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: orderBy,
      orderDirection: orderDirection,
      where: nftWhere
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
  const uniqData = uniqBy(data?.ownerPerTokens.map(info => info.token) ?? [], item => {
    return item.id
  })

  function onFetchMore() {
    fetchMore({
      variables: {
        skip: data.ownerPerTokens.length,
        first: pageSize,
        orderBy: orderBy,
        orderDirection: orderDirection
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

export default Me
