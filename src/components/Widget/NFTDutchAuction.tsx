import React from 'react'
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
import { AuctionType } from '../../entities'

/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/20 3:55 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
export function NFTDutchAuction(props) {
  // isOwner: cancel auction
  // is now owner: make bid, cat bid history.
  let { t } = useTranslation()
  const { account } = useWeb3React()
  const { nftToken, nftTokenMetaData, contractFee } = props
  const isOwner = useOwner(nftToken.askOrder.owner.id)
  const where = { askOrder: nftToken.askOrder.id }

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
  const myBidWhere = { bidder: account.toLowerCase() }
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
    fetchPolicy: 'cache-and-network'
  })
  if (error || myBidError) {
    console.debug(error)
    console.debug(myBidError)
    return <>Error :(</>
  }
  if (loading || myBidLoading) {
    return <>loading...</>
  }
  const bidHistories = data.bidOrders
  const highestBid = bidHistories.length === 0 ? '0' : bidHistories[0].price
  const deadLine: number = nftToken.askOrder.deadline
  const myLastBidPrice = myBid.bidOrders.length === 0 ? '0' : parseInt(formatEther(myBid.bidOrders[0].price))
  const title = myLastBidPrice > 0 ? t('make bid') : t('raise bid')
  const newProp = {
    ...props,
    title,
    auctionType: AuctionType.DUTCH_AUCTION
  }
  return (
    <section className="offer-card auction mobile">
      <header>
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
              decimalScale={0}
              fixedDecimalScale={true}
              value={formatEther(highestBid)}
            />{' '}
            {cSymbol()}
          </h3>
        </div>

        <div className="status">
          <h4>{t('auction ends in')}</h4>
          {/*<p title={DateTime(deadLine)}>{Countdown(deadLine)}</p>*/}
          <span hidden>
            {/*{t("round")} {auction.round.toString()}: #{startTime.toString()} - #{endTime.toString()}*/}
          </span>
        </div>
      </header>

      <footer className="">
        <p hidden={isOwner}>
          {t('my bid')}: {myLastBidPrice} {cSymbol()}
        </p>
        <div hidden={isOwner}>
          <MakeBidModal {...newProp} />
        </div>
        <div hidden={!isOwner}>
          <PutOffSaleModal {...props} />
        </div>
      </footer>

      <div className="tfoot"></div>
    </section>
  )
}
