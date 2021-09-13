/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/19 9:58 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { formatEther } from '@ethersproject/units'
import React from 'react'
import { useTranslation } from 'react-i18next'

import NumberFormat from 'react-number-format'
import { useWeb3React } from '@web3-react/core'
import BuyNowModal from '../Modal/BuyNowModal'
import { cSymbol } from '../../constant'
import PutOffSaleModal from '../Modal/PutOffSaleModal'
import { useOwner } from '../../hooks/useOwner'
import { Account, OwnerPerToken } from '../../entities'

export function NFTFixedPriceForSale(props) {
  let { t } = useTranslation()
  const { account } = useWeb3React()
  const { nftToken, nftTokenMetaData, contractFee } = props
  const isOwner = useOwner(nftToken.owners[0].owner.id)
  const owners = nftToken.owners
  const askOwner = nftToken.askOrder.owner
  const isAskOwner = account ? askOwner.id.toLowerCase() === account.toLowerCase() : false

  function checkRealOwner(owner: Account, owners: Array<OwnerPerToken>) {
    for (let i = 0; i < owners.length; i++) {
      let o = owners[i]
      if (o.owner.id === owner.id) {
        return true
      }
    }
    return false
  }
  let isRealOwner = checkRealOwner(askOwner, owners)
  let tip = isRealOwner ? t('for sale') : t('not for sale')
  return (
    <section className="offer-card sale mobile">
      <header>
        <div className="price">
          <h4>{t('price')}</h4>
          <h3>
            <NumberFormat
              thousandSeparator={true}
              displayType={'text'}
              decimalScale={0}
              fixedDecimalScale={true}
              value={formatEther(nftToken.price)}
            />{' '}
            {cSymbol()}
          </h3>
        </div>
        <div className="status">
          <h4>{tip}</h4>
        </div>
      </header>
      {/* <main>
        <dl>
          <dd>
            {t('include protocol fee')} {_tradingFeeRate}%: <em>{formatEther(tradingFee.toString())} NEW</em>
          </dd>
          <dd>
            {t('include royalty fee')} {item.royaltyRate}%: <em>{formatEther(royaltyFee.toString())} NEW</em>
          </dd>
        </dl>
      </main> */}
      <footer>
        <div hidden={isOwner || !isRealOwner}>
          <BuyNowModal {...props} />
        </div>
        <div hidden={!isAskOwner}>
          <PutOffSaleModal {...props} />
        </div>
      </footer>

      {/* tfoot to add bottom safe-area for mobile */}
      <div className="tfoot"></div>
    </section>
  )
}
