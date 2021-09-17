import axios from 'axios'
import { PriceEvent } from '../entities'
import { FilterIndex, SaleModeIndex } from '../components/Menu/SubNavMenu'

export async function getInfo(url) {
  try {
    if (url.startsWith('data:application/json;base64,')) {
      let data = url.split('data:application/json;base64,')[1]
      const res = JSON.parse(atob(data))
      return res
    }
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
  return `/asset/${tokenAddress}/${tokenId}`
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

export function splitTx(tx: string | null) {
  if (tx === null) {
    return tx
  }
  if (tx.length < 30) {
    return tx
  }
  return tx.substring(0, 10) + '......' + tx.substring(tx.length - 10, tx.length)
}

export function getBrowsePath(filterIndex: FilterIndex, saleModeIndex: SaleModeIndex) {
  return `/browse/filterIndex=${filterIndex}/saleModeIndex=${saleModeIndex}`
}
