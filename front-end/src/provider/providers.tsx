"use client";

import { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          solana: {
            createOnLogin: "all-users",
          },
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
        solanaClusters: [
          {
            name: "devnet",
            rpcUrl: "https://api.devnet.solana.com",
            blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
          },
        ],
        appearance: {
          walletChainType: "solana-only",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
