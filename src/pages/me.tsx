import { useTranslation } from 'react-i18next'
import { OrderDirection, OwnerPerDataList } from '../entities'
import { useQuery } from '@apollo/client'
import { NFT_MY_TOKEN } from '../services/queries/list'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { pageSize, POLLING_INTERVAL } from '../constant'
import NFTList from '../components/lists/NFTList'
import { MyAuctions } from '../components/lists/MyAuctions'
import { MyBidsList } from '../components/lists/MyBidsList'

enum ActiveTab {
  ME= "me",
  MY_AUCTION = "my-auctions",
  MY_BID = "my-bids"
}

function MenuOfMe (props) {
  const {t} = useTranslation()

  const { activeTab, setActiveTab} = props

  return (
    <nav className='subnav'>
      <div className='menu'>
        <a
          onClick={ () => setActiveTab(ActiveTab.ME) }
          className={activeTab === ActiveTab.ME ? "active" : ""}
          aria-current='page'
        >
          {t("my nfts")}
        </a>
        <a
          onClick={ () => setActiveTab(ActiveTab.MY_AUCTION)}
          className={activeTab === ActiveTab.MY_AUCTION ? "active" : ""}
          aria-current='page'
        >
          {t("my auctions")}
        </a>
        <a
          onClick={ () => setActiveTab(ActiveTab.MY_BID)}
          className={activeTab === ActiveTab.MY_BID ? "active" : ""}
          aria-current='page'
        >
          {t("my bids")}
        </a>
      </div>

      <div className='options' hidden></div>
    </nav>
  )
}

function Me() {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)
  const [orderBy, setOrderBy] = useState('amount')
  const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC)
  const nftWhere = { owner: account ? account.toLowerCase(): null}
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

  if (!account) {
    return <>Please Connect Wallet</>
  }

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
    where,
    showSubNav: false
  }
  return <>
    <MenuOfMe activeTab={ActiveTab.ME}
      setActiveTab={setActiveTab}
    />
    {
      activeTab === ActiveTab.ME
        ?
        <NFTList {...info} />
        :
        (activeTab === ActiveTab.MY_AUCTION ? <MyAuctions/> : <MyBidsList/>)
    }
  </>
}

export default Me
