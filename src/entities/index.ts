import exp from 'constants'

export enum NFTokenType {
  NRC7 = 'NRC7',
  NRC50 = 'NRC50',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155'
}

export enum AuctionType {
  ENGLISH_AUCTION = 'ENGLISH_AUCTION',
  DUTCH_AUCTION = 'DUTCH_AUCTION'
}

export enum TokenOrderBy {
  mintBlock = 'mintBlock',
  mintTime = 'mintTime',
  price = 'price'
}

export enum PriceEvent {
  Minted = 'Minted',
  Ask = 'Ask', // 挂单售卖
  Sale = 'Sale', // 成交
  Transfer = 'Transfer', // transfer
  Burn = 'Burn', // 销毁
  Cancel = 'Cancel', // 取消售卖
  Bid = 'Bid', // 竞价出价
  Offer = 'Offer' // 主动出价
}

export enum OrderDirection {
  ASC = 'asc', // up
  DESC = 'desc' // down
}

export type TokenFilterBy = {}

export class FilterOrder {
  tokenOrderBy: TokenOrderBy = TokenOrderBy.mintBlock
  orderDirection: OrderDirection = OrderDirection.DESC
  tokenFilterBy: string
}

export enum NFTokenSaleType {
  NOT_SALE = 0,
  DIRECT_SALE = 1,
  ENGLAND_AUCTION = 2,
  DUTCH_AUCTION = 3,
  DESIGNATED_BUYER_SALE = 4
}

export enum OrderStatus {
  NORMAL = 1, // buy direct
  COMPLETED = 2, // completed order
  CANCELED = 3 // canceled order
}

export type Account = {
  id: string // owner address
  name: string
  numTokens: number
}

export class OwnerPerToken {
  id: string
  owner: Account
  amount: number
  token: NFToken
}

export class Contract {
  id: string
  name: string
  type: string
}

export class AskOrder {
  id: string
  owner: Account
  currency: string
  strategy: string
  strategyType: NFTokenSaleType
  recipient: string
  deadline: number
  price: number
  designee: string
  startPrice: number
  endPrice: number
  startBlock: number
  finalBidOrder: BidOrder
  status: OrderStatus
  numBids: number
  token: NFToken
}

export class BidOrder {
  id: string
  askOrder: AskOrder
  bidder: Account
  amount: number
  price: number
  createdAt: number
  createdTx: string
  recipient: Account
  referrer: Account
  strategy: string
  strategyType: NFTokenSaleType
  auctionDeadline: number
  auctionClaimDeadline: number
  auctionBestBid: boolean
}

export class NFToken {
  id: string
  type: NFTokenType //NRC7, NRC50
  owners: Array<OwnerPerToken>
  numOwners: number //持有人数
  mintBlock: number //创建区块高度
  mintTime: number //创建时间
  minter: string //创建者
  mintTx: string //首次创建交易ID
  uri: string //token uri
  forSale: boolean //是否在售
  contract: Contract //合约地址
  tokenId: number //token Id
  amount: number //总发行量 NRC7:1 NRC50:X
  strategyType: NFTokenSaleType //多种销售形式，结合最低价，设置对应项 0未出售 1一口价 2英式拍卖 3荷兰式拍卖 4指定用户销售
  price: number //各种交易类型的最低价
  lastPrice: number //最后一次成交价格
  numSales: number //销售次数(成交次数)
  hot: boolean //是否热门
  black: boolean //是否黑名单
  orders: [AskOrder]
  askOrder: AskOrder | undefined
}

export interface NFTokenDataList {
  tokens: Array<NFToken>
}
export interface NFTokenData {
  token: NFToken
}

export interface OwnerPerDataList {
  ownerPerTokens: Array<OwnerPerToken>
}

export interface AskOrderDataList {
  askOrders: Array<AskOrder>
}

export interface BidderDataList {
  bidOrders: Array<BidOrder>
}
