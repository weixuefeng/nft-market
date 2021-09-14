import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import NewAddress from 'components/layouts/NewAddress'
import { VideoCameraIcon } from '@heroicons/react/solid'
import { useTokenDescription } from 'hooks/useTokenDescription'
import { getNftDetailPath } from 'functions'
import NftCardFooter from './NFTCardFooter'
import { RelativeTimeLocale } from 'functions/DateTime'

export function NFTListCard(props) {
  const { t } = useTranslation()
  const { item } = props

  const tokenMetaData = useTokenDescription(item.uri)
  if (!tokenMetaData) {
    return <div>loading...</div>
  }
  const tokenProfile = (
    <div className="profile">
      <Link href={getNftDetailPath(item.id)}>
        <a>
          <h3>{tokenMetaData.tokenName}</h3>
          <dl>
            <dd>
              <span className="font-mono">
                <NewAddress size="short" address={item.minter} /> {t('created on')}{' '}
                {RelativeTimeLocale(item.mintTime, t('time locale'))}
              </span>
            </dd>
          </dl>
        </a>
      </Link>
    </div>
  )

  if (tokenMetaData.nftType === 'video') {
    return (
      <li className="item">
        <Link href={getNftDetailPath(item.id)}>
          <a>
            {/* NFT Cover */}
            <div className="cover">
              <div className="perfect_square">
                <video controls loop muted playsInline poster={tokenMetaData.tokenImage}>
                  <source src={tokenMetaData.tokenVideo}></source>
                </video>
              </div>
              <div className="tl collection_name">
                <p className="collection_name">
                  {item.contract.name} (#{item.tokenId})
                </p>
              </div>
              <div className="tr">
                <VideoCameraIcon className="w-6 h-6" />
              </div>
            </div>
          </a>
        </Link>
        {tokenProfile}
        <Link href={getNftDetailPath(item.id)}>
          <a>
            <NftCardFooter {...props} />
          </a>
        </Link>
      </li>
    )
  } else {
    return (
      <li className="item">
        <Link href={getNftDetailPath(item.id)}>
          <a>
            {/* NFT Cover */}
            <div className="cover">
              <div className="perfect_square">
                <img src={tokenMetaData.tokenImage} alt="" />
              </div>
              <div className="tl collection_name">
                <p className="collection_name">
                  {item.contract.name} (#{item.tokenId})
                </p>
              </div>
            </div>
          </a>
        </Link>
        {tokenProfile}
        <Link href={getNftDetailPath(item.id)}>
          <a>
            <NftCardFooter {...props} />
          </a>
        </Link>
      </li>
    )
  }
}
