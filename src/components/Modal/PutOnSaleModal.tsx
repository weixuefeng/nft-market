/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 3:22 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { formatEther, parseEther } from '@ethersproject/units'
import { defaultAbiCoder as abi } from '@ethersproject/abi'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { cSymbol } from '../../constant'
import NumberFormat from 'react-number-format'
import { useNFTExchangeContract } from '../../hooks/useContract'
import { FIXED_PRICE_SALE_CONTRACT_ADDRESS } from '../../constant/settings'
import { AddressZero } from '@ethersproject/constants'
import transactor from '../../functions/Transactor'

function PutOnSaleModal(props) {
  const { t } = useTranslation()
  const { nftToken, nftTokenMetaData, contractFee } = props
  const [showModal, setShowModal] = useState(false)
  const [userItemPriceInNEW, setUserItemPriceInNEW] = useState(0.0)
  const [buttonText, setButtonText] = useState(t('invalid price'))
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const contract = useNFTExchangeContract()

  function onUserChangePrice(e) {
    const _newPrice = Number(e.target.value)
    if (_newPrice === Infinity || isNaN(_newPrice) || _newPrice >= 100000000000 || _newPrice <= 0) {
      setButtonText(t('invalid price'))
      setButtonDisabled(true)
      return
    }
    setButtonText(t('confirm'))
    setButtonDisabled(false)
    setUserItemPriceInNEW(_newPrice)
  }

  function onConfirm() {
    const nftAddress = nftToken.contract.id
    const deadline = parseInt(Date.now() / 1000 + '') + 3600
    const params = abi.encode(['uint256'], [parseEther(userItemPriceInNEW + '')])
    const res = transactor(
      contract.submitOrder(
        nftAddress,
        nftToken.tokenId,
        1,
        FIXED_PRICE_SALE_CONTRACT_ADDRESS,
        AddressZero,
        AddressZero,
        deadline,
        params
      ),
      t,
      () => {
        setShowModal(false)
      }
    )
  }

  function closeModal() {
    setUserItemPriceInNEW(0.0)
    setButtonText(t('invalid price'))
    setButtonDisabled(true)
    setShowModal(false)
  }

  const itemPriceInNEW = userItemPriceInNEW
  const itemPrice = parseEther(itemPriceInNEW.toString())
  const royaltyFee = itemPrice.mul(parseInt(contractFee.royaltyFee * 1000 + '')).div(1000)
  const royaltyFeeInNEW = formatEther(royaltyFee.toString())
  const tradingFee = itemPrice.mul(parseInt(contractFee.protocolFee * 1000 + '')).div(1000)
  const tradingFeeInNEW = formatEther(tradingFee.toString())

  const ownerReceive = itemPrice.sub(royaltyFee).sub(tradingFee)
  const ownerReceiveInNEW = formatEther(ownerReceive.toString())

  return (
    <>
      <button className="secondary small" onClick={() => setShowModal(true)}>
        {t('put on sale')}
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
            <span className="trick" aria-hidden="true"></span>

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
                  <h3>{t('put on sale')}</h3>
                  <button className="close" onClick={closeModal}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <p>{t('put on sale description')}</p>

                  <div className="nft_card">
                    <img src={nftTokenMetaData.tokenImage} alt="" />
                    <div>
                      <h4>{nftTokenMetaData.tokenName}</h4>
                      <p>#{nftToken.tokenId}</p>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="price">{t('price')}</label>
                    <div className="mt-1 flex">
                      <input
                        onChange={onUserChangePrice}
                        defaultValue={0}
                        type="text"
                        inputMode="decimal"
                        name="price"
                        id="price"
                        autoComplete="off"
                      />
                      <span className="for_input">{cSymbol()}</span>
                    </div>

                    <dl className="heading">
                      <dt>{t('you will receive')}</dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          decimalScale={3}
                          fixedDecimalScale={false}
                          displayType="text"
                          value={ownerReceiveInNEW}
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl>
                      <dt>
                        {t('royalty fee')} ({parseInt(contractFee.royaltyFee * 100 + '')} %)
                      </dt>
                      <dd>
                        <NumberFormat
                          thousandSeparator={true}
                          decimalScale={3}
                          fixedDecimalScale={false}
                          displayType="text"
                          value={royaltyFeeInNEW}
                        />{' '}
                        {cSymbol()}
                      </dd>
                    </dl>
                    <dl>
                      <dt>
                        {t('service fee')} ({parseInt(contractFee.protocolFee * 100 + '')} %)
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
                </main>

                <footer>
                  <button
                    disabled={buttonDisabled}
                    onClick={() => {
                      onConfirm()
                    }}
                    type="button"
                    className="primary"
                  >
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

export default PutOnSaleModal
