/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/23 11:52 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { useNFTExchangeContract } from './useContract'
import { useEffect, useState } from 'react'

export class ContractFee {
  protocolFee: number = 0
  operationFee: number = 0
  royaltyFee: number = 0
}

export function useContractFee(tokenAddress) {
  const contract = useNFTExchangeContract()
  const base = 1000
  const [contractFee, setContractFee] = useState<ContractFee>(new ContractFee())
  useEffect(() => {
    const contractFee = new ContractFee()
    async function getProtocolInfo() {
      try {
        const protocolFee = await contract.protocolFeeInfo()
        const royaltyFee = await contract.royaltyFeeInfo(tokenAddress)
        contractFee.protocolFee = protocolFee[1] / base
        contractFee.royaltyFee = royaltyFee[1] / base
      } catch (e) {
        console.log('error:' + e)
      }
      setContractFee(contractFee)
    }
    getProtocolInfo()
  }, [0])
  return contractFee
}
