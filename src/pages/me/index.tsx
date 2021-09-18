import { useTranslation } from 'react-i18next'
import { OrderDirection, OwnerPerDataList } from '../../entities'
import { useQuery } from '@apollo/client'
import { NFT_MY_TOKEN } from '../../services/queries/list'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { pageShowSize, pageSize, POLLING_INTERVAL } from '../../constant'
import NFTList from '../../components/lists/NFTList'
import { FilterIndex, SaleModeIndex } from '../../components/Menu/SubNavMenu'
import { useRouter } from 'next/router'

export enum ActiveTab {
  ME = 'me',
  MY_AUCTION = 'my-auctions',
  MY_BID = 'my-bids'
}

export function MenuOfMe(props) {
  const { t } = useTranslation()
  const router = useRouter()
  const { activeTab, setActiveTab } = props
  const [currentTab, setCurrentTab] = useState(activeTab)

  return (
    <nav className="subnav">
      <div className="menu">
        <a
          onClick={() => {
            setCurrentTab(ActiveTab.ME)
            setActiveTab(ActiveTab.ME)
            router.push('/me')
          }}
          className={currentTab === ActiveTab.ME ? 'active' : ''}
          aria-current="page"
        >
          {t('my nfts')}
        </a>
        <a
          onClick={() => {
            setCurrentTab(ActiveTab.MY_AUCTION)
            setActiveTab(ActiveTab.MY_AUCTION)
            router.push('/me/auctions')
          }}
          className={currentTab === ActiveTab.MY_AUCTION ? 'active' : ''}
          aria-current="page"
        >
          {t('my auctions')}
        </a>
        <a
          onClick={() => {
            setCurrentTab(ActiveTab.MY_BID)
            setActiveTab(ActiveTab.MY_BID)
            router.push('/me/bids')
          }}
          className={currentTab === ActiveTab.MY_BID ? 'active' : ''}
          aria-current="page"
        >
          {t('my bids')}
        </a>
      </div>

      <div className="options" hidden></div>
    </nav>
  )
}

function Index() {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)
  const [orderBy, setOrderBy] = useState('updateTime')
  const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC)
  const [pageNumber, setPageNumber] = useState(1)
  const [tokenData, setTokenData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const nftWhere = { owner: account ? account.toLowerCase() : null }
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
    pollInterval: POLLING_INTERVAL,
    onCompleted: data => {
      const uniqData = uniqBy(data?.ownerPerTokens.map(info => info.token) ?? [], item => {
        return item.id
      })
      const res = uniqData
      if (res.length > pageShowSize * pageNumber) {
        // has more
        res.pop()
        setHasMore(true)
        setTokenData(res)
      } else {
        setHasMore(false)
        setTokenData(res)
      }
    }
  })

  if (!account) {
    return <>Please Connect Wallet</>
  }

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
  const uniqData = uniqBy(data?.ownerPerTokens.map(info => info.token) ?? [], item => {
    return item.id
  })

  function onFetchMore() {
    setPageNumber(pageNumber + 1)
    fetchMore({
      variables: {
        skip: tokenData.length,
        first: pageSize,
        orderBy: orderBy,
        orderDirection: orderDirection,
        where: nftWhere
      }
    })
  }

  const info = {
    data: tokenData,
    onFetchMore: hasMore ? onFetchMore : null,
    saleModeIndex: SaleModeIndex.ALL,
    filterIndex: FilterIndex.PRICE_LOW_TO_HIGH,
    showSubNav: false,
    pageNumber
  }
  return (
    <>
      <MenuOfMe activeTab={ActiveTab.ME} setActiveTab={setActiveTab} />
      <NFTList {...info} />
    </>
  )
}

export default Index
