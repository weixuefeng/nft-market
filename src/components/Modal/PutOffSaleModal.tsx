/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/19 10:01 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { XIcon } from '@heroicons/react/solid'
import { useNFTExchangeContract } from '../../hooks/useContract'

export default function PutOffSaleModal(props) {
  let { t } = useTranslation()

  const { nftToken, nftTokenMetaData } = props
  const [showModal, setShowModal] = useState(false)
  const exchangeContract = useNFTExchangeContract()
  function onConfirm() {
    const askHash = nftToken.orders[0].id
    exchangeContract
      .cancelByHash(askHash)
      .then(res => {
        console.log(res)
        setShowModal(false)
      })
      .catch(error => {
        console.log(error)
        setShowModal(false)
      })
  }

  return (
    <>
      <button className="secondary small" onClick={() => setShowModal(true)}>
        {t('put off sale')}
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
                  <h3>{t('put off sale')}</h3>
                  <button className="close" onClick={() => setShowModal(false)}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <p>{t('put off sale description')}</p>

                  <div className="nft_card">
                    <img src={nftTokenMetaData.tokenImage} alt="" />
                    <div>
                      <h4>{nftTokenMetaData.tokenName}</h4>
                      <p>#{nftToken.tokenId}</p>
                    </div>
                  </div>
                </main>

                <footer>
                  <button
                    onClick={() => {
                      onConfirm()
                    }}
                    type="button"
                    className="primary"
                  >
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
