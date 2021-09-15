/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/20 3:55 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */

import React, { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import { formatEther } from 'ethers/lib/utils'
import { cSymbol, pageSize, POLLING_INTERVAL } from '../../constant'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import { useOwner } from '../../hooks/useOwner'
import { GET_BID_HISTORY } from '../../services/queries/bidHistory'
import { useWeb3React } from '@web3-react/core'
import { MakeBidModal } from '../Modal/MakeBidModal'
import PutOffSaleModal from '../Modal/PutOffSaleModal'
import { useNFTExchangeContract } from '../../hooks/useContract'
import { AuctionType } from '../../entities'
import transactor from '../../functions/Transactor'
import { useTheme } from 'next-themes'
import { DateTime } from '../../functions/DateTime'
import CountDownTimer from './CountDown/CountDownTimer'

/**
 * 1. 拍卖进行中
 * 1.1 owner 无法出价，有倒计时， deadline   拍卖结束时间
 * 1.2 other 可以出价，有倒计时， deadline
 *
 * 2. 拍卖结束，未领取，且未超时 claimDeadline  领取截止时间
 * 2.1 owner 无法出价，有倒计时，claimDeadline
 * 2.2 other highest, 最高出价者，有倒计时， claimDeadline
 * 2.3 other normal, 普通出价或无出价，无倒计时，不可购买
 *
 * 3. 拍卖结束, 未领取，超时
 * 3.1 owner 取消订单
 * 3.2 other highest，不可购买
 */
export function NFTEnglandAuction(props) {
  // isOwner: cancel auction
  // is now owner: make bid, cat bid history.
  let { t } = useTranslation()
  const { nftToken} = props
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const exchangeContract = useNFTExchangeContract()

  // auction is ended ?
  const [isEnded, setIsEnded] = useState(false)
  // highest bidder can claim, check expired
  const [canClaimNFT, setCanClaimNFT] = useState(false)
  // claim expired
  const [expired, setExpired] = useState(false)
  // is best bidder
  const [isBestBidder, setIsBestBidder] = useState(false)

  const auctionEndTimeStr = t('auction_ends_in')
  const auctionClaimEndTimeStr = t('claim_ends_in')
  // auction's claim deadline
  const [claimDeadLine, setClaimDeadLine] = useState(0)
  const [deadline, setDeadline] = useState(0)
  // page controller
  // title string
  const [endTimeStr, setEndTimeStr] = useState(auctionEndTimeStr)
  // countdown time
  const [countDownTime, setCountDownTime] = useState(0)
  // hide auction over?
  const [hideAuctionOver, setHideAuctionOver] = useState(true)
  // hide claim ?
  const [hideClaimNFT, setHideClaimNFT] = useState(true)
  // hide countDown span?
  const [hideCountDown, setHideCountDown] = useState(false)
  // hide put off sale ?
  const [hidePutOffSale, setHidePutOffSale] = useState(true)

  const isOwner = useOwner(nftToken.askOrder.owner.id)
  const where = { askOrder: nftToken.askOrder.id }

  // get bid history by ask order hash
  const { data, loading, error } = useQuery(GET_BID_HISTORY, {
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



  // get current account's bid history, and check my bid
  const myBidWhere = { bidder: account ? account.toLowerCase() : null, askOrder: nftToken.askOrder.id }
  const {
    data: myBid,
    loading: myBidLoading,
    error: myBidError
  } = useQuery(GET_BID_HISTORY, {
    variables: {
      skip: 0,
      first: 1,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      where: myBidWhere
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL,
    onCompleted: (initData)
  })

  if (error || myBidError) {
    return <>Error :(</>
  }
  if (loading || myBidLoading) {
    return <>loading...</>
  }

  // ask order's bid history
  const bidHistories = data.bidOrders
  // check the ask order has bid?
  const hasBid = bidHistories.length > 0
  // current ask order's highest bid
  const highestBid = bidHistories.length === 0 ? '0' : bidHistories[0].price

  // my latest bid
  const myLastBidPrice = myBid.bidOrders.length === 0 ? '0' : parseInt(formatEther(myBid.bidOrders[0].price))
  // end time title
  const title = myLastBidPrice > 0 ? t('raise bid') : t('make bid')

  function initData() {
    // current account is highest bid
    const isHigher = highestBid > 0 && myBid.bidOrders.length > 0 && highestBid === myBid.bidOrders[0].price
    const claimDeadLine = parseInt(nftToken.askOrder.claimDeadline)
    // auction's deadline
    const deadLine: number = parseInt(nftToken.askOrder.deadline)
    setClaimDeadLine(claimDeadLine)
    setDeadline(deadLine)
    console.log(`isHigher:${isHigher}`)
    setIsBestBidder(isHigher)
    setCountDownTime(deadline * 1000)
    updateTime()
  }

  function checkHideCanClaim() {
    const {end, claimExpired} = checkTime()

    // auction has not end, hide claim, hide auction over, show countDown
    if(!end) {
      console.log(`isEnd: ${end}`)
      setHideClaimNFT(true)
      setHideAuctionOver(true)
      setHideCountDown(false)
      return
    }
    // auction claim expired, hide claim, show auction over, hide countDown
    if(claimExpired) {
      console.log(`expired 隐藏 claim: ${claimExpired}`)
      setHideClaimNFT(true)
      setHideAuctionOver(false)
      setHideCountDown(true)
      return
    }
    // not owner, hide claim, show auction over, hide countDown
    if(isOwner) {
      console.log(`isOwner 隐藏 claim: ${isOwner}`)
      setHideClaimNFT(true)
      setHideAuctionOver(false)
      setHideCountDown(true)
      return
    }
    // not best bidder, hide claim, show auction over, hide countDown
    if(!isBestBidder) {
      console.log(`isBestBidder 隐藏 claim: ${isBestBidder}`)
      setHideClaimNFT(true)
      setHideAuctionOver(false)
      setHideCountDown(true)
      return
    }
    // is best bidder, show claim, hide auction over
    console.log(`isBestBidder true: 显示 claim`)
    setHideClaimNFT(false)
    setHideAuctionOver(true)
    setHideCountDown(false)
    setEndTimeStr(auctionClaimEndTimeStr)
  }

  function checkHidePutOffSale() {
    // not owner, hide put off sale
    const {end, claimExpired} = checkTime()
    if(!isOwner) {
      console.log("checkHidePutOffSale isOwner: " + isOwner)
      setHidePutOffSale(true)
      return
    }
    console.log(`checkHidePutOffSale isOwner ${claimExpired}`)
    // claim expired, show put off sale
    if(claimExpired) {
      console.log("checkHidePutOffSale : expired")
      setHidePutOffSale(false)
      // not claim expired, but no bid, show put off sale
    } else if(!hasBid) {
      console.log("checkHidePutOffSale : not hasBid")
      setHidePutOffSale(false)
    } else {
      setHidePutOffSale(true)
    }
  }

  function checkTime() {
    const now = parseInt(Date.now() / 1000 + "")
    const end = now > Number(deadline)
    const claimExpired = now > Number(claimDeadLine)
    setIsEnded(end)
    setExpired(claimExpired)
    return {end, claimExpired}
  }

  function updateTime() {
    const {end, claimExpired} = checkTime()
    if(!end) {
      console.log('没有结束')
      setCountDownTime(deadline * 1000)
    } else if(!claimExpired) {
      console.log('没有超时')
      setCountDownTime(claimDeadLine * 1000)
    } else {
      console.log('超时啦')
    }
    checkHideCanClaim()
    checkHidePutOffSale()
  }

  function claimNft() {
    const askOrderHash = nftToken.askOrder.id
    const override = {
      value: myBid.bidOrders[0].price
    }
    transactor(exchangeContract.claimByHash(askOrderHash, override), t, () => {
      console.log()
    })
  }

  const newProp = {
    ...props,
    title,
    highPrice: highestBid,
    auctionType: AuctionType.ENGLISH_AUCTION
  }

  const color = theme === 'dark' ? 'white' : 'black'

  return (
    <section className="offer-card auction mobile">
      <header onClick={updateTime}>
        <div className="price" hidden={bidHistories.length > 0}>
          <h4>{t('starting price')}</h4>
          <h3>
            <NumberFormat
              thousandSeparator={true}
              displayType={'text'}
              decimalScale={0}
              fixedDecimalScale={true}
              value={formatEther(nftToken.askOrder.startPrice + '')}
            />{' '}
            {cSymbol()}
          </h3>
        </div>

        <div className="price" hidden={bidHistories.length === 0}>
          <h4>{t('highest bid')}</h4>
          <h3>
            <NumberFormat
              thousandSeparator={true}
              displayType={'text'}
              decimalScale={2}
              fixedDecimalScale={true}
              value={formatEther(highestBid)}
            />{' '}
            {cSymbol()}
          </h3>
        </div>

        <div className="status">
          <h4>{endTimeStr}</h4>
          <span hidden={hideCountDown}>
            <CountDownTimer
              dateTime={new Date(countDownTime).toISOString()}
              shouldShowSeparator={false}
              shouldShowTimeUnits={true}
              shouldHidePrecedingZeros={false}
              onCountdownCompletion={() => updateTime()}
              style={{ whiteSpace: 'nowrap', color: color }}
            />
          </span>
          <span hidden={hideAuctionOver}>{t('auction is over')}</span>
        </div>
      </header>

      <footer hidden={!account}>
        <p hidden={isOwner}>
          {t('my bid')}: {myLastBidPrice} {cSymbol()}
        </p>
        <div hidden={isOwner || isEnded || isEnded}>
          <MakeBidModal {...newProp} />
        </div>
        {/*1. 不是 owner 时隐藏； 2. 有出价同时没有超时隐藏*/}
        <div hidden={hidePutOffSale}>
          <PutOffSaleModal {...newProp} />
        </div>

        <div hidden={hideClaimNFT}>
          <button
            onClick={() => {
              claimNft()
            }}
            type="button"
            className="primary yellow small"
          >
            {t('claim nft')}
          </button>
        </div>
      </footer>

      <div className="tfoot"></div>
    </section>
  )
}
