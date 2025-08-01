import express from "express";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

export const depositRouter = express.Router();

depositRouter.post("/", async (req, res) => {
  try {
    const { owner, amountLamports } = req.body as { owner: string; amountLamports: number };

    if (!owner) return res.status(400).json({ error: "missing owner" });

    const toPubkey = new PublicKey(owner);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    // devnet faucet wallet (generate once & airdrop).
    const faucet = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.DEV_FAUCET_SECRET!))
    );

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: faucet.publicKey,
        toPubkey,
        lamports: amountLamports ?? 1 * LAMPORTS_PER_SOL,
      })
    );

    const sig = await sendAndConfirmTransaction(connection, tx, [faucet]);
    return res.json({ signature: sig });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "deposit failed" });
  }
}); 