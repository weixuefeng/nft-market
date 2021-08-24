import React from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { useTheme } from 'next-themes'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const { resolvedTheme } = useTheme()

  return (
    <a
      href="#"
      rel="nofllow"
      onClick={e => {
        e.preventDefault()
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      <div className="theme-toggle">
        {resolvedTheme === 'light' ? <MoonIcon className="moon" /> : <SunIcon className="sun" />}
      </div>
    </a>
  )
}

export default ThemeToggle
