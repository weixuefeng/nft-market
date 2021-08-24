import { useState } from 'react'
import usePoller from './usePooler'
import { formatEther } from '@ethersproject/units'

/*
  ~ What it does? ~

  Gets your balance in ETH from given address and provider

  ~ How can I use? ~

  const yourLocalBalance = useBalance(localProvider, address);

  ~ Features ~

  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
*/

export default function useBalance(library, address) {
  const [balance, setBalance] = useState(0)

  const pollBalance = async () => {
    let request = {
      jsonrpc: '2.0',
      id: 2,
      method: 'eth_getBalance',
      params: [address, 'latest']
    }
    if (library === undefined) {
      setBalance(0)
    } else {
      library.provider.sendAsync(request, (error, response) => {
        if (response) {
          setBalance(response.result)
        } else {
          console.log('get balance error:' + error)
        }
      })
    }
  }
  usePoller(pollBalance, 6000, true)
  return balance
}
