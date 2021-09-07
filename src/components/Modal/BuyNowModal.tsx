/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/19 10:01 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { formatEther, parseEther } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { XIcon } from '@heroicons/react/solid'
import { cSymbol } from '../../constant'
import { useNFTExchangeContract } from '../../hooks/useContract'
import { AddressZero } from '@ethersproject/constants'
import transactor from '../../functions/Transactor'
import { OPERATION_FEE } from '../../constant/settings'

export default function BuyNowModal(props) {
  let { t } = useTranslation()

  const { nftToken, nftTokenMetaData, contractFee } = props
  const [showModal, setShowModal] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  if (contractFee === undefined) {
    return <></>
  }
  const itemPrice = BigNumber.from(nftToken.price)
  const itemPriceInNEW = formatEther(itemPrice.toString())
  const royaltyFee = itemPrice.mul(parseInt(contractFee.royaltyFee * 1000 + '')).div(1000)
  const royaltyFeeInNEW = formatEther(royaltyFee.toString())

  const tradingFee = itemPrice.mul(parseInt(contractFee.protocolFee * 1000 + '')).div(1000)
  const tradingFeeInNEW = formatEther(tradingFee.toString())

  const operationFee = itemPrice.mul(parseInt(OPERATION_FEE)).div(1000)
  const operationFeeInNEW = formatEther(operationFee.toString())

  const ownerReceive = itemPrice.sub(royaltyFee).sub(tradingFee).sub(operationFee)
  const ownerReceiveInNEW = formatEther(ownerReceive.toString())

  const payTotal = itemPrice
  const payTotalInNEW = formatEther(payTotal.toString())
  const exchangeContract = useNFTExchangeContract()

  function onConfirm(e) {
    setButtonDisabled(true)
    // todo: add 1155 check
    const orderHash = nftToken.orders[0].id
    const bidAmount = 1
    const bidPrice = nftToken.price
    const bidRecipient = AddressZero
    const bidReferrer = AddressZero
    const overrides = {
      value: parseEther(formatEther(bidPrice))
    }
    transactor(
      exchangeContract.bidByHash(orderHash, bidAmount, bidPrice, bidRecipient, bidReferrer, overrides),
      t,
      () => {
        setShowModal(false)
        setButtonDisabled(false)
      }
    )
  }

  return (
    <>
      <button className="primary" onClick={() => setShowModal(true)}>
        {t('buy now')}
      </button>
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" static className="dialog_wrapper" open={showModal} onClose={setShowModal}>
          <div className="modal_wrapper">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200 delay-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="overlay" />
            </Transition.Child>

            <span className="trick" aria-hidden="true">
              　
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300 delay-200"
              enterFrom="translate-y-full opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div className="transform transition-all modal_card">
                <header>
                  <h3>{t('buy now')}</h3>
                  <button className="close" onClick={() => setShowModal(false)}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <p>{t('buy now description')}</p>

                  <div className="nft_card">
                    <img src={nftTokenMetaData.tokenImage} alt="" />
                    <div>
                      <h4>{nftTokenMetaData.tokenName}</h4>
                      <p>#{nftToken.tokenId}</p>
                    </div>
                  </div>

                  <div className="group">
                    <dl className="heading">
                      <dt>{t('price')}</dt>
                      <dd>
                        {itemPriceInNEW} {cSymbol()}
                      </dd>
                    </dl>
                    <dl>
                      <dt>{t('seller will receive')}</dt>
                      <dd>
                        {ownerReceiveInNEW} {cSymbol()}
                      </dd>
                    </dl>

                    <dl>
                      <dt>
                        {t('royalty fee')} ({parseInt(contractFee.royaltyFee * 100 + '')}%)
                      </dt>
                      <dd>
                        {royaltyFeeInNEW} {cSymbol()}
                      </dd>
                    </dl>

                    <dl>
                      <dt>
                        {t('protocol fee')} ({parseInt(contractFee.protocolFee * 100 + '')}%)
                      </dt>
                      <dd>
                        {tradingFeeInNEW} {cSymbol()}
                      </dd>
                    </dl>

                    <dl>
                      <dt>
                        {t('operation fee')} ({parseInt(OPERATION_FEE) / 10}%)
                      </dt>
                      <dd>
                        {operationFeeInNEW} {cSymbol()}
                      </dd>
                    </dl>

                    <dl className="total">
                      <dt>{t('payment total')}</dt>
                      <dd>
                        {payTotalInNEW} {cSymbol()}
                      </dd>
                    </dl>
                  </div>
                </main>

                <footer>
                  <button disabled={buttonDisabled} onClick={onConfirm} type="button" className="primary">
                    {t('confirm')}
                  </button>
                </footer>
                <div className="tfoot"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
