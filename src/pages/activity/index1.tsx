import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  ArrowSmRightIcon,
  ShoppingCartIcon,
  HandIcon,
  TagIcon,
  SwitchHorizontalIcon,
  XCircleIcon,
  CheckIcon,
  AdjustmentsIcon
} from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useQuery } from '@apollo/client'
import { GET_ASK_ORDER_HISTORY } from '../../services/queries/askOrders'
import { GET_TRADING_HISTORY } from '../../services/queries/tradeHistory'
import { pageSize, POLLING_INTERVAL } from '../../constant'
import { TradingHistory, TradingHistoryList } from '../../entities'
import { useTokenDescription } from '../../hooks/useTokenDescription'
import getAssetPathFromRoute from 'next/dist/shared/lib/router/utils/get-asset-path-from-route'
import { getNftDetailPath } from '../../functions'
import NewAddress from '../../components/layouts/NewAddress'

const filterOptions = [
  { title: 'All', current: true },
  { title: 'Sale', current: false },
  { title: 'Auction', current: false },
  { title: 'Buy', current: false },
  { title: 'Bid', current: false }
]

const lists = [
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'sale',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'cancel sale',
    amount: '',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'buy',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'auction',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'cancel auction',
    amount: '',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'bid',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'claim auction',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'transfer',
    amount: '',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  }
]

function TokenMetaInfo(props) {
  const { tradingHistory } = props
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
}

export default function Activity() {
  const [selected, setSelected] = useState(filterOptions[0])
  const [tradingHistoryData, setTradingHistoryData] = useState([])
  const { loading, error, data } = useQuery<TradingHistoryList>(GET_TRADING_HISTORY, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL,
    onCompleted: tradingHistoryList => {
      const listData = tradingHistoryList.tradingHistories
      if (listData.length > 0) {
        setTradingHistoryData(listData)
      }
    }
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Activity</h2>
        </div>

        <div className="flex">
          <ActivityFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>

      <div className="activity-list">
        <ul role="list">
          {tradingHistoryData.map(tradingHistory => (
            <li>
              <div>
                <div>
                  <div className="a">
                    <div className={'event ' + tradingHistory.event}>
                      <p>
                        <ShoppingCartIcon />
                        {tradingHistory.event}
                      </p>
                    </div>
                    <div className="amount">
                      <p>{tradingHistory.amount}</p>
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
                    <p className="time">{tradingHistory.createdAt}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button className="tertiary outline small">load more</button>

      <div className="activity-list-legends">
        <p>Legends</p>
        <p>
          <ShoppingCartIcon /> Buy / Claim
        </p>
        <p>
          <TagIcon /> Sale / Auction
        </p>
        <p>
          <XCircleIcon /> Cancel Sale/Auction
        </p>
        <p>
          <HandIcon /> Bid
        </p>
        <p>
          <SwitchHorizontalIcon /> Transfer
        </p>
      </div>
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
