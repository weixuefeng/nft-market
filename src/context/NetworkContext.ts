import React from 'react'

const NetworkContext = React.createContext({
  targetNetwork: 1007,
  address: '',
  balance: 0
})

export default NetworkContext
