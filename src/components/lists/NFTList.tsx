/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/19 1:45 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NFTListCard } from './NFTListCard'
import SubNavMenu from '../Menu/SubNavMenu'

export default function NFTList(props) {
  const { data, onFetchMore, showSubNav } = props
  let { t } = useTranslation()

  return (
    <>
      {showSubNav && <SubNavMenu {...props} />}

      {/* <button className='primary outline small' onClick={onRefetch}>
        {t("refresh")}
      </button> */}

      <ul className="list nft_card_list">
        {data &&
          data.map(item => {
            return <NFTListCard key={item.id} item={item} />
          })}
      </ul>

      {!onFetchMore ? (
        <div></div>
      ) : (
        <button className="tertiary outline small" onClick={onFetchMore}>
          {t('load more')}
        </button>
      )}
    </>
  )
}
