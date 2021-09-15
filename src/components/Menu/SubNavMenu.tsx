/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/23 10:19 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NFTokenSaleType, OrderDirection, TokenOrderBy } from '../../entities'
import { FILTER_START_BLOCK } from '../../constant/settings'

const SubNavMenu = props => {
  let { t } = useTranslation()
  const { setOrderBy, setOrderDirection, setFilter, where } = props

  function onOrderChange(e) {
    const order = e.target.value
    if (order === '0') {
      setOrderBy(TokenOrderBy.mintBlock)
      setOrderDirection(OrderDirection.DESC)
    }
    if (order === '1') {
      setOrderBy(TokenOrderBy.mintBlock)
      setOrderDirection(OrderDirection.ASC)
    }
    if (order === '2') {
      setOrderBy(TokenOrderBy.price)
      setOrderDirection(OrderDirection.DESC)
    }
    if (order === '3') {
      setOrderBy(TokenOrderBy.price)
      setOrderDirection(OrderDirection.ASC)
    }
  }

  // TODO: filter contract
  // filter contract: where: contract_not_in: []...
  // filter contract & id: where id_not_in: [] ....
  function onSaleModeChange(e) {
    const order = e.target.value
    if (order === '0') {
      setFilter({
        ...where
      })
    } else if (order === '1') {
      setFilter({
        ...where,
        strategyType: NFTokenSaleType.DIRECT_SALE
      })
    } else if (order === '2') {
      const now = parseInt(Date.now() / 1000 + '')
      setFilter({
        ...where,
        strategyType: NFTokenSaleType.ENGLAND_AUCTION,
        deadline_gte: now
      })
    } else if (order === '3') {
      setFilter({
        ...where,
        strategyType: NFTokenSaleType.DUTCH_AUCTION
      })
    }
  }

  return (
    <>
      <nav className="subnav">
        <div className="options" hidden></div>
      </nav>

      <div id="sub-filters">
        <div>
          <label htmlFor="filter">{t('filter')}</label>
          <select onChange={onSaleModeChange} id="filter" name="filter" defaultValue={0}>
            <option value={0}>{t('all')}</option>
            <option value={1}>{t('fixed price sale')}</option>
            <option value={2}>{t('english auction')}</option>s{/*<option value={3}>{t('dutch auction')}</option>*/}
          </select>
        </div>
        <div>
          <label htmlFor="order">{t('order by')}</label>
          <select onChange={onOrderChange} id="order" name="order" defaultValue={0}>
            <option value={0}>{t('newest created')}</option>
            <option value={1}>{t('oldest created')}</option>
            <option value={2}>{t('lowest price')}</option>
            <option value={3}>{t('highest price')}</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default SubNavMenu
