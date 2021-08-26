/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/20 2:08 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { parseEther } from '@ethersproject/units'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import React, { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { cSymbol } from '../../constant'
import { ENGLISH_AUCTION_CONTRACT_ADDRESS, WNEW_ADDRESS } from '../../constant/settings'
import { defaultAbiCoder as abi } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { useNFTExchangeContract } from '../../hooks/useContract'
import { formatEther } from 'ethers/lib/utils'
import transactor from '../../functions/Transactor'

export default function NewAuctionModal(props) {
  let { t } = useTranslation()

  const { nftToken, nftTokenMetaData, contractFee } = props
  const [showModal, setShowModal] = useState(false)

  const [buttonText, setButtonText] = useState(t('invalid start time'))
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const timestampNow = Math.floor(Date.now() / 1000)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [startPriceInNEW, setStartPriceInNEW] = useState(0)

  const itemPriceInNEW = startPriceInNEW
  const itemPrice = parseEther(itemPriceInNEW.toString())

  const royaltyFee = itemPrice.mul(parseInt(contractFee.royaltyFee * 1000 + '')).div(1000)
  const royaltyFeeInNEW = formatEther(royaltyFee.toString())

  const tradingFee = itemPrice.mul(parseInt(contractFee.protocolFee * 1000 + '')).div(1000)
  const tradingFeeInNEW = formatEther(tradingFee.toString())

  const ownerReceive = itemPrice.sub(royaltyFee).sub(tradingFee)
  const ownerReceiveInNEW = formatEther(ownerReceive.toString())

  const contract = useNFTExchangeContract()

  const onConfirm = e => {
    e.preventDefault()
    const nftAddress = nftToken.contract.id
    const tokenId = nftToken.tokenId
    const amount = 1
    const strategy = ENGLISH_AUCTION_CONTRACT_ADDRESS
    const currency = AddressZero
    const deadline = endTime
    const params = abi.encode(['uint256'], [parseEther(startPriceInNEW + '')])
    transactor(
      contract.submitOrder(nftAddress, tokenId, amount, strategy, currency, AddressZero, deadline, params),
      t,
      () => {
        setShowModal(false)
      }
    )
  }

  function updateButtonStatus() {
    const _timestampNow = Date.now()
    const _startTime = startTime
    const _endTime = endTime
    // if (_timestampNow > _startTime) {
    //   setButtonDisabled(true)
    //   setButtonText(t('invalid start time'))
    //   return
    // }
    if (_endTime > _timestampNow) {
      setButtonDisabled(true)
      setButtonText(t('invalid end time'))
      return
    }
    if (startPriceInNEW <= 0 || startPriceInNEW >= 100000000000) {
      setButtonDisabled(true)
      setButtonText(t('invalid start price'))
      return
    }
    setButtonDisabled(false)
    setButtonText(t('confirm'))
  }

  useEffect(() => {
    updateButtonStatus()
  }, [timestampNow, startTime, endTime, startPriceInNEW])

  function inputToTimestamp(datetime) {
    const _datetime = datetime.replace(/[Y|M|H|D|\-|:|\s]/g, '')
    let _year, _month, _day, _hour, _minute
    let _timestamp
    if (_datetime.length === 12) {
      _year = _datetime.substring(0, 4)
      _month = _datetime.substring(4, 6)
      _day = _datetime.substring(6, 8)
      _hour = _datetime.substring(8, 10)
      _minute = _datetime.substring(10, 12)
      _timestamp =
        _month <= 12 && _day <= 31 && _hour < 24 && _minute < 60
          ? Date.parse(_year + '-' + _month + '-' + _day + 'T' + _hour + ':' + _minute + ':00') / 1000
          : false
    }
    return _timestamp
  }

  function onChangeStartTime(e) {
    const _timestamp = inputToTimestamp(e.target.value)
    if (_timestamp === false || isNaN(_timestamp) || _timestamp === undefined) return
    setStartTime(_timestamp)
  }

  function onChangeEndTime(e) {
    const _timestamp = inputToTimestamp(e.target.value)
    if (_timestamp === false || isNaN(_timestamp) || _timestamp === undefined) return
    setEndTime(_timestamp)
  }

  function onUserChangePrice(e) {
    const _newPrice = Number(e.target.value)
    if (_newPrice === Infinity || isNaN(_newPrice) || _newPrice >= 100000000000 || _newPrice <= 0) {
      return
    }
    setStartPriceInNEW(_newPrice)
  }

  function closeModal() {
    setStartPriceInNEW(0)
    setStartTime(0)
    setEndTime(0)
    setButtonText(t('invalid start time'))
    setButtonDisabled(true)
    setShowModal(false)
  }

  return (
    <>
      <button className="secondary small yellow" onClick={() => setShowModal(true)}>
        {t('start english auction')}
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
                  <h3>{t('start english auction')}</h3>
                  <button className="close" onClick={closeModal}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <p>{t('new auction decription')}</p>

                  <div className="nft_card">
                    <img src={nftTokenMetaData.tokenImage} alt="" />
                    <div>
                      <h4>{nftTokenMetaData.tokenName}</h4>
                      <p>#{nftToken.tokenId}</p>
                    </div>
                  </div>

                  <p>{/*{t("current time") + t(": ") + DateTime(timestampNow * 1000)}*/}</p>

                  <div className="group">
                    {/*<label htmlFor="start_time">{t('start time')}</label>*/}
                    {/*<NumberFormat*/}
                    {/*  format="####-##-## ##:##"*/}
                    {/*  placeholder="YYYY-MM-DD HH:MM"*/}
                    {/*  mask={['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D', 'H', 'H', 'M', 'M']}*/}
                    {/*  className="font-mono"*/}
                    {/*  onChange={onChangeStartTime}*/}
                    {/*  autoComplete="off"*/}
                    {/*  type="text"*/}
                    {/*  name="start_time"*/}
                    {/*  id="start_time"*/}
                    {/*/>*/}

                    <label htmlFor="end_time">{t('end time')}</label>
                    <NumberFormat
                      format="####-##-## ##:##"
                      placeholder="YYYY-MM-DD HH:MM"
                      mask={['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D', 'H', 'H', 'M', 'M']}
                      className="font-mono"
                      onChange={onChangeEndTime}
                      autoComplete="off"
                      type="text"
                      name="end_time"
                      id="end_time"
                    />

                    <label htmlFor="price">{t('starting price')}</label>
                    <div className="mt-1 flex">
                      <input
                        onChange={onUserChangePrice}
                        defaultValue={0}
                        autoComplete="off"
                        type="text"
                        inputMode="decimal"
                        name="price"
                        id="price"
                      />
                      <span className="for_input">{cSymbol()}</span>
                    </div>

                    <dl className="heading">
                      <dt>{t('for bidding price')}</dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={itemPriceInNEW}
                          decimalScale={3}
                          fixedDecimalScale={false}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl>
                      <dt>{t('you will receive')}</dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={ownerReceiveInNEW}
                          decimalScale={3}
                          fixedDecimalScale={false}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl>
                      <dt>
                        {t('royalty fee')} ({parseInt(contractFee.royaltyFee * 100 + '')}%)
                      </dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={royaltyFeeInNEW}
                          decimalScale={3}
                          fixedDecimalScale={false}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl>
                      <dt>
                        {t('service fee')} ({parseInt(contractFee.protocolFee * 100 + '')}%)
                      </dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          value={tradingFeeInNEW}
                          decimalScale={3}
                          fixedDecimalScale={false}
                          displayType="text"
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                  </div>
                  <p className="warning">{t('cancel_auction_tip')}</p>
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
