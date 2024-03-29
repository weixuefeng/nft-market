import { useTranslation } from 'react-i18next'
import { AdjustmentsIcon, CheckIcon } from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useQuery } from '@apollo/client'
import {
  AskOrder,
  AskOrderDataList,
  AuctionOrderStatus,
  NFTokenSaleType,
  OrderDirection,
  OrderStatus
} from '../../entities'
import { GET_ASK_ORDER_HISTORY } from '../../services/queries/askOrders'
import { cSymbol, pageShowSize, pageSize, POLLING_INTERVAL } from '../../constant'
import { useWeb3React } from '@web3-react/core'
import { getAskOrderFilterByTitle } from '../../functions/FilterOrderUtil'
import { DateTime, TimeDiff } from '../../functions/DateTime'
import { formatEther } from 'ethers/lib/utils'
import { useTokenDescription } from '../../hooks/useTokenDescription'
import { hexAddress2NewAddress } from '../../utils/NewChainUtils'
import { TARGET_CHAINID } from '../../constant/settings'
import { getNftDetailPath, splitTx } from '../../functions'
import transactor from '../../functions/Transactor'
import { useNFTExchangeContract } from '../../hooks/useContract'

export class SellDetail {
  payee: string = '-'
  payer: string = '-'
  itemFrom: string = '-'
  itemTo: string = '-'
  txTime: string = '-'
}

class SellInfo {
  orderInfo: AskOrder
  actionTitle: string
  activeTitle: string
  priceTitle: string
  priceInfo: string
  sellDetail: SellDetail
  sellType: NFTokenSaleType
}

class DirectionSellInfo extends SellInfo {
  constructor() {
    super()
    this.sellType = NFTokenSaleType.DIRECT_SALE
  }
  saleTime: number
  salePrice: string
}

class EnglishAuctionSellInfo extends SellInfo {
  constructor() {
    super()
    this.sellType = NFTokenSaleType.ENGLAND_AUCTION
  }
  duration: string
  startTime: number
  endTime: number
  startPrice: string
  numBids: number
}

export enum AuctionFilter {
  ALL = 'All',
  ACTIVE = 'Active',
  ACTION_REQUIRED = 'Action Required',
  SELL = 'Sells',
  AUCTIONS = 'Auctions',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',

  ON_SALE = 'On Sale',
  SALE_COMPLETED = 'Sale Completed',
  SALE_CANCELED = 'Sale Canceled',

  IN_AUCTION = 'In Auction',
  AUCTION_COMPLETED = 'Auction Completed',
  AUCTION_CANCELED = 'Auction Canceled',
  AUCTION_END_NO_BID = 'Auction Ended(No Bids)',
  AUCTION_END_PENDING_CLAIM = 'Auction Ended(Pending Claim)',
  AUCTION_END_CLAIM_EXPIRED = 'Auction Ended(Claim Expired)'
}

const filterOptions = [
  { title: AuctionFilter.ALL, current: true },
  { title: AuctionFilter.ON_SALE, current: false },
  { title: AuctionFilter.SALE_COMPLETED, current: false },
  { title: AuctionFilter.SALE_CANCELED, current: false },
  { title: AuctionFilter.IN_AUCTION, current: false },
  { title: AuctionFilter.AUCTION_COMPLETED, current: false },
  { title: AuctionFilter.AUCTION_CANCELED, current: false },
  { title: AuctionFilter.AUCTION_END_NO_BID, current: false },
  { title: AuctionFilter.AUCTION_END_PENDING_CLAIM, current: false },
  { title: AuctionFilter.AUCTION_END_CLAIM_EXPIRED, current: false }
]

export function TokenInfoCard(props) {
  const { orderInfo } = props
  const tokenMetaData = useTokenDescription(orderInfo.token.uri)
  return (
    <a href={getNftDetailPath(orderInfo.token.id)}>
      <div>
        <img src={tokenMetaData.tokenImage} />
      </div>
      <div>
        <h3>{tokenMetaData.tokenName}</h3>
        <p>
          {tokenMetaData.tokenName} #{orderInfo.token.tokenId}
        </p>
      </div>
    </a>
  )
}

export function getAuctionStatus(askOrder: AskOrder): AuctionOrderStatus {
  const now = Date.now()
  if (askOrder.status === OrderStatus.COMPLETED) {
    return AuctionOrderStatus.COMPLETED
  } else if (askOrder.status === OrderStatus.CANCELED) {
    return AuctionOrderStatus.CANCELED
  }
  // normal.
  if (now > askOrder.deadline) {
    return AuctionOrderStatus.NORMAL
  } else if (askOrder.deadline >= now && now < askOrder.claimDeadline) {
    return AuctionOrderStatus.AUCTION_END
  } else if (now >= askOrder.claimDeadline) {
    return AuctionOrderStatus.CLAIM_EXPIRED
  }
  return AuctionOrderStatus.NORMAL
}

export function getAuctionActiveStyle(orderStatus: AuctionOrderStatus) {
  switch (orderStatus) {
    case AuctionOrderStatus.NORMAL:
      return ''
    case AuctionOrderStatus.AUCTION_END:
      return 'red'
    case AuctionOrderStatus.CLAIM_EXPIRED:
      return ''
    case AuctionOrderStatus.CANCELED:
      return 'gray'
    case AuctionOrderStatus.COMPLETED:
      return 'green'
    default:
      return ''
  }
}

function SellOrder() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(filterOptions[0])
  const [pageNumber, setPageNumber] = useState(1)
  const [orderData, setOrderData] = useState<Array<AskOrder>>([])
  const [hasMore, setHasMore] = useState(false)
  const exchangeContract = useNFTExchangeContract()

  const { account } = useWeb3React()
  const now = parseInt(Date.now() / 1000 + '')
  let where = getAskOrderFilterByTitle(selected.title, account, now)
  const { data, error, loading, fetchMore } = useQuery<AskOrderDataList>(GET_ASK_ORDER_HISTORY, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: OrderDirection.DESC,
      where: where
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL,
    onCompleted: data => {
      let res = Object.assign([], data.askOrders)
      if (res.length.valueOf() > pageShowSize * pageNumber) {
        // has more
        res.pop()
        console.log(res)
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
        skip: orderData.length,
        first: pageSize,
        orderBy: 'createdAt',
        orderDirection: OrderDirection.DESC,
        where: where
      }
    })
  }

  function parseSellActionTitle(orderInfo: AskOrder): SellInfo {
    const now = Date.now() / 1000
    let sellInfo
    // parse direct sale info
    if (orderInfo.strategyType === NFTokenSaleType.DIRECT_SALE) {
      sellInfo = new DirectionSellInfo()
      sellInfo.orderInfo = orderInfo
      sellInfo.sellDetail = new SellDetail()
      sellInfo.saleTime = orderInfo.createdAt
      sellInfo.priceTitle = t('price')
      sellInfo.actionTitle = t('sell')
      sellInfo.salePrice = formatEther(orderInfo.price + '') + cSymbol()
      sellInfo.priceInfo = sellInfo.salePrice
      if (orderInfo.status === OrderStatus.NORMAL) {
        sellInfo.activeTitle = t('active')
      } else if (orderInfo.status === OrderStatus.COMPLETED) {
        sellInfo.activeTitle = t('completed')
        sellInfo.sellDetail.payee = hexAddress2NewAddress(account, TARGET_CHAINID)
        sellInfo.sellDetail.payer = hexAddress2NewAddress(orderInfo.finalBidder.id, TARGET_CHAINID)
        sellInfo.sellDetail.itemFrom = hexAddress2NewAddress(account, TARGET_CHAINID)
        sellInfo.sellDetail.itemTo = hexAddress2NewAddress(orderInfo.finalBidder.id, TARGET_CHAINID)
        sellInfo.sellDetail.txTime = DateTime(orderInfo.finalBidOrder?.createdAt)
      } else {
        sellInfo.activeTitle = t('canceled')
      }
      // parse english auction info
    } else if (orderInfo.strategyType === NFTokenSaleType.ENGLAND_AUCTION) {
      sellInfo = new EnglishAuctionSellInfo()
      sellInfo.actionTitle = t('auction')
      sellInfo.orderInfo = orderInfo
      sellInfo.sellDetail = new SellDetail()
      sellInfo.numBids = orderInfo.numBids
      sellInfo.startPrice = formatEther(orderInfo.startPrice + '') + cSymbol()
      sellInfo.startTime = DateTime(orderInfo.createdAt)
      sellInfo.endTime = DateTime(orderInfo.deadline)
      const diffTime = TimeDiff(orderInfo.createdAt, orderInfo.deadline, t)
      if (diffTime) {
        sellInfo.duration = diffTime
      }

      if (parseInt(orderInfo.numBids + '') === 0) {
        sellInfo.priceTitle = t('starting price')
        sellInfo.priceInfo = formatEther(orderInfo.startPrice + '') + cSymbol()
      } else {
        sellInfo.priceTitle = t('highest bid')
        sellInfo.priceInfo = formatEther(orderInfo.finalBidOrder.price + '') + cSymbol()
      }

      if (orderInfo.status.valueOf() === OrderStatus.NORMAL) {
        // activeTitle = ends in xxx
        if (orderInfo.deadline > now) {
          sellInfo.activeTitle = `${t('ends in s1')} ${DateTime(orderInfo.deadline)}`
        } else if (orderInfo.deadline <= now && orderInfo.claimDeadline > now) {
          sellInfo.activeTitle = `${t('claim_ends_in')} ${DateTime(orderInfo.claimDeadline)}`
        } else {
          sellInfo.activeTitle = t('expired')
        }
      } else if (orderInfo.status.valueOf() === OrderStatus.COMPLETED) {
        sellInfo.activeTitle = t('completed')
        sellInfo.sellDetail.payee = hexAddress2NewAddress(account, TARGET_CHAINID)
        sellInfo.sellDetail.payer = hexAddress2NewAddress(orderInfo.finalBidder.id, TARGET_CHAINID)
        sellInfo.sellDetail.itemFrom = hexAddress2NewAddress(account, TARGET_CHAINID)
        sellInfo.sellDetail.itemTo = hexAddress2NewAddress(orderInfo.finalBidder?.id, TARGET_CHAINID)
        sellInfo.sellDetail.txTime = DateTime(orderInfo.finalBidOrder?.createdAt)
      } else {
        sellInfo.activeTitle = t('canceled')
      }
    } else {
      console.error(`not match sale type`)
    }

    return sellInfo
  }

  function cancelAuction(askOrderHash: string) {
    transactor(exchangeContract.cancelByHash(askOrderHash), t, () => {})
  }

  function DirectSellCard(props) {
    const { sellInfo } = props
    const [direcSellInfo, setDirectSellInfo] = useState<DirectionSellInfo>(sellInfo)
    const orderStatus = direcSellInfo.orderInfo.status
    return (
      <li key={sellInfo.orderInfo.id}>
        <div className="head">
          <div className="type">
            <span>{direcSellInfo.actionTitle}</span>
          </div>
          <div className="extra">
            <span
              className={
                orderStatus === OrderStatus.NORMAL ? '' : orderStatus === OrderStatus.COMPLETED ? 'green' : 'gray'
              }
            >
              {direcSellInfo.activeTitle}
            </span>
          </div>
        </div>

        <div className="main">
          <TokenInfoCard orderInfo={direcSellInfo.orderInfo} />
          <div className="info">
            <dl>
              <div>
                <dt>{t('Listing Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('sale time')}</dt>
                    <dd>{DateTime(direcSellInfo.saleTime)}</dd>
                  </div>
                  <div>
                    <dt>{t('sale price')}</dt>
                    <dd>{direcSellInfo.salePrice}</dd>
                  </div>
                </dd>
              </div>
              <div>
                <dt>{t('Deal Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('payee')}</dt>
                    <dd>{splitTx(direcSellInfo.sellDetail.payee)}</dd>
                  </div>
                  <div>
                    <dt>{t('payer')}</dt>
                    <dd>{splitTx(direcSellInfo.sellDetail.payer)}</dd>
                  </div>
                  <div>
                    <dt>{t('item from')}</dt>
                    <dd>{splitTx(direcSellInfo.sellDetail.itemFrom)}</dd>
                  </div>
                  <div>
                    <dt>{t('item to')}</dt>
                    <dd>{splitTx(direcSellInfo.sellDetail.itemTo)}</dd>
                  </div>
                  <div>
                    <dt>{t('tx_time')}</dt>
                    <dd>{direcSellInfo.sellDetail.txTime}</dd>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="footer" hidden={orderStatus === OrderStatus.CANCELED}>
          <div>
            <div className="label">{direcSellInfo.priceTitle}</div>
            <div className="price">{direcSellInfo.priceInfo}</div>
          </div>
          <div>
            <button
              type="button"
              className="primary small yellow"
              hidden={orderStatus === OrderStatus.COMPLETED}
              onClick={() => cancelAuction(direcSellInfo.orderInfo.id)}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </li>
    )
  }

  function checkAuctionCanCancel(orderInfo: AskOrder) {
    const now = Date.now() / 1000
    if (parseInt(orderInfo.numBids + '') === 0) {
      return true
    } else {
      if (now > orderInfo.claimDeadline && orderInfo.status === OrderStatus.NORMAL) {
        return true
      } else {
        return false
      }
    }
  }

  function EnglishAuctionSellCard(props) {
    const { sellInfo } = props
    const [englishAuctionSellInfo, setEnglishAuctionSellInfo] = useState<EnglishAuctionSellInfo>(sellInfo)
    const orderStatus = getAuctionStatus(englishAuctionSellInfo.orderInfo)
    const activeStyle = getAuctionActiveStyle(orderStatus)
    const canCancel = checkAuctionCanCancel(englishAuctionSellInfo.orderInfo)
    return (
      <li key={sellInfo.orderInfo.id}>
        <div className="head">
          <div className="type">
            <span> {englishAuctionSellInfo.actionTitle}</span>
          </div>
          <div className="extra">
            <span className={activeStyle}>{englishAuctionSellInfo.activeTitle}</span>
          </div>
        </div>
        <div className="main">
          <TokenInfoCard orderInfo={englishAuctionSellInfo.orderInfo} />
          <div className="info">
            <dl>
              <div>
                <dt>{t('Listing Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('Duration')}</dt>
                    <dd>{englishAuctionSellInfo.duration}</dd>
                  </div>
                  <div>
                    <dt>{t('start time')}</dt>
                    <dd>{englishAuctionSellInfo.startTime}</dd>
                  </div>
                  <div>
                    <dt>{t('end time')}</dt>
                    <dd>{englishAuctionSellInfo.endTime}</dd>
                  </div>
                  <div>
                    <dt>{t('starting price')}</dt>
                    <dd>{englishAuctionSellInfo.startPrice}</dd>
                  </div>
                  <div>
                    <dt>{t('numBids')}</dt>
                    <dd>{englishAuctionSellInfo.numBids}</dd>
                  </div>
                </dd>
              </div>
              <div>
                <dt>{t('Deal Detail')}</dt>
                <dd>
                  <div>
                    <dt>{t('payee')}</dt>
                    <dd>{splitTx(englishAuctionSellInfo.sellDetail.payee)}</dd>
                  </div>
                  <div>
                    <dt>{t('payer')}</dt>
                    <dd>{splitTx(englishAuctionSellInfo.sellDetail.payer)}</dd>
                  </div>
                  <div>
                    <dt>{t('item from')}</dt>
                    <dd>{splitTx(englishAuctionSellInfo.sellDetail.itemFrom)}</dd>
                  </div>
                  <div>
                    <dt>{t('item to')}</dt>
                    <dd>{splitTx(englishAuctionSellInfo.sellDetail.itemTo)}</dd>
                  </div>
                  <div>
                    <dt>{t('tx_time')}</dt>
                    <dd>{englishAuctionSellInfo.sellDetail.txTime}</dd>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="footer" hidden={orderStatus === AuctionOrderStatus.CANCELED}>
          <div>
            <div className="label">{englishAuctionSellInfo.priceTitle}</div>
            <div className="price">{englishAuctionSellInfo.priceInfo}</div>
          </div>
          <div>
            <button
              hidden={!canCancel}
              type="button"
              className="primary small yellow"
              onClick={() => cancelAuction(englishAuctionSellInfo.orderInfo.id)}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </li>
    )
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{t('Sell Orders')}</h2>
        </div>

        <div className="flex">
          <OrdersFilter selected={selected} setSelected={setSelected} callBack={() => setPageNumber(1)} />
        </div>
      </div>

      <section>
        <ul className="list orders">
          {orderData
            .map(orderInfo => parseSellActionTitle(orderInfo))
            .map(sellInfo =>
              sellInfo.sellType === NFTokenSaleType.DIRECT_SALE ? (
                <DirectSellCard key={sellInfo.orderInfo.id} sellInfo={sellInfo} />
              ) : (
                <EnglishAuctionSellCard key={sellInfo.orderInfo.id} sellInfo={sellInfo} />
              )
            )}
        </ul>
        {orderData.length === 0 ? <>{t('no data')}</> : <></>}
        <button hidden={!hasMore} className="tertiary outline small" onClick={() => onFetchMore()}>
          {t('load more')}
        </button>
      </section>
    </>
  )
}

export default SellOrder

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
  const { selected, setSelected, callBack } = props

  return (
    <Listbox
      value={selected}
      onChange={value => {
        setSelected(value)
        callBack()
      }}
    >
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
