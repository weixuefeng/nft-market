// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const NETWORK = chainId => {
  for (let n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n]
    }
  }
}

export const pageSize = 12

export const IPFS_GATEWAY_HOST = 'files.cloud.diynova.com'
export const IPFS_GATEWAY_PORT = '443'
export const IPFS_GATEWAY_PROTOCOL = 'https'
export const IPFS_GATEWAY_URL = `${IPFS_GATEWAY_PROTOCOL}://${IPFS_GATEWAY_HOST}:${IPFS_GATEWAY_PORT}/ipfs/`

export const FILE_UPLOAD_URL = 'https://files.cloud.diynova.com/upload'
export const JSON_UPLOAD_URL = 'https://files.cloud.diynova.com/upload_json'

export const VERIFIED_ADDRESSES = {
  '0x1774253cfaa39015fa5e7c4c6a0deb8c1a994937': {
    name: 'chineseCharactorAddress'
  },
  '0x8215e1464cef8575edd81d80ceee9077d5c7c2b3': {
    name: 'bearBrickAddress'
  }
}

/**
 *
 * @param {string} address
 * @returns {boolean}
 */
export function addressIsVerified(address) {
  if (!address) {
    return false
  }
  if (typeof address !== 'string') {
    return false
  }
  address = address.toLowerCase()
  if (!VERIFIED_ADDRESSES[address]) {
    return false
  }
  return true
}

export function sameAddress(a, b) {
  if (typeof a !== 'string') {
    return false
  }
  if (typeof b !== 'string') {
    return false
  }
  if (a.toLowerCase() === b.toLowerCase()) {
    return true
  }
  return false
}

export const NETWORKS = {
  localhost: {
    name: 'localhost',
    color: '#666666',
    chainId: 1007,
    rpcUrl: `https://rpc3.newchain.cloud.diynova.com/`,
    blockExplorer: '',
    subgraphUri: 'https://testnetnft.cloud.diynova.com/subgraphs/name/NewtonNFT/NFT'
  },
  NewChainTestNet: {
    name: 'NewChainTestNet',
    networkBrand: 'newchain',
    mainnet: false,
    color: '#ff8b9e',
    chainId: 1007,
    rpcUrl: `https://rpc3.newchain.cloud.diynova.com/`,
    blockExplorer: 'http://e.testnet.diynova.com/',
    subgraphUri: 'https://testnetnft.cloud.diynova.com/subgraphs/name/NewtonNFT/NFT',
    bearBrickAddress: '0x8215e1464cef8575edd81d80ceee9077d5c7c2b3',
    chineseCharactorAddress: '0x1774253cfaa39015fa5e7c4c6a0deb8c1a994937',
    useNewAddress: true,
    contract: {
      NewtonNFT: '0xdECe7b73E056368F568007c75dbcA26ece919f53',
      NewtonNFTCommander: '0x83884EfA4BB00045AF1BB2404E30CD89De9F2EAB'
    }
  },
  HecoMainNet: {
    name: 'HecoMainNet',
    networkBrand: 'heco',
    mainnet: true,
    color: '#ff8b9e',
    chainId: 128,
    rpcUrl: `https://rpc-mainnet-heco.cloud.diynova.com`,
    blockExplorer: 'https://hecoinfo.com/',
    subgraphUri: 'https://gql-nft-heco.cloud.diynova.com/subgraphs/name/NewtonNFT/NFT',
    bearBrickAddress: '0x8215e1464cef8575edd81d80ceee9077d5c7c2b3',
    chineseCharactorAddress: '0x1774253cfaa39015fa5e7c4c6a0deb8c1a994937',
    currencySymbol: 'HT',
    contract: {
      NewtonNFT: '0x9Ef0b32E72b270B92Db62DE6cdDC8f39552CfcC1'
    }
  },
  mainnet: {
    name: 'mainnet',
    networkBrand: 'ethereum',
    mainnet: true,
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: 'https://etherscan.io/'
  },
  rinkeby: {
    name: 'rinkeby',
    networkBrand: 'ethereum',
    mainnet: false,
    color: '#e0d068',
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: 'https://faucet.rinkeby.io/',
    blockExplorer: 'https://rinkeby.etherscan.io/'
  },
  xdai: {
    name: 'xdai',
    color: '#48a9a6',
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: 'https://dai.poa.network',
    faucet: 'https://xdai-faucet.top/',
    blockExplorer: 'https://blockscout.com/poa/xdai/'
  }
}

const network = process.env.REACT_APP_NETWORK ? process.env.REACT_APP_NETWORK : 'NewChainTestNet'
export const targetNetwork = NETWORKS[network]

export function cSymbol() {
  if (targetNetwork.currencySymbol) {
    return targetNetwork.currencySymbol
  } else {
    return 'NEW'
  }
}

export const NetworkContextName = 'NETWORK'
export const POLLING_INTERVAL = 6000
