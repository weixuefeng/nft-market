import { Fragment, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import 'i18n'
import { useTranslation } from 'react-i18next'
import { Web3ReactProvider } from '@web3-react/core'
import getLibrary from 'functions/getLibrary'
import 'theme/style.scss'
import { ThemeProvider } from 'next-themes'
import Layout from 'layouts/Layout'
import { ApolloProvider } from '@apollo/client'
import Web3ReactManager from 'components/Web3ReactManager'
import client from '../services/queries'

const Web3ProviderNetwork = dynamic(() => import('components/Web3ProviderNetwork'), { ssr: false })
declare let window: any

function App({ Component, pageProps }) {
  const { t } = useTranslation()

  useEffect(() => {
    if ('undefined' !== window && !!window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false
    }
  })

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title key="title">{t('NewMall')}</title>

        <meta key="description" name="description" content="NewMall, Infrastructure for Metaverse" />

        <meta name="application-name" content="NewMall App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NewMall App" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <meta key="twitter:card" name="twitter:card" content="app" />
        <meta key="twitter:title" name="twitter:title" content="NewMall App" />
        <meta key="twitter:description" name="twitter:description" content="NewMall, Infrastructure for Metaverse" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QT8JGS8FM6"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments)}
          gtag('js', new Date());
          gtag('config', 'G-QT8JGS8FM6');
        </script>
      </Head>
      <ThemeProvider attribute="class">
        <ApolloProvider client={client}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <Web3ReactManager>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Web3ReactManager>
            </Web3ProviderNetwork>
          </Web3ReactProvider>
        </ApolloProvider>
      </ThemeProvider>
    </Fragment>
  )
}

export default App
