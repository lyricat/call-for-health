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
  hospitalName: string,
  hospitalAddress: string,
  hospitalCellphone: number,
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
  amount: number,
  description: string,
  createdAt: string,
  updatedAt: string
}
