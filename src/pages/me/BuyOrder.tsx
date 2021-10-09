import { useTranslation } from 'react-i18next'
import { AdjustmentsIcon, CheckIcon } from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useQuery } from '@apollo/client'
import { GET_BID_HISTORY } from 'services/queries/bidHistory'
import { cSymbol, pageShowSize, pageSize, POLLING_INTERVAL } from 'constant'
import { getBidOrderFilterByTitle } from 'functions/FilterOrderUtil'
import { useWeb3React } from '@web3-react/core'
import { BidderDataList, BidOrder, NFTokenSaleType, OrderStatus } from 'entities'
import { getAuctionActiveStyle, getAuctionStatus, SellDetail, TokenInfoCard } from './SellOrder'
import { hexAddress2NewAddress } from '../../utils/NewChainUtils'
import { TARGET_CHAINID } from '../../constant/settings'
import { formatEther } from 'ethers/lib/utils'
import { DateTime, RelativeTimeLocale, TimeDiff } from '../../functions/DateTime'
import { getNftDetailPath, splitTx } from '../../functions'
import transactor from '../../functions/Transactor'
import { useNFTExchangeContract } from '../../hooks/useContract'
import { useRouter } from 'next/router'

export enum BidOrderFilter {
  ALL = 'All',
  AUCTION_PENDING_CLAIM = 'Auction Pending Claim',
  BUY_NOW = 'Buys',
  AUCTION_BID = 'Auction Bids',
  BOUGHT = 'Bought',
  IN_AUCTION = 'In Auction',
  AUCTION_ENDED = 'Auction Ended',
  AUCTION_COMPLETED = 'Auction Completed'
}

class BidOrderInfo {
  orderInfo: BidOrder
  actionTitle: string
  activeTitle: string
  priceTitle: string
  priceInfo: string
  subPriceInfo: string
  sellDetail: SellDetail
  sellType: NFTokenSaleType
}

class DirectBidInfo extends BidOrderInfo {
  constructor(orderInfo: BidOrder) {
    super()
    this.orderInfo = orderInfo
    this.sellType = NFTokenSaleType.DIRECT_SALE
    this.sellDetail = new SellDetail()
  }
  saleTime: number
  salePrice: string
}

class EnglishAuctionBidInfo extends BidOrderInfo {
  constructor(orderInfo: BidOrder) {
    super()
    this.orderInfo = orderInfo
    this.sellDetail = new SellDetail()
    this.sellType = NFTokenSaleType.ENGLAND_AUCTION
  }
  duration: string
  startTime: number
  endTime: number
  startPrice: string
  numBids: number
  actionButton: JSX.Element
}

const filterOptions = [
  { title: BidOrderFilter.ALL, current: true },
  // ^ all orders

  { title: BidOrderFilter.BOUGHT, current: false },
  // ^ Bought, status = completed

  { title: BidOrderFilter.AUCTION_PENDING_CLAIM, current: false },
  // ^ auction && pending claim

  { title: BidOrderFilter.BUY_NOW, current: false },
  // ^ buy strategy

  { title: BidOrderFilter.AUCTION_BID, current: false },
  // ^ auction strategy

  { title: BidOrderFilter.IN_AUCTION, current: false }
]

function BuyOrder() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(filterOptions[0])
  const { account } = useWeb3React()
  const [pageNumber, setPageNumber] = useState(1)
  const [orderData, setOrderData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const exchangeContract = useNFTExchangeContract()
  const router = useRouter()
  const now = parseInt(Date.now() / 1000 + '')
  let where = getBidOrderFilterByTitle(selected.title, account, now)

  const { data, error, loading, fetchMore } = useQuery<BidderDataList>(GET_BID_HISTORY, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      where: where
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL,
    onCompleted: data => {
      let res = Object.assign([], data.bidOrders)
      if (res.length > pageShowSize * pageNumber) {
        // has more
        res.pop()
        setHasMore(true)
        setOrderData(res)
      } else {
        setHasMore(false)
        setOrderData(res)
      }
    }
  })

  function onFetchMore() {
    setPageNumber(pageNumber + 1)
    fetchMore({
      variables: {
        skip: orderData.length
      }
    })
  }
  function DirectBidCard(props) {
    const { bidOrderInfo } = props
    const [directBidOrderInfo, setDirectBidOrderInfo] = useState<DirectBidInfo>(bidOrderInfo)
    return (
      <li key={directBidOrderInfo.orderInfo.id}>
        <div className="head">
          <div className="type">
            <span>{directBidOrderInfo.actionTitle}</span>
          </div>
          <div className="extra">
            <span className="green">{directBidOrderInfo.activeTitle}</span>
          </div>
        </div>

        <div className="main">
          <TokenInfoCard orderInfo={directBidOrderInfo.orderInfo.askOrder} />

          <div className="info">
            <dl>
              <div>
                <dt>{t('Listing Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('sale time')}</dt>
                    <dd>{DateTime(directBidOrderInfo.saleTime)}</dd>
                  </div>
                  <div>
                    <dt>{t('sale price')}</dt>
                    <dd>{directBidOrderInfo.salePrice}</dd>
                  </div>
                </dd>
              </div>
              <div>
                <dt>{t('Deal Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('payee')}</dt>
                    <dd>{splitTx(directBidOrderInfo.sellDetail.payee)}</dd>
                  </div>
                  <div>
                    <dt>{t('payer')}</dt>
                    <dd>{splitTx(directBidOrderInfo.sellDetail.payer)}</dd>
                  </div>
                  <div>
                    <dt>{t('item from')}</dt>
                    <dd>{splitTx(directBidOrderInfo.sellDetail.itemFrom)}</dd>
                  </div>
                  <div>
                    <dt>{t('item to')}</dt>
                    <dd>{splitTx(directBidOrderInfo.sellDetail.itemTo)}</dd>
                  </div>
                  <div>
                    <dt>{t('tx_time')}</dt>
                    <dd>{directBidOrderInfo.sellDetail.txTime}</dd>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="footer">
          <div>
            <div className="label">{directBidOrderInfo.priceTitle}</div>
            <div className="price">{directBidOrderInfo.priceInfo}</div>
          </div>
          <div></div>
        </div>
      </li>
    )
  }

  function EnglishAuctionBidCard(props) {
    const { bidOrderInfo } = props
    const [englishAuctionBidInfo, setEnglishAuctionBidInfo] = useState<EnglishAuctionBidInfo>(bidOrderInfo)
    const orderStatus = getAuctionStatus(englishAuctionBidInfo.orderInfo.askOrder)
    const activeStyle = getAuctionActiveStyle(orderStatus)

    return (
      <li>
        <div className="head">
          <div className="type">
            <span>{englishAuctionBidInfo.actionTitle}</span>
          </div>
          <div className="extra">
            <span className={activeStyle}>{englishAuctionBidInfo.activeTitle}</span>
          </div>
        </div>

        <div className="main">
          <TokenInfoCard orderInfo={englishAuctionBidInfo.orderInfo.askOrder} />
          <div className="info">
            <dl>
              <div>
                <dt>{t('Listing Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('Duration')}</dt>
                    <dd>{englishAuctionBidInfo.duration}</dd>
                  </div>
                  <div>
                    <dt>{t('start time')}</dt>
                    <dd>{englishAuctionBidInfo.startTime}</dd>
                  </div>
                  <div>
                    <dt>{t('end time')}</dt>
                    <dd>{englishAuctionBidInfo.endTime}</dd>
                  </div>
                  <div>
                    <dt>{t('starting price')}</dt>
                    <dd>{englishAuctionBidInfo.startPrice}</dd>
                  </div>
                  <div>
                    <dt>{t('numBids')}</dt>
                    <dd>{englishAuctionBidInfo.numBids}</dd>
                  </div>
                </dd>
              </div>
              <div>
                <dt>{t('Deal Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('payee')}</dt>
                    <dd>{splitTx(englishAuctionBidInfo.sellDetail.payee)}</dd>
                  </div>
                  <div>
                    <dt>{t('payer')}</dt>
                    <dd>{splitTx(englishAuctionBidInfo.sellDetail.payer)}</dd>
                  </div>
                  <div>
                    <dt>{t('item from')}</dt>
                    <dd>{englishAuctionBidInfo.sellDetail.itemFrom}</dd>
                  </div>
                  <div>
                    <dt>{t('item to')}</dt>
                    <dd>{englishAuctionBidInfo.sellDetail.itemTo}</dd>
                  </div>
                  <div>
                    <dt>{t('tx_time')}</dt>
                    <dd>{englishAuctionBidInfo.sellDetail.txTime}</dd>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="footer">
          <div>
            <div className="label">{englishAuctionBidInfo.priceTitle}</div>
            <div className="price">{englishAuctionBidInfo.priceInfo}</div>
            <div className="label">{englishAuctionBidInfo.subPriceInfo}</div>
          </div>
          <div>{englishAuctionBidInfo.actionButton}</div>
        </div>
      </li>
    )
  }

  function claimItem(orderInfo) {
    const askOrderHash = orderInfo.askOrder.id
    const override = {
      value: orderInfo.price
    }
    transactor(exchangeContract.claimByHash(askOrderHash, override), t, () => {
      console.log()
    })
  }

  function makeBid(orderInfo) {
    const path = getNftDetailPath(orderInfo.askOrder.token.id)
    router.push(path)
  }

  function parseBidOrderInfo(orderInfo: BidOrder): BidOrderInfo {
    const now = Date.now() / 1000
    let bidOrderInfo
    if (orderInfo.strategyType === NFTokenSaleType.DIRECT_SALE) {
      bidOrderInfo = new DirectBidInfo(orderInfo)
      bidOrderInfo.saleTime = orderInfo.createdAt
      bidOrderInfo.priceTitle = t('price')
      bidOrderInfo.actionTitle = t('Buy')
      bidOrderInfo.salePrice = formatEther(orderInfo.price + '') + cSymbol()
      bidOrderInfo.priceInfo = bidOrderInfo.salePrice
      bidOrderInfo.activeTitle = t('completed')
      bidOrderInfo.sellDetail.payer = hexAddress2NewAddress(account, TARGET_CHAINID)
      // todo: check payee, item from, it's owner
      bidOrderInfo.sellDetail.payee = hexAddress2NewAddress(account, TARGET_CHAINID)
      bidOrderInfo.sellDetail.itemFrom = hexAddress2NewAddress(account, TARGET_CHAINID)
      bidOrderInfo.sellDetail.itemTo = hexAddress2NewAddress(account, TARGET_CHAINID)
      bidOrderInfo.sellDetail.txTime = DateTime(orderInfo.createdAt)

      // parse english bid info
    } else if (orderInfo.strategyType === NFTokenSaleType.ENGLAND_AUCTION) {
      bidOrderInfo = new EnglishAuctionBidInfo(orderInfo)
      bidOrderInfo.actionTitle = t('Auction Bids')
      bidOrderInfo.priceTitle = t('my bid')
      bidOrderInfo.priceInfo = formatEther(orderInfo.price + '') + cSymbol()
      // listing detail
      bidOrderInfo.startPrice = formatEther(orderInfo.askOrder.startPrice + '') + cSymbol()
      bidOrderInfo.startTime = DateTime(orderInfo.askOrder.createdAt)
      bidOrderInfo.endTime = DateTime(orderInfo.deadline)
      const diffTime = TimeDiff(orderInfo.createdAt, orderInfo.deadline, t)
      if (diffTime) {
        bidOrderInfo.duration = diffTime
      }
      bidOrderInfo.numBids = orderInfo.askOrder.numBids

      const isHigher = orderInfo.price === orderInfo.askOrder.bestPrice
      bidOrderInfo.subPriceInfo = `${t('Highest Bid')}: ${isHigher ? t('ME') + ' / ' : ''} ${
        formatEther(orderInfo.askOrder.bestPrice + '') + cSymbol()
      }`
      if (orderInfo.askOrder.status.valueOf() === OrderStatus.NORMAL) {
        // activeTitle = ends in xxx
        if (orderInfo.deadline > now) {
          bidOrderInfo.activeTitle = `${t('ends in s1')} ${DateTime(orderInfo.deadline)}`
          if (!isHigher) {
            bidOrderInfo.actionButton = (
              <button type="button" className="primary small yellow" onClick={() => makeBid(orderInfo)}>
                {t('raise bid')}
              </button>
            )
          }
        } else if (orderInfo.deadline <= now && orderInfo.claimDeadline > now) {
          bidOrderInfo.activeTitle = 'claim ends in: ' + DateTime(orderInfo.claimDeadline)
          if (isHigher) {
            bidOrderInfo.actionButton = (
              <button type="button" className="primary small green" onClick={() => claimItem(orderInfo)}>
                {t('claim item')}
              </button>
            )
          }
        } else {
          bidOrderInfo.activeTitle = t('expired')
        }
      } else if (orderInfo.askOrder.status.valueOf() === OrderStatus.COMPLETED) {
        bidOrderInfo.activeTitle = t('completed')
        bidOrderInfo.sellDetail.payer = hexAddress2NewAddress(orderInfo.askOrder.finalBidder.id, TARGET_CHAINID)
        bidOrderInfo.sellDetail.txTime = orderInfo.createdAt
      } else {
        bidOrderInfo.activeTitle = t('canceled')
      }
    } else {
      console.log(`not match sale type: ${orderInfo.strategyType}`)
    }
    return bidOrderInfo
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{t('Buy Orders')}</h2>
        </div>

        <div className="flex">
          <OrdersFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>

      <section>
        <ul className="list orders">
          {orderData
            .map(orderInfo => parseBidOrderInfo(orderInfo))
            .map(bidOrderInfo =>
              bidOrderInfo.sellType === NFTokenSaleType.DIRECT_SALE ? (
                <DirectBidCard bidOrderInfo={bidOrderInfo} />
              ) : (
                <EnglishAuctionBidCard bidOrderInfo={bidOrderInfo} />
              )
            )}
        </ul>
        <button hidden={!hasMore} className="tertiary outline small" onClick={() => onFetchMore()}>
          {t('load more')}
        </button>
      </section>
    </>
  )
}

export default BuyOrder

const OrdersFilter = props => {
  return (
    <nav className="subnav">
      <div className="menu"></div>
      <div className="options">
        <FilterMenu {...props} />
      </div>
    </nav>
  )
}

const FilterMenu = props => {
  let { t } = useTranslation()
  const { selected, setSelected } = props

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className="filter-menu">
          <Listbox.Button className="dropdown-btn">
            <span>{t(selected.title)}</span>
            <AdjustmentsIcon />
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options>
              {filterOptions.map(option => (
                <Listbox.Option
                  key={option.title}
                  className={({ active }) => (active ? 'active' : 'inactive')}
                  value={option}
                >
                  <p>{t(option.title)}</p>
                  <CheckIcon className="check-icon" />
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
