/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 3:00 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import React from 'react'
import { NFTokenSaleType } from '../../entities'
import NFTFixedPriceNotForSale from './NFTFixedPriceNotForSale'
import { NFTFixedPriceForSale } from './NFTFixedPriceForSale'
import { NFTEnglandAuction } from './NFTEnglandAuction'
import { NFTDutchAuction } from './NFTDutchAuction'
import { NFTDesignedBuyerForSale } from './NFTDesignedBuyerForSale'

function NftAuctionCard(props) {
  const { nftToken } = props
  if (nftToken.strategyType === NFTokenSaleType.NOT_SALE) {
    return <NFTFixedPriceNotForSale {...props} />
  } else if (nftToken.strategyType === NFTokenSaleType.DIRECT_SALE) {
    return <NFTFixedPriceForSale {...props} />
  } else if (nftToken.strategyType === NFTokenSaleType.ENGLAND_AUCTION) {
    return <NFTEnglandAuction {...props} />
  } else if (nftToken.strategyType === NFTokenSaleType.DUTCH_AUCTION) {
    return <NFTDutchAuction {...props} />
  } else if (nftToken.strategyType === NFTokenSaleType.DESIGNATED_BUYER_SALE) {
    return <NFTDesignedBuyerForSale {...props} />
  }
  return <div></div>
}

export default NftAuctionCard
