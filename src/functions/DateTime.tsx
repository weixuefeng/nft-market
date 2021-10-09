import React, { useEffect, Component, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import DateCountdown from "react-date-countdown-timer"

const moment = require('moment/min/moment-with-locales')

// timestamp using unix timestamp in milliseconds

// Convert timestamp to YYYY-MM-DD HH:MM:SS
export function DateTime(timestamp = Date.now()) {
  return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
}

// Convert timestamp to relative time string
export function RelativeTime(timestamp = Date.now()) {
  let { t } = useTranslation()
  moment.locale(t('time locale'))
  return moment(timestamp).fromNow()
}

export function RelativeTimeLocale(timestamp = Date.now() / 1000, locale = 'en-us') {
  moment.locale(locale)
  return moment(timestamp * 1000).fromNow()
}

export function TimeDiff(startTime, endTime, t) {
  const diff = endTime - startTime
  let time = ''
  if (diff > 0) {
    let d = Math.floor(diff / (60 * 60 * 24))
    let h = Math.floor((diff / (60 * 60)) % 24)
    let m = Math.floor((diff / 60) % 60)
    let s = Math.floor(diff % 60)
    if (d > 0) {
      time += `${d}${t('time_d')}`
    }
    if (h > 0) {
      time += ` ${h}${t('time_h')}`
    }
    if (m > 0) {
      time += ` ${m}${t('time_m')}`
    }
    if (s > 0) {
      time += ` ${s}${t('time_s')}`
    }
  }
  return time
}

// Countdown
export function Countdown(timstamp) {
  const calculateTimeLeft = () => {
    const difference = +new Date(timstamp * 1000) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60)
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

  const timerComponents = []

  Object.keys(timeLeft).forEach(interval => {
    if (!timeLeft[interval]) {
      return
    }
    timerComponents.push(
      <span>
        {timeLeft[interval]}
        {interval}{' '}
      </span>
    )
  })
  return <>{timerComponents.length ? timerComponents : '-'}</>
}
