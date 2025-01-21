import posthog from "posthog-js";

export const EVENTS = {
  WALLET_CONNECTED: "wallet_connected",
  TOKENS_CHANGED: "tokens_changed",
  SWAP_INITIATED: "swap_initiated",
  SWAP_COMPLETED: "swap_completed",
  LIQUIDITY_ADDED: "liquidity_added",
  LIQUIDITY_WITHDRAWN: "liquidity_withdrawn",
  FEES_CLAIMED: "fees_claimed",
  TRANSACTION_FAILED: "transaction_failed",
} as const;
type EventKeys = (typeof EVENTS)[keyof typeof EVENTS];
type EventTypes = {
  wallet_connected: {
    chain_id: number;
    wallet: `0x${string}`;
  };
  tokens_changed: {
    chain_id: number;
    from_token: string;
    to_token: string;
  };
  swap_initiated: {
    chain_id: number;
    wallet: `0x${string}`;
    from_token: string;
    to_token: string;
    amount_from: number;
    amount_to: number;
    gas_estimated: number;
  };
  swap_completed: {
    chain_id: number;
    transaction_hash: string;
    amount_to: number;
    status: string;
  };
  liquidity_added: {
    chain_id: number;
    pool_address: string;
    position_id: number;
    transaction_hash: string;
    amount_token0: number;
    amount_token1: number;
    position: "new" | "existing";
  };
  liquidity_withdrawn: {
    chain_id: number;
    pool_address: string;
    position_id: number;
    transaction_hash: string;
    amount_token0: number;
    amount_token1: number;
  };
  fees_claimed: {
    chain_id: number;
    pool_address: string;
    transaction_hash: string;
    amount: number;
  };
  transaction_failed: {
    error_code: string;
    error_message: string;
    transaction_type: string;
  };
};

export const track = <T extends EventKeys>(
  event: T,
  properties?: EventTypes[T],
) => {
  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.error("Failed to track event:", event, error);
  }
};
