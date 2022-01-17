import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { parseTokenMetaData, TokenMetaData } from 'hooks/useTokenDescription'
import { useEffect, useState } from 'react'
import NewAddress from 'components/layouts/NewAddress'
import MoreMenu from 'components/Menu/MoreMenu'
import { Menu } from '@headlessui/react'
import VerifiedAddress from 'components/Widget/VerifiedAddress'
import NftAuctionCard from 'components/Widget/NFTAuctionCard'
import { getTokenInfoById, NFT_TOKEN } from 'services/queries/list'
import { NFTPriceHistory } from 'components/Widget/NFTPriceHistory'
import { useContractFee } from 'hooks/useContractFee'
import { useQuery } from '@apollo/client'
import { NFTBidPriceHistory } from 'components/Widget/NFTBidPriceHistory'
import { NFTokenSaleType } from 'entities'
import { POLLING_INTERVAL } from 'constant'
import MainLoadingView from 'components/layouts/MainLoadingView'
import { NFT_VIEWER_URL } from 'constant/settings'
import { DateTime } from 'functions/DateTime'
import { getNewChainExplorerUrl } from 'utils/NewChainUtils'
import { TARGET_CHAINID } from 'constant/settings'
import { isIOS, isMobile } from 'react-device-detect'
import { logPageView } from '../../functions/analysis'

function DetailSideBar(props) {
  const { nftToken } = props
  return (
    <div className="sidebar">
      <NftAuctionCard {...props} />
      {nftToken.strategyType === NFTokenSaleType.ENGLAND_AUCTION ? <NFTBidPriceHistory {...props} /> : <></>}
      <NFTPriceHistory {...props} />
    </div>
  )
}

export default function View() {
  const { t } = useTranslation()
  const router = useRouter()
  const param = router.query.params || []
  if (param.length !== 2) {
    return <div>error page</div>
  }
  const [metaData, setMetaData] = useState<TokenMetaData>()
  const lookTokenID = param[0] + '-' + param[1]
  const contractFee = useContractFee(param[0])

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getTokenInfoById(lookTokenID).then(data => {
      if (data === null || data.data === null || data.data.token === null) {
        return
      }
      parseTokenMetaData(data.data.token.uri)
        .then(meta => setMetaData(meta))
        .catch(error => {
          console.log('error:' + { error })
        })
    })
  }, [0])
  const { data, loading, error } = useQuery(NFT_TOKEN, {
    variables: {
      id: lookTokenID
    },
    pollInterval: POLLING_INTERVAL,
    fetchPolicy: 'cache-and-network'
  })
  if (error) {
    return <>Error :(</>
  }
  if (loading || metaData === undefined) {
    return <MainLoadingView />
  }

  const nftHeader = (
    <header>
      <div className="tags-a">
        <div className="token-uid">
          <span>
            {data.token.contract.name} (#{data.token.tokenId})
          </span>
        </div>
      </div>
      <h1>{metaData.tokenName}</h1>
      <p className="owner">
        {t('owner')}: <NewAddress address={data.token.owners[0].owner.id} size="short" />
      </p>
    </header>
  )

  function download(href, filename = '', url) {
    const a = document.createElement('a')
    a.download = filename
    a.href = href
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function downloadFile(url: string, filename = '') {
    fetch(url, {
      headers: new Headers({
        Origin: location.origin
      })
    })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob)
        download(blobUrl, filename, url)
        window.URL.revokeObjectURL(blobUrl)
      })
  }

  const nftMoreMenu = (
    <MoreMenu>
      <div>
        <Menu.Item>
          <a href={NFT_VIEWER_URL + '/view/' + param[0] + '/' + param[1]} target="_blank" rel="noopener noreferrer">
            {t('view in nft explorer')}
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            href={`${getNewChainExplorerUrl(TARGET_CHAINID)}/tokens/${param[0]}/instance/${param[1]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('view in blockchain explorer')}
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            hidden={window['android'] != undefined || (isIOS && window['ethereum'])}
            onClick={() => downloadFile(metaData.tokenImage, metaData.tokenName)}
          >
            {t('download resource')}
          </a>
        </Menu.Item>
      </div>
    </MoreMenu>
  )

  const nftCreationInfo = (
    <section className="nft-create-info">
      <div>
        <dl>
          <dt>
            {t('creator')}
            <VerifiedAddress address={data.token.minter} />
          </dt>
          <dd>
            <NewAddress address={data.token.minter} size="short" />
          </dd>
        </dl>
        <dl>
          <dt>{t('created on')}</dt>
          <dd>{DateTime(data.token.mintTime)}</dd>
        </dl>
        {/* <dl>
          <dt>{t('royalty')}</dt>
          <dd>{parseInt(contractFee.royaltyFee * 100 + '')}%</dd>
        </dl> */}
      </div>
    </section>
  )
  const nftDescription = (
    <section className="desc">
      <h3>{t('description')}</h3>
      <div>
        {metaData.tokenDescription.split(/\n+|<br \/>+|<br\/>+|<br>+/).map((str, index) => (
          <p key={index}>{str}</p>
        ))}
      </div>
    </section>
  )
  if (metaData.nftType === 'video') {
    return (
      <div className="nft_page">
        <div className="nft_main">
          {nftHeader}
          {nftMoreMenu}
          <section className="cover">
            <video controls loop muted playsInline poster={metaData.tokenImage}>
              <source src={metaData.tokenVideo} />
            </video>
          </section>
          {nftCreationInfo}
          {nftDescription}
        </div>
        <DetailSideBar nftToken={data.token} nftTokenMetaData={metaData} contractFee={contractFee} />
      </div>
    )
  } else if (metaData.nftType === 'animation') {
    //todo: add responsive for animation
    let width = 400
    let height = (width * 16) / 9
    return (
      <div className="nft_page">
        <div className="nft_main">
          {nftHeader}
          {nftMoreMenu}
          <section className="cover justify-center items-center">
            <iframe src={metaData.tokenAnimation} className={'rounded'} width={`${width}px`} height={`${height}px`} />
          </section>
          {nftCreationInfo}
          {nftDescription}
        </div>
        <DetailSideBar nftToken={data.token} nftTokenMetaData={metaData} contractFee={contractFee} />
      </div>
    )
  } else {
    return (
      <div className="nft_page">
        <div className="nft_main">
          {nftHeader}
          {nftMoreMenu}
          <section className="cover">
            <img src={metaData.tokenImage} alt="" />
          </section>
          {nftCreationInfo}
          {nftDescription}
        </div>
        <DetailSideBar nftToken={data.token} nftTokenMetaData={metaData} contractFee={contractFee} />
      </div>
    )
  }
}
