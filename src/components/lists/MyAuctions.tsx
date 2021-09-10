/**
 * @author weixuefeng@diynova.com
 * @time  2021/9/9 7:49 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { useTranslation } from 'react-i18next'
import { Listbox, Transition } from '@headlessui/react'
import { AdjustmentsIcon, CheckIcon } from '@heroicons/react/outline'
import { default as React, Fragment, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ASK_ORDER_HISTORY } from '../../services/queries/askOrders'
import { AskOrderDataList, NFTokenSaleType, OrderDirection, OrderStatus} from '../../entities'
import { cSymbol, pageSize, POLLING_INTERVAL } from '../../constant'
import { useWeb3React } from '@web3-react/core'
import { getNftDetailPath } from '../../functions'
import { useTokenDescription } from '../../hooks/useTokenDescription'
import { DateTime} from '../../functions/DateTime'
import { formatEther } from 'ethers/lib/utils'
import transactor from '../../functions/Transactor'
import { useNFTExchangeContract } from '../../hooks/useContract'

enum AuctionFilter {
  IN_AUCTION = "in auction",
  COMPLETED = "ended",
  CANCELED = "canceled",
  ALL = "all"
}

const filterOptions = [
  { title: AuctionFilter.ALL },
  { title: AuctionFilter.IN_AUCTION },
  { title: AuctionFilter.COMPLETED },
  { title: AuctionFilter.CANCELED }
]

const MyAuctionsNavFilter = props => {
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

const MyAuctionsSubNav = props => {
  return (
    <nav className="subnav">
      <div className="menu"></div>
      <div className="options">
        <MyAuctionsNavFilter {...props} />
      </div>
    </nav>
  )
}

const MyAuctionsRow = props => {
  const { auction } = props
  const { t } = useTranslation()
  const tokenMetaData = useTokenDescription(auction.token.uri)

  function getAuctionStatus() {
    if (auction.status === OrderStatus.CANCELED) {
      return <span className={'canceled'}>{t('canceled')}</span>
    }
    if (auction.status === OrderStatus.NORMAL) {
      return <span className={'in-auction'}>{t('in auction')}</span>
    }
    if (auction.status === OrderStatus.COMPLETED) {
      return <span className={'ended'}>{t('ended')}</span>
    }
    return null
  }

  function auctionTime() {
    if (auction.status === OrderStatus.NORMAL) {
      return (
        <span className={'in-auction'} title={DateTime(auction.deadline)}>
          {t('ends in s1', {
            s1: DateTime(auction.deadline)
          })}
        </span>
      )
    }
    if (auction.status === OrderStatus.COMPLETED) {
      return (
        <span className={'ended'} title={DateTime(auction.deadline)}>
          {DateTime(auction.deadline)}
        </span>
      )
    }
    return null
  }

  function auctionTotalBids() {
    return auction.numBids !== null ? <>{auction.numBids}</> : '-'
  }

  function auctionHighestBid() {
    return auction.finalBidOrder !== null ? (
      <>
        {formatEther(auction.finalBidOrder.price)} {cSymbol()}
      </>
    ) : (
      '-'
    )
  }
  const exchangeContract = useNFTExchangeContract()

  function cancelAuction() {
    const askHash = auction.id
    transactor(exchangeContract.cancelByHash(askHash), t, () => {})
  }

  function auctionAction() {
    if (
      (auction.numBids == null ||
        parseInt(auction.numBids) === 0 ||
        (auction.status === OrderStatus.NORMAL &&
          auction.claimDeadline !== 0 &&
          auction.claimDeadline < Date.now() / 1000)) &&
      auction.status !== OrderStatus.CANCELED
    ) {
      return (
        <a
          onClick={() => {
            cancelAuction()
          }}
        >
          {t('put off sale')}
        </a>
      )
    } else {
      return <a href={getNftDetailPath(auction.token.id)}>{t('view nft')}</a>
    }
  }

  function auctionExchangeTx() {
    return (
      <>
        <p>
          {auction.tokenExchangeTx != null ? (
            <>
              {/*{<NewAddress address={auction.owner} size='short' />} →{" "}*/}
              {/*{<NewAddress address={auction.highestBidder} size='short' />}*/}
            </>
          ) : (
            '-'
          )}
        </p>
        <p>
          {/*{auction.tokenExchangeTx ? (*/}
          {/*  <a*/}
          {/*    href={getTxExplorerUrl(auction.tokenExchangeTx)}*/}
          {/*    target='_blank'*/}
          {/*    rel='noopener noreferrer'*/}
          {/*    alt={t("view in explorer")}*/}
          {/*  >*/}
          {/*    {t("view in explorer")}*/}
          {/*  </a>*/}
          {/*) : null}*/}
        </p>
      </>
    )
  }

  return (
    <tr>
      <td>
        <a
          href={getNftDetailPath(auction.token.id)}
          className="nft-info"
          title={'Universal #' + auction.token.id + ' ' + tokenMetaData.tokenName}
        >
          <img src={tokenMetaData.tokenImage} alt="" />
          <p>{tokenMetaData.tokenName}</p>
        </a>
        <p>
          <span className="status">{getAuctionStatus()}</span>
          <span className="time">{auctionTime()}</span>
        </p>
      </td>

      <td>{auctionTotalBids()}</td>
      <td>{auctionHighestBid()}</td>
      <td className="action">{auctionAction()}</td>
      <td>{auctionExchangeTx()}</td>
    </tr>
  )
}

const MyAuctionsList = props => {
  const { account } = useWeb3React()
  const { selected } = props
  const { t } = useTranslation()

  let where = null
  if(selected.title === AuctionFilter.IN_AUCTION) {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null,
      status: OrderStatus.NORMAL
    }
  } else if (selected.title === AuctionFilter.CANCELED) {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null,
      status: OrderStatus.CANCELED
    }
  } else if(selected.title === AuctionFilter.COMPLETED) {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null,
      status: OrderStatus.COMPLETED
    }
  } else {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null
    }
  }


  const { data, error, loading, fetchMore } = useQuery<AskOrderDataList>(GET_ASK_ORDER_HISTORY, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: OrderDirection.DESC,
      where: where
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL
  })

  if (loading) {
    return <>Loading...</>
  }
  if (error) {
    return <>Error :(</>
  }

  const myAuctionsData = data.askOrders

  const onFetchMore = () => {
    fetchMore({ variables: { skip: myAuctionsData.length } })
  }

  return (
    <>
      <div className="my-bids-table">
        <div>
          <table>
            <thead>
              <tr>
                <th>{t('auction')}</th>
                <th>{t('bids')}</th>
                <th>{t('highest bid')}</th>
                <th className="action">{t('action')}</th>
                <th>{t('deal transaction')}</th>
              </tr>
            </thead>
            <tbody>
              {myAuctionsData.length > 0 &&
                myAuctionsData.map(auction => <MyAuctionsRow key={auction.id} auction={auction} />)}

              {myAuctionsData.length === 0 && (
                <tr>
                  <td colSpan={5}>{t('no records')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={onFetchMore} className="secondary small">
        {t('load more')}
      </button>
    </>
  )
}

export function MyAuctions(props) {
  const [selected, setSelected] = useState(filterOptions[0])
  return (
    <>
      <MyAuctionsSubNav selected={selected} setSelected={setSelected} />
      <MyAuctionsList selected={selected} />
    </>
  )
}
