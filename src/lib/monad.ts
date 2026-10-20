import { createPublicClient, defineChain, http, parseAbi } from "viem";
export const GENESIS_CONTRACT = "0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763" as const;
export const monad = defineChain({
  id: 143,
  name: "Monad Mainnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.monad.xyz"] } },
  blockExplorers: { default: { name: "MonadVision", url: "https://monadvision.com" } },
});
export const rpc = createPublicClient({ chain: monad, transport: http(process.env.MONAD_RPC_URL || "https://rpc.monad.xyz", {timeout: 10000, retryCount: 1}) });
export const ERC721_READ = parseAbi(["function ownerOf(uint256 tokenId) view returns (address)","function tokenURI(uint256 tokenId) view returns (string)"]);
