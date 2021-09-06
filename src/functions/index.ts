import axios, { AxiosError } from 'axios'
import { PriceEvent } from '../entities'

export async function getInfo(url) {
  try {
    const result = await axios.get(url)
    return result.data
  } catch (e) {
    try {
      const res = await axios.get(`/api/proxy?url=${url}`)
      return res.data
    } catch (e) {
      console.error(e)
      return ''
    }
  }
}

export function getNftDetailPath(nftId: string) {
  const [tokenAddress, tokenId] = nftId.split('-')
  return `asset/${tokenAddress}/${tokenId}`
}

export function getTradingStatus(event: string, t) {
  let res = ''
  switch (event) {
    case PriceEvent.Ask:
      res = t('event_ask')
      break
    case PriceEvent.Bid:
      res = t('event_bid')
      break
    case PriceEvent.Burn:
      res = t('event_burn')
      break
    case PriceEvent.Cancel:
      res = t('event_cancel')
      break
    case PriceEvent.Offer:
      res = t('event_offer')
      break
    case PriceEvent.Minted:
      res = t('event_minted')
      break
    case PriceEvent.Sale:
      res = t('event_sale')
      break
    case PriceEvent.Transfer:
      res = t('event_transfer')
      break
    default:
      break
  }
  return res
}
