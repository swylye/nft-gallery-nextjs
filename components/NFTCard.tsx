export const NFTCard = ({ nft: any }) => {
    return (
        <div className="w-1/4 flex flex-col">
            <div className="max-w-xs rounded-md">
                <img
                    className="object-cover h-128 w-full rounded-t-md"
                    src={nft.media[0].gateway} />
            </div>
            <div>
                <p className="text-xl text-gray-800">{nft.title}</p>
                <p className="text-gray-600">{parseInt(nft.id.tokenId, 16)}</p>
                <div className="flex gap-x-4 items-center">
                    <p className="text-gray-600">{`${nft.contract.address.substr(0, 6)}...${nft.contract.address.substr(nft.contract.address.length - 4)}`}</p>
                    <button
                        className="text-gray rounded px-1 py-1 bg-slate-300"
                        onClick={() => navigator.clipboard.writeText(nft.contract.address)}>
                        Copy
                    </button>
                </div>
            </div>
            <div className="flex-grow mt-2">
                <p className="text-gray-600">{nft.description?.substr(0, 150)}</p>
            </div>
            <div className="flex justify-center mb-1 mt-2">
                <a
                    className="py-2 px-4 bg-blue-500 w-3/4 text-center rounded-md text-white cursor-pointer"
                    target="_blank"
                    href={`https://etherscan.io/token/${nft.contract.address}`}>
                    View on etherscan
                </a>
            </div>
        </div>
    )
}