/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/24 7:08 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import { notification } from 'antd'

export default function transactor(transaction, t, callback) {
  async function sendTx(tx) {
    try {
      let result
      if (tx instanceof Promise) {
        result = await tx
        const info = {
          message: t('transactor.local transaction sent'),
          description: result.hash
        }
        notification.info(info)
        callback()
        return result
      }
    } catch (e) {
      const err = {
        message: t('transactor.transaction error'),
        description: e.message + (e.data && e.data.message ? e.data.message : '')
      }
      notification.error(err)
      callback()
      return false
    }
  }
  return sendTx(transaction)
}
