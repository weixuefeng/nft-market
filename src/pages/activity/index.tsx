import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  ArrowSmRightIcon,
  HandIcon,
  TagIcon,
  SwitchHorizontalIcon,
  ShoppingCartIcon,
  XCircleIcon,
  CheckIcon,
  AdjustmentsIcon,
  SparklesIcon
} from '@heroicons/react/solid'
import React, { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useQuery } from '@apollo/client'
import { GET_TRADING_HISTORY } from '../../services/queries/tradeHistory'
import { cSymbol, pageShowSize, pageSize, POLLING_INTERVAL } from '../../constant'
import { PriceEvent, TradingHistoryList } from '../../entities'
import { useTokenDescription } from '../../hooks/useTokenDescription'
import { getNftDetailPath, getTradingStatus } from '../../functions'
import NewAddress from '../../components/layouts/NewAddress'
import { RelativeTimeLocale } from '../../functions/DateTime'
import { formatEther } from 'ethers/lib/utils'
import { logPageView } from '../../functions/analysis'

const filterOptions = [
  { title: 'All', current: true },
  { title: 'Minted', current: false },
  { title: 'Ask', current: false },
  { title: 'Sale', current: false },
  { title: 'Transfer', current: false },
  { title: 'Bid', current: false },
  { title: 'Cancel', current: false }
]

function TokenMetaInfo(props) {
  const { tradingHistory } = props
  if (!tradingHistory.token.black) {
    const tokenMetaData = useTokenDescription(tradingHistory.token.uri)
    const [contractAddress, tokenId] = tradingHistory.token.id.split('-')
    return (
      <div className="b">
        <Link href={getNftDetailPath(tradingHistory.token.id)}>
          <a>
            <img src={tokenMetaData.tokenImage} />
            <div className="item">
              <p>{tokenMetaData.tokenName}</p>
              <p>
                {tradingHistory.token.contract.name} (#{tokenId})
              </p>
            </div>
          </a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="b">
        <a>
          <img src="/image/error.png" />
          <div className="item">
            <p>-</p>
            <p>-</p>
          </div>
        </a>
      </div>
    )
  }
}

function EventIcon(props) {
  const { event } = props
  let res = <></>
  switch (event) {
    case PriceEvent.Ask:
      res = <ShoppingCartIcon />
      break
    case PriceEvent.Bid:
      res = <HandIcon />
      break
    case PriceEvent.Burn:
      res = <XCircleIcon />
      break
    case PriceEvent.Cancel:
      res = <XCircleIcon />
      break
    case PriceEvent.Offer:
      res = <SwitchHorizontalIcon />
      break
    case PriceEvent.Minted:
      res = <SparklesIcon />
      break
    case PriceEvent.Sale:
      res = <TagIcon />
      break
    case PriceEvent.Transfer:
      res = <SwitchHorizontalIcon />
      break
    default:
      break
  }
  return res
}

function getFilterByTitle(title) {
  let where = {}
  switch (title) {
    case 'All':
      where = {}
      break
    default:
      where = { event: title }
  }
  return where
}

export default function Activity() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(filterOptions[0])
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const where = getFilterByTitle(selected.title)
  const [tradingHistoryData, setTradingHistoryData] = useState([])

  useEffect(() => {
    logPageView()
  }, [])

  const { loading, error, data, fetchMore } = useQuery<TradingHistoryList>(GET_TRADING_HISTORY, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      where: where
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL,
    onCompleted: tradingHistoryList => {
      const listData = tradingHistoryList.tradingHistories
      if (listData.length > pageShowSize * pageNumber) {
        // has more
        const res = listData.slice()
        res.pop()
        setHasMore(true)
        setTradingHistoryData(res)
      } else {
        setHasMore(false)
        setTradingHistoryData(listData)
      }
    }
  })

  function onFetchMore() {
    setPageNumber(pageNumber + 1)
    fetchMore({
      variables: {
        skip: tradingHistoryData.length
      }
    })
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{t('Activity')}</h2>
        </div>

        <div className="flex">
          <ActivityFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>

      <div className="activity-list">
        <ul role="list">
          {tradingHistoryData.map(tradingHistory => (
            <li key={tradingHistory.id}>
              <div>
                <div>
                  <div className="a">
                    <div className={'event ' + tradingHistory.event}>
                      <p>
                        <EventIcon event={tradingHistory.event} />
                        {getTradingStatus(tradingHistory.event, t)}
                      </p>
                    </div>
                    <div className="amount">
                      <p>
                        {formatEther(tradingHistory.price + '')} {cSymbol()}
                      </p>
                    </div>
                  </div>

                  <TokenMetaInfo tradingHistory={tradingHistory} />
                  <div className="c">
                    <div>
                      <p>
                        <NewAddress size={'short'} address={tradingHistory.from} />
                        <ArrowSmRightIcon />
                        <NewAddress size={'short'} address={tradingHistory.to} />
                      </p>
                    </div>
                    <p className="time">{RelativeTimeLocale(tradingHistory.createdAt, t('time locale'))}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button className="tertiary outline small" onClick={onFetchMore} disabled={loading} hidden={!hasMore}>
        {loading ? t('loading') : t('load more')}
      </button>
    </>
  )
}

const ActivityFilter = props => {
  return (
    <nav className="subnav">
      <div className="menu"></div>
      <div className="options">
        <ActivityFilterMenu {...props} />
      </div>
    </nav>
  )
}

const ActivityFilterMenu = props => {
  let { t } = useTranslation()
  const { selected, setSelected } = props

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className="filter-menu">
          <Listbox.Button className="dropdown-btn">
            <span>{getTradingStatus(selected.title, t)}</span>
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
                  <p>{getTradingStatus(option.title, t)}</p>
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
