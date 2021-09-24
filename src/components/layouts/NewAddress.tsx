import React from 'react'
import { hexAddress2NewAddress } from 'utils/NewChainUtils'
import { targetNetwork } from 'constant'

export default function NewAddress(props) {
  const address = props.value || props.address
  const newAddress = hexAddress2NewAddress(address, targetNetwork.chainId)
  let displayAddress
  if (props.size === 'short') {
    displayAddress = newAddress.substr(0, 6) + '...' + newAddress.substr(-4)
  } else if (props.size === 'long') {
    displayAddress = newAddress
  }
  return <span>{displayAddress}</span>
}
