import React from 'react'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

function Layout({ children }) {
  return (
    <>
      <SiteHeader />
      <div className="content-layout-main">{children}</div>
      <SiteFooter />
    </>
  )
}

export default Layout
