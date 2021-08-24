/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/17 11:49 上午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import React from 'react'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { addressIsVerified } from 'constant'

export default function VerifiedAddress(props) {
  const { address } = props
  if (addressIsVerified(address)) {
    return <BadgeCheckIcon className="verified inline-block text-yellow-500 w-4 h-4" />
  } else {
    return <></>
  }
}
