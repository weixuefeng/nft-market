import { Dialog, Transition } from '@headlessui/react'
import {
  ArchiveIcon,
  ArrowSmLeftIcon,
  FireIcon,
  HomeIcon,
  MenuAlt1Icon,
  ShoppingBagIcon,
  SparklesIcon,
  TranslateIcon
} from '@heroicons/react/outline'
import React, { Fragment, useState } from 'react'
import { NewMallLogo, NewMallText } from 'components/icons'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import ThemeToggle from 'theme/themeToggle'
import UserMenu from 'components/Menu/UserMenu'

const navigationMenu = [
  { name: 'home', href: '/', icon: HomeIcon, exact: true },
  { name: 'browse', href: '/browse', icon: ShoppingBagIcon, exact: false },
  // { name: 'hot', href: '/hot', icon: FireIcon, exact: false },
  { name: 'mine', href: '/me', icon: ArchiveIcon, exact: false }
  // { name: 'create', href: '/create', icon: SparklesIcon, exact: false }
]

function SiteNavMenu(props) {
  const { t } = useTranslation()
  return (
    <>
      {navigationMenu.map((item, index) => (
        <Link key={index} href={item.href}>
          <a className="item">
            <item.icon className="mr-3 sm:mr-1 h-6 w-6" aria-hidden="true" />
            {t(item.name)}
          </a>
        </Link>
      ))}
    </>
  )
}

const Nav = props => {
  const { userMenu } = props
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { i18n } = useTranslation()

  return (
    <>
      <nav id="site-nav">
        <div className="spacer_top"></div>
        <nav className="navbar">
          <div className="wrapper">
            <div className="desktop-nav">
              <div className="brand">
                <Link href="/">
                  <a>
                    <NewMallLogo className="logo" />
                    <NewMallText className="text" />
                  </a>
                </Link>

                <div className="mobile-menu-btn">
                  <button type="button" aria-controls="mobile-menu" aria-expanded="false">
                    <MenuAlt1Icon onClick={() => setMobileSidebarOpen(true)} />
                  </button>
                </div>
              </div>

              {/* Main menu: desktop */}
              <div className="desktop-menu">
                <div className="desktop">
                  <SiteNavMenu className="flex-shrink" />
                </div>
              </div>
            </div>
            <ThemeToggle />
            <a
              href="/"
              className="lang-switch"
              onClick={e => {
                e.preventDefault()
                i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')
              }}
            >
              EN / 中
            </a>
            <UserMenu />
          </div>
        </nav>
      </nav>

      <Transition.Root show={mobileSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 lg:hidden"
          open={mobileSidebarOpen}
          onClose={setMobileSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="overlay" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div id="mobile-sidebar">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-14 pt-2">
                  <button
                    className="ml-2 flex items-center justify-center bg-black bg-opacity-0 dark:bg-opacity-0 focus:outline-none"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <ArrowSmLeftIcon className="h-10 w-10 text-yellow-400 " />
                  </button>
                </div>
              </Transition.Child>
              <head className="brand">
                <Link href="/">
                  <a>
                    <NewMallLogo className="w-12 h-12" />
                    <NewMallText className="w-auto h-7" />
                  </a>
                </Link>
                {'global.slogan'}
              </head>
              <nav>
                <div className="px-2 space-y-2" onClick={() => setMobileSidebarOpen(false)}>
                  <SiteNavMenu />
                </div>
                <div className="mt-6 pt-6">
                  <div className="px-2 space-y-1">
                    <a
                      href="/"
                      className="flex bg-white dark:bg-black rounded-lg items-center flex-row text-center p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-200 justify-center"
                      role="menuitem"
                      onClick={e => {
                        e.preventDefault()
                      }}
                    >
                      <TranslateIcon className="w-5 h-5 mr-1" />
                      <span>EN / 中</span>
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element */}
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default Nav
