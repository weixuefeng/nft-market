/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/20 10:45 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

export function useOwner(targetAddress) {
  const { account } = useWeb3React()
  const [isOwner, setIsOwner] = useState(false)
  useEffect(() => {
    setIsOwner(targetAddress.toLowerCase() === account?.toLowerCase())
  }, [account])
  return isOwner
}
