import { createPublicClient, defineChain, http, parseAbi } from "viem";
export {GENESIS_CONTRACT} from "./genesis";
export const monad = defineChain({
  id: 143,
  name: "Monad Mainnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.monad.xyz"] } },
  blockExplorers: { default: { name: "MonadVision", url: "https://monadvision.com" } },
});
export const rpc = createPublicClient({ chain: monad, transport: http(process.env.MONAD_RPC_URL || "https://rpc.monad.xyz", {timeout: 10000, retryCount: 1}) });
export const ERC721_READ = parseAbi(["function ownerOf(uint256 tokenId) view returns (address)","function tokenURI(uint256 tokenId) view returns (string)"]);
export const MEMORY_READ = parseAbi([
  "function genesis() view returns (address)",
  "function memoryOf(uint256 tokenId) view returns ((uint8 choice, address awakenedBy, uint64 at))",
]);
