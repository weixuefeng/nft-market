/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/20 6:20 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { cSymbol } from '../../constant'
import { useNFTExchangeContract } from '../../hooks/useContract'
import { AddressZero } from '@ethersproject/constants'
import { formatEther, parseEther } from '@ethersproject/units'

export function MakeBidModal(props) {
  let { t } = useTranslation()
  const { nftToken, nftTokenMetaData, title, contractFee } = props
  const [showModal, setShowModal] = useState(false)
  const [buttonText, setButtonText] = useState(t('invalid bid amount'))
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [bidPriceInNEW, setBidPriceInNEW] = useState(0)
  const bidPrice = parseEther(bidPriceInNEW.toString())

  const royaltyFee = bidPrice.mul(parseInt(contractFee.royaltyFee * 1000 + '')).div(1000)
  const royaltyFeeInNEW = formatEther(royaltyFee.toString())

  const tradingFee = bidPrice.mul(parseInt(contractFee.protocolFee * 1000 + '')).div(1000)
  const tradingFeeInNEW = formatEther(tradingFee.toString())

  const ownerReceive = bidPrice.sub(royaltyFee).sub(tradingFee)
  const ownerReceiveInNEW = formatEther(ownerReceive.toString())

  // const payTotal = bidPrice.add(tradingFee)
  const payTotal = bidPrice
  const payTotalInNEW = formatEther(payTotal.toString())

  const startPrice = nftToken.orders[0].startPrice
  const highestPrice = nftToken.orders[0].price
  const exchangeContract = useNFTExchangeContract()

  const onConfirm = e => {
    e.preventDefault()
    const orderHash = nftToken.orders[0].id
    const bidAmount = 1
    const bidPrice = parseEther(bidPriceInNEW + '')
    const bidRecipient = AddressZero
    const bidReferrer = AddressZero
    // const variable = {
    //   value: bidPrice
    // }
    exchangeContract
      .bidByHash(orderHash, bidAmount, bidPrice, bidRecipient, bidReferrer)
      .then(res => {
        console.log(res)
        setShowModal(false)
        setButtonDisabled(false)
      })
      .catch(error => {
        console.log(error)
        setShowModal(false)
        setButtonDisabled(false)
      })
  }

  function onUserChangeBidPrice(e) {
    const _newPrice = Number(e.target.value)
    if (_newPrice === Infinity || isNaN(_newPrice) || _newPrice >= 100000000000 || _newPrice <= 0) {
      setButtonText(t('invalid bid amount'))
      setButtonDisabled(true)
      return
    }

    if (parseEther(_newPrice + '') <= startPrice || parseEther(_newPrice + '') <= highestPrice) {
      setButtonText(t('invalid bid amount'))
      setButtonDisabled(true)
      return
    }

    setBidPriceInNEW(_newPrice)
    setButtonText(t('confirm'))
    setButtonDisabled(false)
  }

  function closeModal() {
    setBidPriceInNEW(0)
    setButtonText(t('invalid bid amount'))
    setButtonDisabled(true)
    setShowModal(false)
  }

  return (
    <>
      <button className="primary yellow" onClick={() => setShowModal(true)}>
        {title}
      </button>
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" static className="dialog_wrapper" open={showModal} onClose={closeModal}>
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
                  <h3>{t('make bid')}</h3>
                  <button className="close" onClick={closeModal}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <p>{t('make bid description')}</p>

                  <div className="nft_card">
                    <img src={nftTokenMetaData.tokenImage} alt="" />
                    <div>
                      <h4>{nftTokenMetaData.tokenName}</h4>
                      <p>#{nftToken.tokenId}</p>
                    </div>
                  </div>

                  <p>
                    {t('starting price')}:{' '}
                    <NumberFormat
                      thousandSeparator={true}
                      value={formatEther(startPrice)}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      displayType="text"
                    />{' '}
                    {cSymbol()}
                  </p>
                  <p>
                    {t('highest bid')}:{' '}
                    <NumberFormat
                      thousandSeparator={true}
                      value={formatEther(highestPrice)}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      displayType="text"
                    />{' '}
                    {cSymbol()}
                  </p>

                  <div className="group">
                    <label htmlFor="price">{t('your bid')}</label>
                    <div className="mt-1 flex">
                      <input
                        onChange={onUserChangeBidPrice}
                        defaultValue={0}
                        type="text"
                        inputMode="decimal"
                        name="price"
                        id="price"
                        autoComplete="off"
                      />
                      <span className="for_input">{cSymbol()}</span>
                    </div>

                    <dl hidden>
                      <dt>{t('seller will receive')}</dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={ownerReceiveInNEW}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl hidden>
                      <dt>
                        {t('royalty fee')} ({parseInt(contractFee.royaltyFee * 100 + '')}%)
                      </dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={royaltyFeeInNEW}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl className="heading" hidden>
                      <dt>
                        {t('service fee')} ({parseInt(contractFee.protocolFee * 100 + '')}%)
                      </dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={tradingFeeInNEW}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl className="total" hidden>
                      <dt>{t('payment total')}</dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={payTotalInNEW}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                  </div>

                  {/*<p className='warning' title={t("end time" + DateTime(auction.endTime * 1000))}>*/}
                  {/*  {Countdown(auction.endTime)}*/}
                  {/*</p>*/}
                </main>

                <footer>
                  <button disabled={buttonDisabled} onClick={onConfirm} type="button" className="primary yellow">
                    {buttonText}
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
