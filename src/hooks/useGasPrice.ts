import { useState } from 'react'
import usePoller from './usePooler'
import axios from 'axios'

export default function useGasPrice(targetNetwork, speed) {
  const [gasPrice, setGasPrice] = useState(0)
  const loadGasPrice = async () => {
    if (targetNetwork.gasPrice) {
      setGasPrice(targetNetwork.gasPrice)
    } else {
      axios
        .get('https://rpc6.newchain.cloud.diynova.com/json/main/new-gas-api.json')
        .then(response => {
          const newGasPrice = response.data[speed || 'fast'] * 100000000
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice)
          }
        })
        .catch(error => console.log(error))
    }
  }

  usePoller(loadGasPrice, 1000, true)
  return gasPrice
}
