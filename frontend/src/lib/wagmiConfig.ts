"use client"; 
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  holesky,
} from "wagmi/chains";
import { defineChain } from "viem";

export const localhost = defineChain({
  id: 31337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
})


const projectID = process.env.NEXT_PUBLIC_PROJECT_ID || "";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: projectID, 
  chains: [holesky, localhost],
  ssr: false, 
});
