import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { SupportedChainId } from 'constant/chains'

const POLLING_INTERVAL = 1000

const RPC: { [chainId: number]: string } = {
  [SupportedChainId.NEWCHAIN]: 'https://global.rpc.mainnet.newtonproject.org/',
  [SupportedChainId.NEWCHAIN_TESTNET]: 'https://rpc1.newchain.newtonproject.org/'
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 42, 56, 77, 97, 99, 128, 256, 1007, 1012]
})

export const network = new NetworkConnector({
  urls: RPC,
  defaultChainId: 1007
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC[1] },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})
