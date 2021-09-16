import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import { NFTokenDataList, OrderDirection } from '../entities'
import { NFT_TOKEN_LIST } from '../services/queries/list'
import { POLLING_INTERVAL } from '../constant'
import { useState } from 'react'
import { NEWTON_COLLECTION_NFT_CONTRACT } from '../constant/settings'
import Link from 'next/link'
import { useTokenDescription } from 'hooks/useTokenDescription'
import { getNftDetailPath } from 'functions'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

SwiperCore.use([Autoplay, Pagination, Navigation])

export default function Home() {
  const { t } = useTranslation()
  const [orderBy, setOrderBy] = useState('mintBlock')
  const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC)
  const where = { contract: NEWTON_COLLECTION_NFT_CONTRACT.toLowerCase() }
  const [filter, setFilter] = useState(where)
  const { loading, data, fetchMore, error } = useQuery<NFTokenDataList>(NFT_TOKEN_LIST, {
    variables: {
      skip: 0,
      first: 20,
      orderBy: orderBy,
      orderDirection: orderDirection,
      where: filter
    },
    fetchPolicy: 'no-cache',
    pollInterval: POLLING_INTERVAL
  })

  if (error) {
    console.log(error)
    return <p>Error :(</p>
  }

  if (loading) {
    return (
      <>
        <HomeHero />
        <div className="">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:py-8 lg:px-8">
            <p className="text-center text-base font-semibold uppercase text-gray-800 dark:text-white tracking-wider">
              Featured: Newton Collections
            </p>
          </div>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true
          }}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false
          }}
          breakpoints={{
            '640': {
              slidesPerView: 2,
              spaceBetween: 10
            },
            '768': {
              slidesPerView: 3,
              spaceBetween: 10
            },
            '1024': {
              slidesPerView: 5,
              spaceBetween: 10
            }
          }}
          className="homeSwiper"
        >
          <SwiperSlide>
            <Loader1 />
          </SwiperSlide>
          <SwiperSlide>
            <Loader1 />
          </SwiperSlide>
          <SwiperSlide>
            <Loader1 />
          </SwiperSlide>
          <SwiperSlide>
            <Loader1 />
          </SwiperSlide>
          <SwiperSlide>
            <Loader1 />
          </SwiperSlide>
          <SwiperSlide>
            <Loader1 />
          </SwiperSlide>
        </Swiper>
      </>
    )
  }

  function uniqBy(a, key) {
    let seen = new Set()
    return a.filter(item => {
      let k = key(item)
      return seen.has(k) ? false : seen.add(k)
    })
  }
  const uniqData = uniqBy(data?.tokens ?? [], item => {
    return item.id
  })

  function onFetchMore() {
    fetchMore({
      variables: {
        skip: data.tokens.length
      }
    })
  }

  const info = {
    data: uniqData,
    onFetchMore,
    setOrderBy,
    setOrderDirection,
    setFilter,
    where,
    showSubNav: false
  }
  return (
    <>
      <HomeHero />
      <div className="">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:py-8 lg:px-8">
          <p className="text-center text-base font-semibold uppercase text-gray-800 dark:text-white tracking-wider">
            Featured: Newton Collections
          </p>
        </div>
      </div>
      <HomeNewtonCollection {...info} />
    </>
  )
}

export function HomeNewtonCollection(props) {
  const { data } = props

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true
        }}
        navigation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        breakpoints={{
          '640': {
            slidesPerView: 2,
            spaceBetween: 10
          },
          '768': {
            slidesPerView: 3,
            spaceBetween: 10
          },
          '1024': {
            slidesPerView: 5,
            spaceBetween: 10
          }
        }}
        className="homeSwiper"
      >
        {data &&
          data.map(item => {
            return (
              <SwiperSlide key={item.id}>
                <NFTListCard item={item} />
              </SwiperSlide>
            )
          })}
      </Swiper>
    </>
  )
}

function NFTListCard(props) {
  const { item } = props
  const tokenMetaData = useTokenDescription(item.uri)
  const tokenProfile = <div className="title">{tokenMetaData.tokenName}</div>
  return (
    <div className="item">
      <Link href={getNftDetailPath(item.id)}>
        <a>
          <div className="cover">
            <div className="perfect_square">
              <img src={tokenMetaData.tokenImage} alt="" />
            </div>
          </div>
          {tokenProfile}
        </a>
      </Link>
    </div>
  )
}

function HomeHero() {
  const { t } = useTranslation()
  return (
    <div className="bg-yellow-300 rounded-xl mt-8">
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl text-gray-900 sm:text-4xl">
          <span className="block font-bold">{t('home page.hero title')}</span>
          <span className="block">{t('home page.hero desc')}</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link href="/browse">
              <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 hover:text-white hover:scale-105">
                {t('home page.browse market')}
              </a>
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <Link href="/create">
              <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-yellow-500 bg-white hover:bg-gray-100 hover:text-yellow-500 hover:scale-105">
                {t('create nft')}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Loader1() {
  return (
    <div className="item loading">
      <a>
        <div className="cover">
          <div className="perfect_square"></div>
        </div>
        <div className="title">~</div>
      </a>
    </div>
  )
}
