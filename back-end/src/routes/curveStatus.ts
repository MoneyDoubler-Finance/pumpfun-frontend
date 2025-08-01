import { Router } from "express";
import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../program/programId";

export const curveStatusRoutes = Router();

/**
 * Query status of a bonding-curve PDA.
 *   GET /api/curve-status?mint=<mintPubkey>
 * Returns: { found: boolean }
 */
curveStatusRoutes.get("/", async (req, res) => {
  const mint = req.query.mint as string;
  if (!mint) return res.status(400).json({ error: "missing mint param" });

  try {
    const connection = new Connection("https://api.devnet.solana.com");
    const [curvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("curve"), new PublicKey(mint).toBytes()],
      PROGRAM_ID
    );

    const acctInfo = await connection.getAccountInfo(curvePda);
    return res.json({ found: Boolean(acctInfo) });
  } catch (err) {
    console.error("curve-status error", err);
    return res.status(500).json({ error: "internal" });
  }
}); 