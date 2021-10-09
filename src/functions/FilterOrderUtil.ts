/**
 * @author weixuefeng@diynova.com
 * @time  2021/9/17 2:46 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { FilterIndex, SaleModeIndex } from '../components/Menu/SubNavMenu'
import { NFTokenSaleType, OrderDirection, OrderStatus, TokenOrderBy } from '../entities'
import { FILTER_START_BLOCK } from '../constant/settings'
import { BidOrderFilter } from 'pages/me/BuyOrder'
import { AuctionFilter } from '../pages/me/SellOrder'

export function getOrderInfo(filterIndex: FilterIndex) {
  let orderBy, orderDirection
  switch (filterIndex) {
    case FilterIndex.NEWEST_CREATE:
      orderBy = TokenOrderBy.mintBlock
      orderDirection = OrderDirection.DESC
      break
    case FilterIndex.OLDEST_CREATE:
      orderBy = TokenOrderBy.mintBlock
      orderDirection = OrderDirection.ASC
      break
    case FilterIndex.PRICE_LOW_TO_HIGH:
      orderBy = TokenOrderBy.price
      orderDirection = OrderDirection.ASC
      break
    case FilterIndex.PRICE_HIGH_TO_LOW:
      orderBy = TokenOrderBy.price
      orderDirection = OrderDirection.DESC
      break
    default:
      orderBy = TokenOrderBy.mintBlock
      orderDirection = OrderDirection.DESC
      break
  }
  return { orderBy, orderDirection }
}

export function getSaleModeInfo(saleModeIndex: SaleModeIndex) {
  const idNotIn = ['0xe1d4de8c157094eb39589625a16a1b8eccaf0467-84', '0xe1d4de8c157094eb39589625a16a1b8eccaf0467-82']
  const now = parseInt(Date.now() / 1000 + '')
  let where
  const defaultFilter = {
    mintBlock_gt: FILTER_START_BLOCK,
    id_not_in: idNotIn,
    black: false
  }
  switch (saleModeIndex) {
    case SaleModeIndex.ALL:
      where = {
        ...defaultFilter
      }
      break
    case SaleModeIndex.ENGLISH_AUCTION:
      where = {
        ...defaultFilter,
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        deadline_gte: now
      }
      break
    case SaleModeIndex.FIXED_PRICE:
      where = {
        ...defaultFilter,
        strategyType: NFTokenSaleType.DIRECT_SALE,
        deadline_gte: now
      }
      break
    case SaleModeIndex.ON_SALE:
      where = {
        ...defaultFilter,
        strategyType_not_in: [NFTokenSaleType.NOT_SALE],
        deadline_gte: now
      }
      break
    default: {
      where = defaultFilter
    }
  }
  return where
}

export function getAskOrderFilterByTitle(title: string, account: string, now: number) {
  let where
  switch (title.toLowerCase()) {
    case AuctionFilter.ALL.toLowerCase():
      where = {
        owner: account ? account.toLowerCase() : null
      }
      break
    case AuctionFilter.ON_SALE.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.DIRECT_SALE,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.NORMAL
      }
      break
    case AuctionFilter.SALE_COMPLETED.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.DIRECT_SALE,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.COMPLETED
      }
      break
    case AuctionFilter.SALE_CANCELED.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.DIRECT_SALE,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.CANCELED
      }
      break
    case AuctionFilter.AUCTION_COMPLETED.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.COMPLETED
      }
      break
    case AuctionFilter.AUCTION_CANCELED.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.CANCELED
      }
      break
    case AuctionFilter.IN_AUCTION.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.NORMAL,
        deadline_gte: now
      }
      break
    case AuctionFilter.AUCTION_END_NO_BID.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.NORMAL,
        deadline_lte: now,
        numBids: 0
      }
      break
    case AuctionFilter.AUCTION_END_PENDING_CLAIM.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.NORMAL,
        deadline_lte: now,
        claimDeadline_gte: now,
        numBids_gt: 0
      }
      break
    case AuctionFilter.AUCTION_END_CLAIM_EXPIRED.toLowerCase():
      where = {
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        owner: account ? account.toLowerCase() : null,
        status: OrderStatus.NORMAL,
        claimDeadline_lte: now,
        numBids_gt: 0
      }
      break
  }
  return where
}

export function getBidOrderFilterByTitle(title: string, account: string, now: number) {
  let where
  switch (title) {
    case BidOrderFilter.ALL:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true
      }
      break
    case BidOrderFilter.BUY_NOW:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true,
        strategyType: NFTokenSaleType.DIRECT_SALE
      }
      break
    case BidOrderFilter.AUCTION_BID:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true,
        strategyType: NFTokenSaleType.ENGLAND_AUCTION
      }
      break
    case BidOrderFilter.BOUGHT:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true,
        status: OrderStatus.COMPLETED
      }
      break
    case BidOrderFilter.AUCTION_PENDING_CLAIM:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true,
        auctionBestBid: true,
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        claimDeadline_gte: now,
        deadline_lte: now,
        status: OrderStatus.NORMAL
      }
      break
    case BidOrderFilter.IN_AUCTION:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        bidderLast: true,
        deadline_gt: now
      }
      break
  }
  return where
}
