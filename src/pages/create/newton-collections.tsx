import 'i18n'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { FILE_UPLOAD_URL, JSON_UPLOAD_URL } from 'constant'
import { message, Upload } from 'antd'
import axios from 'axios'
import { UriResolver } from 'functions/UriResolver'
import { useERC721Contract, useNFTExchangeContract } from 'hooks/useContract'
import transactor from 'functions/Transactor'
import { NEWTON_COLLECTION_NFT_CONTRACT } from 'constant/settings'

export default function Me() {
  let { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  const [nftName, setNftName] = useState('')
  const [nftDesc, setNftDesc] = useState('')
  const [tokenImageIpfsHash, setTokenImageIpfsHash] = useState('')
  const nftExchangeContract = useERC721Contract(NEWTON_COLLECTION_NFT_CONTRACT)

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
        // console.log('tokenURI:', tokenURI)
        // todo: call erc721 contract to mint item
        //tx(writeContracts.NewtonNFT.mintItem(tokenURI, nftRoyaltyRate * 10, recipient))
        transactor(nftExchangeContract.mintWithTokenURI(account, tokenURI), t, () => {
          // console.log('create success')
        })
      }
      // console.log("RESULT:", result)
    } catch (e) {
      console.log(e)
      message.error(`mint error:`, e.message)
    }
  }

  const coverImagePreview =
    tokenImageIpfsHash === '' ? (
      ''
    ) : (
      <img src={UriResolver('ipfs://' + tokenImageIpfsHash)} alt="" hidden={tokenImageIpfsHash === ''} />
    )

  return (
    <div className="flex justify-center">
      <div className="space-y-6  max-w-4xl form">
        <section>
          <h2>+ Newton Collections</h2>
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
        <section>
          <div></div>
          <div>
            <button disabled={!account} type="button" onClick={onMintClicked} className="primary">
              {t('create now')}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
