import { NetworkContextName } from 'constant'
import { createWeb3ReactRoot } from '@web3-react/core'

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName)

function Web3ProviderNetwork({ getLibrary, children }) {
  return Web3ReactRoot({ getLibrary, children })
}

export default Web3ProviderNetwork
