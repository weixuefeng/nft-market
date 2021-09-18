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

export enum SaleModeIndex {
  ON_SALE = 0,
  FIXED_PRICE = 1,
  ENGLISH_AUCTION = 2,
  ALL = 3
}

export enum FilterIndex {
  PRICE_HIGH_TO_LOW = 0,
  PRICE_LOW_TO_HIGH = 1,
  NEWEST_CREATE = 2,
  OLDEST_CREATE = 3
}

const SubNavMenu = props => {
  let { t } = useTranslation()
  const router = useRouter()
  const { saleModeIndex, filterIndex } = props

  function onOrderChange(e) {
    const filter = parseInt(e.target.value)
    let saleMode = saleModeIndex
    if((filter === FilterIndex.PRICE_HIGH_TO_LOW || filter === FilterIndex.PRICE_LOW_TO_HIGH) && saleModeIndex == SaleModeIndex.ALL) {
      saleMode = SaleModeIndex.ON_SALE
    }
    router.push(getBrowsePath(filter, saleMode))
  }

  function onSaleModeChange(e) {
    const saleMode = parseInt(e.target.value)
    router.push(getBrowsePath(filterIndex, saleMode))
  }

  return (
    <>
      <nav className="subnav">
        <div className="options" hidden></div>
      </nav>

      <div id="sub-filters">
        <div>
          <label htmlFor="filter">{t('filter')}</label>
          <select onChange={onSaleModeChange} id="filter" name="filter" defaultValue={saleModeIndex}>
            <option value={SaleModeIndex.ON_SALE}>{t('on sale')}</option>
            <option value={SaleModeIndex.FIXED_PRICE}>{t('fixed price sale')}</option>
            <option value={SaleModeIndex.ENGLISH_AUCTION}>{t('english auction')}</option>
            <option value={SaleModeIndex.ALL}>{t('all')}</option>
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
