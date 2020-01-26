export interface IUser {
  id: number,
  username: string,
  name: string,
  weiboId: number,
  kycState: number,
  role: string,
  createdAt: string,
  updatedAt: string
}

export interface IRequirement {
  id: number,
  creatorId: number,
  txId: string,
  latestTxId: string,
  text: string,
  products: Array<number>,
  productsAmount: Array<number>,
  status: string,
  createdAt: string,
  updatedAt: string
}

export interface IProduct {
  id: number,
  name: string,
  model: string,
  description: string,
  createdAt: string,
  updatedAt: string
}
