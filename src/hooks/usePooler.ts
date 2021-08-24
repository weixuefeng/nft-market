import { useEffect, useRef } from 'react'

// helper hook to call a function regularly in time intervals

export default function usePoller(fn, delay, extraWatch) {
  const savedCallback = useRef<any>()
  useEffect(() => {
    savedCallback.current = fn
  }, [fn])
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    let id = setInterval(tick, delay)
    return () => {
      clearInterval(id)
    }
  }, [fn])
  useEffect(() => {
    fn()
  }, [fn])
}
