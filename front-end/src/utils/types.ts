export interface userInfo {
  _id?: string;
  wallet: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  following?: number;
  nonce?: string;
  error?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface coinInfo {
  _id?: string;
  creator: userInfo;
  name: string;
  ticker: string;
  description?: string;
  decimals: number;
  token: string;
  tokenReserves: number;
  lamportReserves: number;
  url: string;
  progressMcap: number;
  date: Date;
  limit: number;
  bondingCurve: boolean;
}

export interface msgInfo {
  _id?: string;
  user: userInfo;
  sender?: userInfo;
  coin: coinInfo;
  message: string;
  msg?: string;
  image?: string;
  img?: string;
  likes?: number;
  replies?: replyInfo[];
  time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface replyInfo {
  _id?: string;
  user: userInfo;
  message: string;
  image?: string;
  likes?: number;
  coinId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface tradeInfo {
  _id?: string;
  coin: coinInfo;
  record: tradeRecord[];
  totalTrades?: number;
  totalVolume?: number;
}

export interface tradeRecord {
  _id?: string;
  user: userInfo;
  type: 'buy' | 'sell';
  amount: number;
  solAmount: number;
  transactionHash: string;
  date: Date;
}
