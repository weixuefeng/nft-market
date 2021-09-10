/**
 * @author weixuefeng@diynova.com
 * @time  2021/9/9 7:49 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Listbox, Transition } from '@headlessui/react'
import { AdjustmentsIcon, CheckIcon } from '@heroicons/react/outline'
import { useQuery } from '@apollo/client'
import { GET_BID_HISTORY } from '../../services/queries/bidHistory'
import { cSymbol, pageSize, POLLING_INTERVAL } from '../../constant'
import { useWeb3React } from '@web3-react/core'
import { BidderDataList, OrderStatus } from '../../entities'
import { getNftDetailPath } from '../../functions'
import { useTokenDescription } from '../../hooks/useTokenDescription'
import { formatEther } from 'ethers/lib/utils'
import { DateTime } from '../../functions/DateTime'

const filterOptions = [{ title: 'all' }, { title: 'need attention' }]

const MyBidsNavFilter = props => {
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

function MyBidsRow(props) {
  let { t } = useTranslation()
  let { bid } = props
  const tokenMetaData = useTokenDescription(bid.askOrder.token.uri)

  function onWithdrawBidClicked(e) {
    e.preventDefault()
  }

  function auctionStatus() {
    if (bid.askOrder.status === OrderStatus.NORMAL) {
      return <span className={'in-auction'}>{t('in auction')}</span>
    }
    if (bid.askOrder.status === OrderStatus.COMPLETED) {
      return <span className={'ended'}>{t('ended')}</span>
    }
    return null
  }

  function auctionTime() {
    if (bid.askOrder.status === OrderStatus.NORMAL) {
      return (
        <span className={'in-auction'}>
          {t('ends in')} {DateTime(bid.askOrder.deadline)}
        </span>
      )
    }
    if (bid.askOrder.status === OrderStatus.COMPLETED) {
      return (
        <span className={'ended'} title={DateTime(bid.askOrder.deadline)}>
          {DateTime(bid.askOrder.deadline)}
        </span>
      )
    }
    return null
  }

  function auctionRound() {
    // return t("round") + ": " + auction.round
  }

  function auctionWithdrawed() {
    // if (item.status === "ended" && bid.withdrawTx !== null) {
    //   return (
    //     <p>
    //       <a href={getTxExplorerUrl(bid.withdrawTx)} className='withdrawed' target='_blank' rel='noopener noreferrer'>
    //         {t("withdrawed")}
    //       </a>
    //     </p>
    //   )
    // } else {
    //   return null
    // }
    return null
  }

  function auctionExchangeTx() {
    return (
      <>
        <p>-</p>
      </>
    )
  }

  function auctionAction() {
    // if (item.status === "in-auction" && auction.highestBid !== bid.bid) {
    //   return (
    //     <ChangeBidModal
    //       auction={auction}
    //       item={{ ...item, image: tokenImage, name: tokenName }}
    //       myBidValueInNEW={myFundValueInNEW}
    //       asLink
    //     />
    //   )
    // }
    // if (item.status === "ended" && sameAddress(auction.highestBidder, address) && auction.tokenExchanged === false) {
    //   return (
    //     <a onClick={onWithdrawBidClicked} href='#nft-page'>
    //       {t("claim nft")}
    //     </a>
    //   )
    // }
    // if (
    //   item.status === "ended" &&
    //   !sameAddress(auction.highestBidder, address) &&
    //   myFundValueInNEW > 0 &&
    //   !bid.withdrawTx
    // ) {
    //   return (
    //     <a onClick={onWithdrawBidClicked} href='/'>
    //       {t("withdraw")}
    //     </a>
    //   )
    // }
    return <p>-</p>
  }

  return (
    <tr>
      <td>
        <a
          href={getNftDetailPath(bid.askOrder.token.id)}
          className="nft-info"
          title={'Universal #' + bid.askOrder.token.tokenId + ' ' + tokenMetaData.tokenName}
        >
          <img src={tokenMetaData.tokenImage} alt="" />
          <p>{tokenMetaData.tokenName}</p>
        </a>
        <p>
          <span className="status">{auctionStatus()}</span>
          <span className="time">{auctionTime()}</span>
        </p>
      </td>
      <td>{bid.askOrder.numBids}</td>
      <td>
        {formatEther(bid.askOrder.price)} {cSymbol()}
      </td>
      <td>
        <p>
          {formatEther(bid.price)} {cSymbol()}
        </p>
        {auctionWithdrawed()}
      </td>
      <td className="action">{auctionAction()}</td>
      <td>{auctionExchangeTx()}</td>
    </tr>
  )
}

const MyBidsList = props => {
  let { t } = useTranslation()
  const { selected } = props
  const { account } = useWeb3React()
  const where = { bidder: account ? account.toLowerCase() : null }
  const { loading, error, data, fetchMore } = useQuery<BidderDataList>(GET_BID_HISTORY, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: 'desc',
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

  const myBidsData = data.bidOrders

  const onFetchMore = () => {
    fetchMore({ variables: { skip: myBidsData.length } })
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
                <th>{t('my bid')}</th>
                <th className="action">{t('action')}</th>
                <th>{t('deal transaction')}</th>
              </tr>
            </thead>
            <tbody>
              {/* For no records */}
              {myBidsData.length === 0 ? (
                <tr>
                  <td colSpan={6}>{t('no records')}</td>
                </tr>
              ) : (
                myBidsData.map(bid => <MyBidsRow key={bid.id} bid={bid} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={() => onFetchMore()} className="secondary small">
        {t('load more')}
      </button>
    </>
  )
}

const MyBidsSubNav = props => {
  return (
    <nav className="subnav">
      <div className="menu"></div>

      <div className="options">
        <MyBidsNavFilter {...props} />
      </div>
    </nav>
  )
}

export function MyBids(props) {
  const [selected, setSelected] = useState(filterOptions[0])
  return (
    <>
      <MyBidsSubNav selected={selected} setSelected={setSelected} />
      <MyBidsList selected={selected} />
    </>
  )
}
