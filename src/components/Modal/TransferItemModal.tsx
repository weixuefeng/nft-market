/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 3:24 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isValidHexAddress, isValidNewAddress, newAddress2HexAddress } from '../../utils/NewChainUtils'
import { useWeb3React } from '@web3-react/core'
import { useERC721Contract } from '../../hooks/useContract'
import transactor from '../../functions/Transactor'

function TransferItemModal(props) {
  let { t } = useTranslation()
  const { nftToken, nftTokenMetaData } = props
  const { account } = useWeb3React()
  const [showModal, setShowModal] = React.useState(false)
  const [transferToAddresses, setTransferToAddresses] = useState('')
  const [buttonText, setButtonText] = useState(t('input a valid address'))
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const nftContract = useERC721Contract(nftToken.contract.id)

  function onUserChangeAddress(e) {
    const toAddress = e.target.value
    if (isValidNewAddress(toAddress) || isValidHexAddress(toAddress)) {
      setTransferToAddresses(toAddress)
      setButtonText(t('transfer'))
      setButtonDisabled(false)
    } else {
      setButtonText(t('input a valid address'))
      setButtonDisabled(true)
    }
  }

  function onConfirm() {
    let toAddress = transferToAddresses
    if (isValidNewAddress(toAddress)) {
      toAddress = newAddress2HexAddress(toAddress)
    }
    transactor(nftContract.safeTransferFrom(account, toAddress, nftToken.tokenId), t, () => {
      setShowModal(false)
    })
  }

  function closeModal() {
    setTransferToAddresses('')
    setButtonText(t('input a valid address'))
    setButtonDisabled(true)
    setShowModal(false)
  }

  return (
    <>
      <button className="tertiary small" onClick={() => setShowModal(true)}>
        {t('transfer')}
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
                  <h3>{t('transfer')}</h3>
                  <button className="close" onClick={closeModal}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <div className="nft_card">
                    <img src={nftTokenMetaData.tokenImage} alt="" />
                    <div>
                      <h4>{nftTokenMetaData.tokenName}</h4>
                      <p>#{nftToken.tokenId}</p>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="address">{t('transfer to')}</label>
                    <div className="mt-1 flex">
                      <input
                        onChange={onUserChangeAddress}
                        defaultValue=""
                        type="text"
                        name="address"
                        id="address"
                        placeholder={t("recipient's address")}
                        autoComplete="off"
                      />
                    </div>
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

export default TransferItemModal
