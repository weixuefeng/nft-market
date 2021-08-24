/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/18 10:16 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { NetworkContextName } from '../constant'
import { useWeb3React, useWeb3React as useWeb3ReactCore } from '@web3-react/core'

export function useActiveWeb3React() {
  const context = useWeb3React()
  const contextNetwork = useWeb3ReactCore(NetworkContextName)
  return context.active ? context : contextNetwork
}
