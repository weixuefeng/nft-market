/**
 * useTokenDescription
 *
 * Provide the token uri, and parse the uri from ipfs, ar, https ...
 * and return the token info,like: tokenName, tokenDescription, nftType(image or video)
 * tokenImage and tokenVideo...
 *
 * usage:
 * ```
 * const { tokenName, tokenDescription, nftType, tokenImage, tokenVideo } = useTokenDescription(tokenUri)
 * ```
 */
import { getInfo } from 'functions'
import { GetUriProtocol, UriResolver } from 'functions/UriResolver'
import { useEffect, useState } from 'react'

export class TokenMetaData {
  tokenName: string = ''
  tokenDescription: string = ''
  nftType: string = 'image'
  tokenImage: string = ''
  tokenVideo: string = ''
  tokenAnimation: string = ''
  aspect_ratio: string = ''
  iframe_aspect_ratio: string = ''
}

export async function parseTokenMetaData(uri): Promise<TokenMetaData> {
  const data = new TokenMetaData()
  try {
    const resolverUrl = UriResolver(uri)
    const tokenExtraInfo = await getInfo(resolverUrl)
    if (!tokenExtraInfo) {
      return data
    }
    // Video Support, using `video` key
    if (tokenExtraInfo.video !== undefined) {
      const _videoUri = UriResolver(tokenExtraInfo.video.substring(tokenExtraInfo.video.lastIndexOf('/') + 1))
      data.nftType = 'video'
      data.tokenVideo = _videoUri
    }

    // TBD: support for `media`:[], mime:video|audio|image/type
    // TBD: tag
    // TBD: attributes

    if (tokenExtraInfo.description !== undefined) {
      data.tokenName = tokenExtraInfo.name
    }

    if (tokenExtraInfo.image !== undefined) {
      const protocol = GetUriProtocol(tokenExtraInfo.image)
      data.nftType = 'image'
      if (protocol === 'http' || protocol === 'https' || protocol === 'base64') {
        data.tokenImage = tokenExtraInfo.image
      } else {
        const imageUri = UriResolver(tokenExtraInfo.image.substring(tokenExtraInfo.image.lastIndexOf('/') + 1))
        data.tokenImage = imageUri
      }
    }
    // add animation
    if (tokenExtraInfo.animation_uri !== undefined) {
      const animationUrl = UriResolver(
        tokenExtraInfo.animation_uri.substring(tokenExtraInfo.animation_uri.lastIndexOf('/') + 1)
      )
      data.nftType = 'animation'
      data.tokenAnimation = animationUrl
      data.aspect_ratio = tokenExtraInfo.aspect_ratio
      data.iframe_aspect_ratio = tokenExtraInfo.iframe_aspect_ratio
    }
    if (tokenExtraInfo.description !== undefined) {
      data.tokenDescription = tokenExtraInfo.description
    }
    return data
  } catch (e) {
    console.error(e)
    return data
  }
}

export function useTokenDescription(uri) {
  let data = new TokenMetaData()
  const [tokenMetaData, setTokenMetaData] = useState<TokenMetaData>(data)
  useEffect(() => {
    if (!uri) {
      return
    }
    parseTokenMetaData(uri)
      .then(data => {
        setTokenMetaData(data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [uri])
  return tokenMetaData
}
