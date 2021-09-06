import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import NewAddress from 'components/layouts/NewAddress'
import { VideoCameraIcon } from '@heroicons/react/solid'
import { useTokenDescription } from 'hooks/useTokenDescription'
import { getNftDetailPath } from 'functions'
import NftCardFooter from './NFTCardFooter'
import { DateTime } from '../../functions/DateTime'

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
                <NewAddress size="short" address={item.minter} /> {t('created on')} #{DateTime(item.mintTime)}
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
          {/* NFT Cover */}
          <div className="cover">
            <div className="perfect_square">
              <video controls loop muted playsInline poster={tokenMetaData.tokenImage}>
                <source src={tokenMetaData.tokenVideo}></source>
              </video>
            </div>
            <div className="bl collection_name" hidden>
              <p className="collection_name">CollectionName: #{item.tokenId}</p>
            </div>
            <div className="tr">
              <VideoCameraIcon className="w-6 h-6" />
            </div>
          </div>
        </Link>
        {tokenProfile}
        <Link href={getNftDetailPath(item.id)}>
          <NftCardFooter {...props} />
        </Link>
      </li>
    )
  } else {
    return (
      <li className="item">
        <Link href={getNftDetailPath(item.id)}>
          {/* NFT Cover */}
          <div className="cover">
            <div className="perfect_square">
              <img src={tokenMetaData.tokenImage} alt="" />
            </div>
            <div className="bl collection_name" hidden>
              <p className="collection_name">CollectionName: #{item.tokenId}</p>
            </div>
          </div>
        </Link>
        {tokenProfile}
        <Link href={getNftDetailPath(item.id)}>
          <NftCardFooter {...props} />
        </Link>
      </li>
    )
  }
}
