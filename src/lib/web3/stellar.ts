import { Horizon, Keypair, TransactionBuilder, Networks, Memo, Operation, Asset } from "@stellar/stellar-sdk";
import crypto from "crypto";

export interface StellarLogResult {
  txHash: string;
  memo: string;
  healthScore: number;
  stellarExplorerUrl: string;
  sourceAccount?: string;
  status: "CONFIRMED" | "SIMULATED_TESTNET";
}

/**
 * Log health anomaly score and verification memo on Stellar Testnet
 */
export async function logHealthScoreOnStellar(
  healthScore: number,
  reportId: string,
  patientHash: string
): Promise<StellarLogResult> {
  const secret = process.env.STELLAR_SECRET_KEY;
  const horizonUrl = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
  
  // Create a compact 28-character text memo: "OH:<score>:<shortReportId>"
  const compactId = reportId.slice(-8);
  const memoText = `OH:S${healthScore}:${compactId}`.slice(0, 28);

  // If live Stellar key is provided, execute testnet transaction
  if (secret && secret.startsWith("S") && secret.length === 56) {
    try {
      const server = new Horizon.Server(horizonUrl);
      const sourceKeypair = Keypair.fromSecret(secret);
      const account = await server.loadAccount(sourceKeypair.publicKey());
      const fee = await server.fetchBaseFee();

      // Submit zero/micro-payment to self with memo
      const transaction = new TransactionBuilder(account, {
        fee: fee.toString(),
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: sourceKeypair.publicKey(),
            asset: Asset.native(),
            amount: "0.00001",
          })
        )
        .addMemo(Memo.text(memoText))
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);
      const response = await server.submitTransaction(transaction);

      return {
        txHash: response.hash,
        memo: memoText,
        healthScore,
        stellarExplorerUrl: `https://stellar.expert/explorer/testnet/tx/${response.hash}`,
        sourceAccount: sourceKeypair.publicKey(),
        status: "CONFIRMED",
      };
    } catch (err) {
      console.warn("Live Stellar Testnet submission error, falling back to simulated hash:", err);
    }
  }

  // Generate deterministic Stellar transaction hash
  const hashPreimage = `${patientHash}:${reportId}:${healthScore}:${Date.now()}`;
  const deterministicHash = crypto.createHash("sha256").update(hashPreimage).digest("hex");

  return {
    txHash: deterministicHash,
    memo: memoText,
    healthScore,
    stellarExplorerUrl: `https://stellar.expert/explorer/testnet/tx/${deterministicHash}`,
    status: "SIMULATED_TESTNET",
  };
}
