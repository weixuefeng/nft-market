import { formatEther } from '@ethersproject/units'
import { Menu, Transition } from '@headlessui/react'
import { ClipboardIcon, SparklesIcon, ArchiveIcon, ShoppingCartIcon, ClipboardListIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { Typography } from 'antd'
import {
  NewtonCoinIcon,
  NewtonLogoFull,
  HuobiTokenIcon,
  HuobiLogoFull,
  BinanceCoinIcon,
  BinanceLogoFull
} from 'components/icons'
import NewAddress from '../layouts/NewAddress'
import { hexAddress2NewAddress } from 'utils/NewChainUtils'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import Link from 'next/link'
import { cSymbol, targetNetwork } from 'constant'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constant/chains'
import { injected } from 'connectors'
import useBalance from 'hooks/useBalance'

export default function UserMenu(props) {
  const { t } = useTranslation()
  const { account, chainId, library } = useWeb3React()
  const balance = useBalance(library, account)
  const { Paragraph } = Typography
  // for wallet card brand
  let NetworkBrand = <NewtonLogoFull className="chain" />
  if (targetNetwork.networkBrand === 'heco') {
    NetworkBrand = <HuobiLogoFull className="chain" />
  }
  if (targetNetwork.networkBrand === 'bsc') {
    NetworkBrand = <BinanceLogoFull className="chain" />
  }
  // for testnet class
  let networkClass = ''
  if (chainId === SupportedChainId.NEWCHAIN) {
    networkClass = 'mainnet ' + 'newchain'
  } else {
    networkClass = 'testnet ' + 'newchain'
  }

  if (account) {
    const newAddress = hexAddress2NewAddress(account, chainId)
    return (
      <>
        <Menu as="div">
          {({ open }) => (
            <>
              <Menu.Button className="account-small">
                <AccountSmall />
              </Menu.Button>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items static className="user-menu">
                  <div className="user_profile">
                    <div className={'card ' + networkClass}>
                      <div className="bg"></div>
                      <div className="content">
                        <header>
                          {NetworkBrand}
                          <h3>
                            <Paragraph
                              copyable={{
                                icon: [<ClipboardIcon className="icon" />, <CheckIcon className="copy" />],
                                tooltips: [t('copy address'), t('copied')],
                                text: newAddress
                              }}
                            >
                              {<NewAddress address={newAddress} size="short" />}
                            </Paragraph>
                          </h3>
                          <div className="network">
                            <Network />
                          </div>
                        </header>
                        <main>
                          <h3>
                            <NumberFormat
                              thousandSeparator={true}
                              displayType={'text'}
                              decimalScale={2}
                              fixedDecimalScale={true}
                              value={formatEther(balance === undefined ? '0' : balance)}
                            />{' '}
                            {cSymbol()}
                          </h3>
                        </main>
                        <footer className="grid grid-cols-2 gap-2">
                          <div></div>
                          <div>
                            <NetworkConnectButton {...props} />
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>
                  <section className="menu" role="none">
                    <Menu.Item>
                      <Menu.Button>
                        <Link href="/me">
                          <a className="item" role="menuitem">
                            <ArchiveIcon className="icon" />
                            {t('my nfts')}
                          </a>
                        </Link>
                      </Menu.Button>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Button>
                        <Link href="/create">
                          <a className="item" role="menuitem">
                            <SparklesIcon className="icon" />
                            {t('create')}
                          </a>
                        </Link>
                      </Menu.Button>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Button>
                        <Link href="/me/orders-sell">
                          <a className="item" role="menuitem">
                            <ClipboardListIcon className="icon" />
                            {t('sells')}
                          </a>
                        </Link>
                      </Menu.Button>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Button>
                        <Link href="/me/orders-buy">
                          <a className="item" role="menuitem">
                            <ShoppingCartIcon className="icon" />
                            {t('buys')}
                          </a>
                        </Link>
                      </Menu.Button>
                    </Menu.Item>
                  </section>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </>
    )
  } else {
    return (
      <>
        <Menu as="div">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="account-small">
                  <AccountSmall />
                </Menu.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items static className="user-menu">
                  <div className="user_profile">
                    <div className={'card ' + networkClass}>
                      <div className="bg"></div>
                      <div className="content">
                        <header>
                          {NetworkBrand}
                          <h3>　</h3>
                          <div className="network">
                            <Network />
                          </div>
                        </header>
                        <main>
                          <h3>{t('wallet.not connected')}</h3>
                        </main>
                        <footer>
                          <div>
                            <NetworkConnectButton />
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </>
    )
  }
}

function Network() {
  const { chainId } = useWeb3React()
  let { t } = useTranslation()
  if (chainId === SupportedChainId.NEWCHAIN_TESTNET) {
    return <span className="testnet">Newchain {t('wallet.testnet')}</span>
  } else if (chainId === SupportedChainId.NEWCHAIN) {
    return <span className="mainnet">Newchain {t('wallet.mainnet')}</span>
  } else if(chainId === SupportedChainId.NEWCHAIN_DEVNET) {
    return <span className="mainnet">Newchain Devnet</span>
  } else {
    return <span className="testnet">Wrong Network</span>
  }
}

function NetworkConnectButton() {
  let { t } = useTranslation()
  const { activate, account, deactivate } = useWeb3React()
  if (account) {
    return (
      <button
        type="button"
        className="disconnect"
        key="logoutbutton"
        onClick={() => {
          deactivate()
        }}
      >
        {t('wallet.disconnect')}
      </button>
    )
  } else {
    return (
      <button
        type="button"
        className="connect"
        onClick={() => {
          activate(injected)
        }}
      >
        {t('wallet.connect wallet')}
      </button>
    )
  }
}

function AccountSmall() {
  let { t } = useTranslation()
  const { account, chainId } = useWeb3React()

  let addressShow = <>{t('wallet.not connected')}</>
  if (account) {
    addressShow = <NewAddress address={account} size="short" />
  }

  // for account network coin brand
  let CoinIcon = <NewtonCoinIcon className="coin-icon" />
  if (chainId === SupportedChainId.HECO || chainId === SupportedChainId.HECO_TESTNET) {
    CoinIcon = <HuobiTokenIcon className="coin-icon" />
  }
  if (chainId === SupportedChainId.BSC || chainId === SupportedChainId.BSC_TESTNET) {
    CoinIcon = <BinanceCoinIcon className="coin-icon" />
  }

  return (
    <>
      <div className="container">
        <div className={'network ' + targetNetwork.networkBrand}>
          <Network />
        </div>
        <div className="address">{addressShow}</div>
      </div>
      <div>{CoinIcon}</div>
    </>
  )
}
