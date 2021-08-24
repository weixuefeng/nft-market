import { useMemo } from 'react'

//for real network

const useUserProvider = (injectedProvider, localProvider) =>
  useMemo(() => {
    if (injectedProvider) {
      console.log('🦊 Using injected provider')
      return injectedProvider
    }
    if (!localProvider) return undefined
  }, [injectedProvider, localProvider])

export default useUserProvider
