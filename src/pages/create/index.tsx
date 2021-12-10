import 'i18n'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { hexAddress2NewAddress, isValidHexAddress, isValidNewAddress, newAddress2HexAddress } from 'utils/NewChainUtils'
import { FILE_UPLOAD_URL, JSON_UPLOAD_URL } from '../../constant'
import { message, Upload } from 'antd'
import axios from 'axios'
import { UriResolver } from '../../functions/UriResolver'
import { useERC721Contract, useNFTExchangeContract } from '../../hooks/useContract'
import transactor from '../../functions/Transactor'
import { NEWMALL_COLLECTION_CONTRACT } from '../../constant/settings'
import CreateConfirmModal from '../../components/Modal/CreateConfirmModal'
import { logPageView } from '../../functions/analysis'

export default function Me() {
  let { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  const [nftName, setNftName] = useState('')
  const [nftDesc, setNftDesc] = useState('')
  const [nftRoyaltyRate, setNftRoyaltyRate] = useState('0')
  const [tokenImageIpfsHash, setTokenImageIpfsHash] = useState('')
  const [royaltyRecipient, setRoyaltyRecipient] = useState('')
  const [userChangedRoyaltyRecipient, setUserChangedRoyaltyRecipient] = useState(false)
  const nftExchangeContract = useERC721Contract(NEWMALL_COLLECTION_CONTRACT)
  const [showModal, setShowModal] = useState(false)
  const [createTx, setCreateTx] = useState('')

  useEffect(() => {
    logPageView()
  }, [])

  function onUserChangeRoyaltyRecipient(e) {
    setUserChangedRoyaltyRecipient(true)
    setRoyaltyRecipient(e.target.value)
  }

  function getRoyaltyRecipient() {
    if (userChangedRoyaltyRecipient) {
      return royaltyRecipient
    } else {
      return account ? hexAddress2NewAddress(account, chainId) : account
    }
  }

  function getHexRoyaltyRecipient() {
    const recipient = getRoyaltyRecipient()
    if (isValidNewAddress(recipient)) {
      return newAddress2HexAddress(recipient)
    }
    if (isValidHexAddress(recipient)) {
      return recipient
    }
    return false
  }

  const uploadProps = {
    name: 'saveThisFileSafely',
    action: FILE_UPLOAD_URL,
    showUploadList: false,
    beforeUpload: file => {
      const allowedType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/heic']
      if (allowedType.includes(file.type) === false) {
        message.error(`${file.name} is not a valid image.`)
      }
      return allowedType.includes(file.type) ? true : Upload.LIST_IGNORE
    },
    onChange(info) {
      if (info.file.status === 'done') {
        const cid = info.file.response?.cid
        console.log('image upload: ', cid)
        setTokenImageIpfsHash(cid)
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        console.log('upload server response:', info.file.response)
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  const onMintClicked = async e => {
    e.preventDefault()
    if (nftName.length < 1 || nftDesc.length < 1 || tokenImageIpfsHash.length < 1) {
      console.log('token metadata is not valid.')
      return
    }
    const recipient = getHexRoyaltyRecipient()
    if (!recipient) {
      console.log('invalid royalty recipient')
      return
    }
    const tokenMetaData = {
      name: nftName,
      description: nftDesc,
      image: 'ipfs://' + tokenImageIpfsHash
    }
    try {
      const url = JSON_UPLOAD_URL
      const result = await axios.post(url, tokenMetaData)
      if (result?.status === 200 && result?.data?.cid) {
        const tokenURI = 'ipfs://' + result.data.cid
        console.log('tokenURI:', tokenURI)
        // todo: call erc721 contract to mint item
        //tx(writeContracts.NewtonNFT.mintItem(tokenURI, nftRoyaltyRate * 10, recipient))
        let res = await transactor(nftExchangeContract.mintItem(tokenURI, 0, account), t, () => {})
        if (res) {
          setShowModal(true)
          setCreateTx(res.hash)
        }
      }
      // console.log("RESULT:", result)
    } catch (e) {
      console.log(e)
      message.error(`mint error:`, e.message)
    }
  }

  function closeModal() {
    setNftName('')
    setNftDesc('')
    setTokenImageIpfsHash('')
    setShowModal(false)
  }

  const coverImagePreview =
    tokenImageIpfsHash === '' ? (
      ''
    ) : (
      <img src={UriResolver('ipfs://' + tokenImageIpfsHash)} alt="" hidden={tokenImageIpfsHash === ''} />
    )

  return (
    <div className="flex justify-center">
      <div className="space-y-6 max-w-4xl form w-full">
        <section>
          <h2>{t('create nft')}</h2>
        </section>

        {/* NFT Basic meta data */}
        <section>
          <header>
            <h3>{t('basic info')}</h3>
            <p>{t('basic description')}</p>
          </header>

          <div className="group">
            <div>
              <label htmlFor="nft_name">{t('name')}</label>
              <input
                value={nftName}
                onChange={e => {
                  setNftName(e.target.value)
                }}
                id="nft_name"
                name="nft_name"
                type="text"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="description">{t('description')}</label>
              <textarea
                value={nftDesc}
                onChange={e => {
                  setNftDesc(e.target.value)
                }}
                id="description"
                name="description"
                rows={3}
              />
              <p>{t('for description')}</p>
            </div>

            <div>
              <label htmlFor="cover_image">{t('cover image')}</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-800 border-dashed rounded-md space-y-1 text-center">
                <div hidden={tokenImageIpfsHash !== ''}>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <label htmlFor="file_upload">
                    <Upload {...uploadProps} className="text-green-500">
                      {t('upload a file')}
                    </Upload>
                  </label>
                  <p>PNG, JPG, GIF {t('up to')} 10MB</p>
                </div>
                {coverImagePreview}
              </div>
            </div>
          </div>
        </section>

        {/* Royalty Options */}
        {/*<section>*/}
        {/*  <header>*/}
        {/*    <h3>{t('royalty')}</h3>*/}
        {/*    <p>{t('royalty description')}</p>*/}
        {/*  </header>*/}

        {/*  <div className="group">*/}
        {/*    <div>*/}
        {/*      <label htmlFor="royalty_rate">{t('royalty rate')}</label>*/}

        {/*      <div className="mt-1 flex rounded-md">*/}
        {/*        <input*/}
        {/*          value={nftRoyaltyRate}*/}
        {/*          id="royalty_rate"*/}
        {/*          name="royalty_rate"*/}
        {/*          type="number"*/}
        {/*          inputMode="decimal"*/}
        {/*          className="focus:border-gray-300 block rounded-none rounded-l-md sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-800 text-center w-16"*/}
        {/*          onChange={e => {*/}
        {/*            setNftRoyaltyRate(parseFloat(e.target.value).toFixed(1))*/}
        {/*          }}*/}
        {/*          autoComplete="off"*/}
        {/*        />*/}
        {/*        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-800 text-gray-500 text-sm">*/}
        {/*          %*/}
        {/*        </span>*/}
        {/*      </div>*/}

        {/*      <div className="mt-2 flex rounded-md text-sm">*/}
        {/*        <span>0%</span>*/}
        {/*        <input*/}
        {/*          type="range"*/}
        {/*          id="royalty_rate_slider"*/}
        {/*          min={0}*/}
        {/*          max={10}*/}
        {/*          step={0.1}*/}
        {/*          value={nftRoyaltyRate}*/}
        {/*          className="w-full mx-2"*/}
        {/*          onChange={e => {*/}
        {/*            setNftRoyaltyRate(parseFloat(e.target.value).toFixed(1))*/}
        {/*          }}*/}
        {/*        />*/}
        {/*        <span>10%</span>*/}
        {/*      </div>*/}
        {/*    </div>*/}

        {/*    <div>*/}
        {/*      <label htmlFor="royalty_address">{t('royalty receiving address')}</label>*/}
        {/*      <input*/}
        {/*        onChange={onUserChangeRoyaltyRecipient}*/}
        {/*        value={getRoyaltyRecipient()}*/}
        {/*        id="royalty_address"*/}
        {/*        name="royalty_address"*/}
        {/*        type="text"*/}
        {/*        autoComplete="off"*/}
        {/*      />*/}
        {/*      <p>{t('for royalty receiving address')}</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        <section>
          <div></div>
          <div>
            <button disabled={!account} type="button" onClick={onMintClicked} className="primary">
              {t('create now')}
            </button>
            <CreateConfirmModal showModal={showModal} closeModal={closeModal} txHash={createTx} s />
          </div>
        </section>
      </div>
    </div>
  )
}
