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
  /**
   *   { title: 'All', current: true },
   // ^ all orders
   { title: 'Active', current: false },
   // ^ direct sale, normal
   { title: 'Action Required', current: false },
   // ^ expired || pending claim
   { title: 'Sells', current: false },
   // ^ sell strategy
   { title: 'Auctions', current: false },
   // ^ auction strategy
   { title: 'Completed', current: false },
   // ^ completed
   { title: 'Canceled', current: false }
   // ^ canceled
   */
  let where
  if (title.toLowerCase() === AuctionFilter.ALL.toLowerCase()) {
    where = {
      owner: account ? account.toLowerCase() : null
    }
  } else if (title.toLowerCase() === AuctionFilter.ACTIVE.toLowerCase()) {
    where = {
      strategyType: NFTokenSaleType.DIRECT_SALE,
      owner: account ? account.toLowerCase() : null,
      status: OrderStatus.NORMAL
    }
  } else if (title.toLowerCase() === AuctionFilter.CANCELED.toLowerCase()) {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null,
      status: OrderStatus.CANCELED
    }
  } else if (title.toLowerCase() === AuctionFilter.COMPLETED.toLowerCase()) {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null,
      status: OrderStatus.COMPLETED
    }
  } else if (title.toLowerCase() === AuctionFilter.ACTION_REQUIRED.toLowerCase()) {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null,
      status: OrderStatus.NORMAL,
      claimDeadline_lte: now
    }
  } else if (title.toLowerCase() === AuctionFilter.AUCTIONS.toLowerCase()) {
    where = {
      strategyType: NFTokenSaleType.ENGLAND_AUCTION,
      owner: account ? account.toLowerCase() : null
    }
  } else if (title.toLowerCase() === AuctionFilter.SELL.toLowerCase()) {
    where = {
      strategyType: NFTokenSaleType.DIRECT_SALE,
      owner: account ? account.toLowerCase() : null
    }
  }
  return where
}

export function getBidOrderFilterByTitle(title: string, account: string, now: number) {
  /**
   *   { title: BidOrderFilter.ALL, current: true },
   // ^ all orders
   { title: BidOrderFilter.AUCTION_REQUIRED, current: false },
   // ^ auction && pending claim
   { title: BidOrderFilter.BUYS, current: false },
   // ^ buy strategy
   { title: BidOrderFilter.AUCTION_BID, current: false },
   // ^ auction strategy
   { title: BidOrderFilter.AUCTION_ENDED, current: false },
   // ^ auction && timestamp > auction end time && h.bidder not me || claim expired
   { title: BidOrderFilter.AUCTION_COMPLETED, current: false }
   // ^ auction && deal is me
   */
  let where
  switch (title) {
    case BidOrderFilter.ALL:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true
      }
      break
    case BidOrderFilter.BUYS:
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
    case BidOrderFilter.AUCTION_ENDED:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true,
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        deadline_lte: now
      }
      break
    case BidOrderFilter.AUCTION_COMPLETED:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true
      }
      break
    case BidOrderFilter.AUCTION_REQUIRED:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true,
        auctionBestBid: true,
        claimDeadline_gte: now
      }
      break
    default:
      where = {
        bidder: account ? account.toLocaleLowerCase() : null,
        bidderLast: true
      }
      break
  }
  return where
}
