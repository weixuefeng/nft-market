import { FilterIndex, SaleModeIndex } from '../components/Menu/SubNavMenu'
import { NFTokenSaleType, OrderDirection, TokenOrderBy } from '../entities'
import { FILTER_START_BLOCK } from '../constant/settings'

/**
 * @author weixuefeng@diynova.com
 * @time  2021/9/17 2:46 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */

export function getOrderInfo(filterIndex: FilterIndex) {
  let orderBy, orderDirection
  switch (filterIndex) {
    case FilterIndex.NEWEST_CREATE:
      orderBy = TokenOrderBy.mintBlock
      orderDirection = OrderDirection.DESC
      break
    case FilterIndex.OLDEST_CREATE:
      orderBy = TokenOrderBy.mintBlock
      orderDirection = OrderDirection.ASC
      break
    case FilterIndex.PRICE_LOW_TO_HIGH:
      orderBy = TokenOrderBy.price
      orderDirection = OrderDirection.DESC
      break
    case FilterIndex.PRICE_HIGH_TO_LOW:
      orderBy = TokenOrderBy.price
      orderDirection = OrderDirection.ASC
      break
    default:
      orderBy = TokenOrderBy.mintBlock
      orderDirection = OrderDirection.DESC
      break
  }
  return { orderBy, orderDirection }
}

//   const order = parseInt(e.target.value)
//   if (order === SaleModeIndex.ALL) {
//     // setFilter({
//     //   ...where,
//     // })
//     getBrowsePath()
//     router.push(`/browse/`)
//     console.log('go to sort')
//   } else if (order === SaleModeIndex.FIXED_PRICE) {
//     setFilter({
//       ...where,
//       strategyType: NFTokenSaleType.DIRECT_SALE,
//     })
//   } else if (order === SaleModeIndex.ENGLISH_AUCTION) {
//     const now = parseInt(Date.now() / 1000 + '')
//     setFilter({
//       ...where,
//       strategyType: NFTokenSaleType.ENGLAND_AUCTION,
//       deadline_gte: now,
//     })
//   } else if (order === SaleModeIndex.ON_SALE) {
//     const now = parseInt(Date.now() / 1000 + '')
//     setFilter({
//       ...where,
//       strategyType_not_in: [NFTokenSaleType.NOT_SALE],
//       deadline_gte: now,
//     })
//   }
export function getSaleModeInfo(saleModeIndex: SaleModeIndex) {
  const idNotIn = ['0xe1d4de8c157094eb39589625a16a1b8eccaf0467-84', '0xe1d4de8c157094eb39589625a16a1b8eccaf0467-82']
  const now = parseInt(Date.now() / 1000 + '')
  let where
  const defaultFilter = { mintBlock_gt: FILTER_START_BLOCK, id_not_in: idNotIn }
  switch (saleModeIndex) {
    case SaleModeIndex.ALL:
      where = {
        ...defaultFilter
      }
      break
    case SaleModeIndex.ENGLISH_AUCTION:
      where = {
        ...defaultFilter,
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        deadline_gte: now
      }
      break
    case SaleModeIndex.FIXED_PRICE:
      where = {
        ...defaultFilter,
        strategyType: NFTokenSaleType.DIRECT_SALE
      }
      break
    case SaleModeIndex.ON_SALE:
      where = {
        ...defaultFilter,
        strategyType_not_in: [NFTokenSaleType.NOT_SALE],
        deadline_gte: now
      }
      break
    default: {
      where = defaultFilter
    }
  }
  return where
}
