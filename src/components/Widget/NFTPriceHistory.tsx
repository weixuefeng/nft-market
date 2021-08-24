/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/19 8:59 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import { GET_PRICE_HISTORY } from '../../services/queries/tradeHistory'
import NumberFormat from 'react-number-format'
import { cSymbol, pageSize, POLLING_INTERVAL } from '../../constant'
import { formatEther } from 'ethers/lib/utils'
import { RelativeTimeLocale } from '../../functions/DateTime'
import { getTradingStatus } from '../../functions'

export function NFTPriceHistory(props) {
  let { t } = useTranslation()
  const { nftToken, nftTokenMetaData } = props
  const tokenId = nftToken.id
  const where = { token: tokenId }
  const { loading, error, data } = useQuery(GET_PRICE_HISTORY, {
    variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      where: where
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL
  })
  if (loading)
    return (
      <section className="price-history">
        <h3>{t('price history')}</h3>
        <div className="h-20 loader rounded"></div>
      </section>
    )
  if (error) {
    return <p>Load price error.</p>
  }

  return (
    <section className="price-history">
      <h3>{t('price history')}</h3>
      <div className="list">
        {data.tradingHistories.map((row, index) => {
          return (
            <dl key={row.id}>
              <dt>
                <p>
                  <NumberFormat
                    thousandSeparator={true}
                    displayType={'text'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={formatEther(row.price)}
                  />{' '}
                  {cSymbol()}
                </p>
                <p>{getTradingStatus(row.event, t)}</p>
              </dt>
              <dd>
                <p>{RelativeTimeLocale(row.createdAt, t('time locale'))}</p>
              </dd>
            </dl>
          )
        })}
      </div>
    </section>
  )
}
