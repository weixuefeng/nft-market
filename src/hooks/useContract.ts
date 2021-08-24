/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/18 10:17 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { useActiveWeb3React } from './useActiveWeb3React'
import { useMemo } from 'react'
import { getContract } from '../functions/contract'
import ERC721_ABI from '../constant/erc721.json'
import NEW_NFT_EXCHANGE_ABI from '../constant/NewNFTExchange.json'

import { NEW_NFT_EXCHANGE_CONTRACT_ADDRESS } from '../constant/settings'

function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useERC721Contract(contractAddress) {
  return useContract(contractAddress, ERC721_ABI, true)
}

export function useNFTExchangeContract() {
  return useContract(NEW_NFT_EXCHANGE_CONTRACT_ADDRESS, NEW_NFT_EXCHANGE_ABI, true)
}
