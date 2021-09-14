/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 3:22 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { useTranslation } from 'react-i18next'
import React from 'react'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { getTxUrl } from '../../utils/NewChainUtils'

function CreateConfirmModal(props) {
  const { t } = useTranslation()
  const { showModal, closeModal, txHash } = props

  return (
    <>
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
                  <h3>{t('create success')}</h3>
                  <button className="close" onClick={closeModal}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <div>
                    <dl className="heading">
                      <dd>
                        <dt>
                          {' '}
                          <a href={getTxUrl(txHash)} onClick={() => closeModal()}>
                            {t('cat_tx_hash')}
                          </a>
                        </dt>
                      </dd>
                      <dd>
                        <dt>
                          <a href={'/me'} onClick={() => closeModal()}>
                            {t('jump_to_mine')}
                          </a>
                        </dt>
                      </dd>
                    </dl>
                  </div>
                </main>

                <footer>
                  <button
                    disabled={false}
                    onClick={() => {
                      closeModal()
                    }}
                    type="button"
                    className="primary"
                  >
                    {'Create Next'}
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

export default CreateConfirmModal
