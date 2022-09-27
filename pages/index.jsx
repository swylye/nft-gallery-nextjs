import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { NFTCard } from '../components/NFTCard'

const Home = () => {
  const [walletAddress, setWalletAddress] = useState("")
  const [collectionAddress, setCollectionAddress] = useState("")
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)
  const [pageKey, setPageKey] = useState("")

  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

  const fetchNFTs = async () => {
    let nfts
    const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTs`
    var requestOptions = {
      method: "GET"
    }

    if (!collectionAddress.length) {
      console.log("Fetching NFTs owned by address...")
      const fetchURL = `${baseURL}?owner=${walletAddress}`
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("Fetching NFTs for collection owned by address...")
      const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log(nfts)
      setNFTs(nfts.ownedNfts)
      if (nfts.pageKey) {
        console.log("Page key: ", nfts.pageKey)
        setPageKey(nfts.pageKey)
      }
      else {
        console.log("No page key")
        setPageKey("")
      }
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collectionAddress.length) {
      const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTsForCollection`
      const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=true`
      var requestOptions = {
        method: "GET"
      }
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
        if (nfts.nextToken) {
          console.log("Next token: ", parseInt(nfts.nextToken, 16))
          setPageKey(nfts.nextToken)
        }
        else {
          console.log("No next token")
          setPageKey("")
        }
      }
    }
  }

  const fetchMoreNFTs = async () => {
    const requestOptions = {
      method: "GET"
    }
    let baseURL, fetchURL, nfts

    if (fetchForCollection) {
      baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTsForCollection`
      fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=true&startToken=${pageKey}`
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (nfts) {
        console.log("New NFTs in collection:", nfts)
        setNFTs(prev => [...prev, ...nfts.nfts])
        if (nfts.nextToken.length > 0) {
          console.log("Next token: ", parseInt(nfts.nextToken, 16))
          setPageKey(nfts.nextToken)
        }
        else {
          console.log("No next token")
          setPageKey("")
        }
      }
    }
    else {
      baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTs`

      if (!collectionAddress.length) {
        console.log("Fetching new NFTs owned by address...")
        const fetchURL = `${baseURL}?owner=${walletAddress}&pageKey=${pageKey}`
        nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      } else {
        console.log("Fetching new NFTs for collection owned by address...")
        const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}&pageKey=${pageKey}`
        nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      }

      if (nfts) {
        console.log(nfts)
        setNFTs(prev => [...prev, ...nfts.ownedNfts])
        if (nfts.pageKey.length > 0) {
          console.log("Page key: ", nfts.pageKey)
          setPageKey(nfts.pageKey)
        }
        else {
          console.log("No page key")
          setPageKey("")
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full items-center justify-center gap-y-2">
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50"
          onChange={(e) => { setWalletAddress(e.target.value) }}
          value={walletAddress} type="text"
          disabled={fetchForCollection}
          placeholder="Input wallet address here" />
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50"
          onChange={(e) => { setCollectionAddress(e.target.value) }}
          value={collectionAddress} type="text"
          placeholder="Input collection address here" />
        <label className='text-gray-600'>
          <input
            className='mr-2'
            type="checkbox"
            onChange={(e) => { setFetchForCollection(e.target.checked) }}
          />
          Fetch for collection
        </label>
        <button
          className="disabled:bg-slate-500 text-white rounded-md px-6 py-2 bg-blue-400"
          onClick={() => { fetchForCollection ? fetchNFTsForCollection() : fetchNFTs() }}
        >
          Let's go
        </button>
      </div>
      <div className="relative flex py-5 items-center w-5/6">
        <div className="flex-grow border-t-2 border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-600 font-semibold">NFT Gallery</span>
        <div className="flex-grow border-t-2 border-gray-600"></div>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length
          ? NFTs.map((nft, index) => {
            return (
              <NFTCard nft={nft}
                key={index}
              />
            )
          })
          : "Nothing to show..."
        }
      </div>
      {pageKey &&
        <button onClick={() => fetchMoreNFTs()}>
          Load more...
        </button>
      }
    </div>
  )
}

export default Home
