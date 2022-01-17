/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/23 10:19 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { getBrowsePath } from '../../functions'
import { NEXT_PUBLIC_ESTATE_CONTRACT, NEXT_PUBLIC_LANDS_CONTRACT } from '../../constant/settings'

export enum SaleModeIndex {
  ON_SALE = 0,
  FIXED_PRICE = 1,
  ENGLISH_AUCTION = 2,
  ALL = 3
}

export enum FilterIndex {
  NEWEST_CREATE = 0,
  OLDEST_CREATE = 1,
  PRICE_HIGH_TO_LOW = 2,
  PRICE_LOW_TO_HIGH = 3
}

export enum ContractFilter {
  ALL = 0,
  LANDS_CONTRACT = 1,
  ESTATE_CONTRACT = 2
}

const SubNavMenu = props => {
  let { t } = useTranslation()
  const router = useRouter()
  const { saleModeIndex, filterIndex, setPageNumber, setTimeNow, contractAddress } = props

  function onOrderChange(e) {
    const filter = parseInt(e.target.value)
    let saleMode = saleModeIndex
    if (
      (filter === FilterIndex.PRICE_HIGH_TO_LOW || filter === FilterIndex.PRICE_LOW_TO_HIGH) &&
      saleModeIndex == SaleModeIndex.ALL
    ) {
      saleMode = SaleModeIndex.ON_SALE
    }
    setPageNumber(1)
    resetTime()
    router.push(getBrowsePath(filter, saleMode, contractAddress))
  }

  function resetTime() {
    if (setTimeNow) {
      setTimeNow(parseInt(Date.now() / 1000 + ''))
    }
  }

  function onSaleModeChange(e) {
    const saleMode = parseInt(e.target.value)
    setPageNumber(1)
    resetTime()
    router.push(getBrowsePath(filterIndex, saleMode, contractAddress))
  }

  const contractArray = ['all', NEXT_PUBLIC_LANDS_CONTRACT, NEXT_PUBLIC_ESTATE_CONTRACT]
  function onCollectionsChange(e) {
    let saleMode = saleModeIndex
    const contractAddress = contractArray[parseInt(e.target.value)]
    setPageNumber(1)
    resetTime()
    router.push(getBrowsePath(filterIndex, saleMode, contractAddress))
  }

  return (
    <>
      <nav className="subnav">
        <div className="options" hidden></div>
      </nav>

      <div id="sub-filters">
        <div>
          <label htmlFor="filter">{t('sale mode filter')}</label>
          <select onChange={onSaleModeChange} id="filter" name="filter" defaultValue={saleModeIndex}>
            <option value={SaleModeIndex.ON_SALE}>{t('on sale')}</option>
            <option value={SaleModeIndex.FIXED_PRICE}>{t('fixed price sale')}</option>
            <option value={SaleModeIndex.ENGLISH_AUCTION}>{t('english auction')}</option>
            <option value={SaleModeIndex.ALL}>{t('all')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter">{t('collection filter')}</label>
          <select
            onChange={onCollectionsChange}
            id="filter-contract"
            name="ilter-contract"
            defaultValue={saleModeIndex}
          >
            <option value={ContractFilter.ALL}>{t('all')}</option>
            <option value={ContractFilter.LANDS_CONTRACT}>{t('Andverse Land')}</option>
            <option value={ContractFilter.ESTATE_CONTRACT}>{t('Andverse Estate')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="order">{t('order by')}</label>
          <select onChange={onOrderChange} id="order" name="order" defaultValue={filterIndex}>
            <option value={FilterIndex.PRICE_HIGH_TO_LOW}>{t('price_high_to_low')}</option>
            <option value={FilterIndex.PRICE_LOW_TO_HIGH}>{t('price_low_to_high')}</option>
            <option value={FilterIndex.NEWEST_CREATE}>{t('newest created')}</option>
            <option value={FilterIndex.OLDEST_CREATE}>{t('oldest created')}</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default SubNavMenu
