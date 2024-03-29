/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 3:20 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { formatEther } from '@ethersproject/units'
import { cSymbol, POLLING_INTERVAL } from '../../constant'
import { useWeb3React } from '@web3-react/core'
import PutOnSaleModal from '../Modal/PutOnSaleModal'
import TransferItemModal from '../Modal/TransferItemModal'
import { useERC721Contract, useNFTExchangeContract } from '../../hooks/useContract'
import { NEW_NFT_EXCHANGE_CONTRACT_ADDRESS } from '../../constant/settings'
import { useOwner } from '../../hooks/useOwner'
import NewAuctionModal from '../Modal/NewAuctionModal'
import NewDutchAuctionModal from '../Modal/NewDutchAuctionModal'
import usePoller from '../../hooks/usePooler'
import { DesignatedSaleModal } from '../Modal/DesignatedSaleModal'
import transactor from '../../functions/Transactor'

function NFTFixedPriceNotForSale(props) {
  const tag = 'NFTFixedPriceNotForSale'
  let { t } = useTranslation()
  const { account } = useWeb3React()
  const { nftToken, nftTokenMetaData, contractFee } = props
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const isOwner = useOwner(nftToken.owners[0].owner.id)
  const contract = useERC721Contract(nftToken.contract.id)
  const approve = t('approve_NewMall_for_sale')
  const [approveText, setApproveText] = useState(approve)
  const [approveEnable, setApproveEnable] = useState(true)
  const exchangeContract = useNFTExchangeContract()

  function checkApprove() {
    if (isApproved) {
      return
    }
    contract
      .isApprovedForAll(account, NEW_NFT_EXCHANGE_CONTRACT_ADDRESS)
      .then(res => {
        setIsApproved(res)
      })
      .catch(error => {
        console.debug(tag, error)
      })
  }

  usePoller(checkApprove, POLLING_INTERVAL, true)

  return (
    <section className="offer-card">
      <header>
        <div className="price">
          <h4>{t('last price')}</h4>
          <h3>
            <NumberFormat
              thousandSeparator={true}
              displayType={'text'}
              decimalScale={0}
              fixedDecimalScale={true}
              value={formatEther(nftToken.price ? nftToken.price : 0)}
            />{' '}
            {cSymbol()}
          </h3>
        </div>
        <div className="status">
          <h4>{t('not for sale')}</h4>
        </div>
      </header>

      <footer hidden={!isOwner}>
        <div hidden={!isApproved}>
          <PutOnSaleModal {...props} />
          {/*<NewDutchAuctionModal {...props} />*/}
          <NewAuctionModal {...props} />
          {/*<DesignatedSaleModal {...props} />*/}
        </div>
        <div hidden={isApproved}>
          <button
            onClick={() => {
              if (approveEnable) {
                setApproveEnable(false)
                setApproveText(t('approving'))
                transactor(contract.setApprovalForAll(NEW_NFT_EXCHANGE_CONTRACT_ADDRESS, true), t, () => {
                  setApproveEnable(true)
                  setApproveText(approve)
                })
              }
            }}
            type="button"
            disabled={isApproved}
            className="primary secondary small yellow"
          >
            {approveText}
          </button>
        </div>
        <div hidden={!isOwner}>
          <TransferItemModal {...props} />
        </div>
      </footer>

      {/* tfoot to add bottom safe-area for mobile */}
      <div className="tfoot"></div>
    </section>
  )
}
export default NFTFixedPriceNotForSale
