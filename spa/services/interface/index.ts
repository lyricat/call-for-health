export interface IUser {
  id: number,
  username: string,
  name: string,
  weiboId: number,
  kycState: number,
  role: string,
  createdAt: string,
  updatedAt: string,
  kyc?: IKYC
}

export interface IKYC {
  resultCode: number
  resultMessage: string
  errorMessage: string
  realName: string
  realId: string
  uniqueHash: string
  passedAt: string
}

export type RequirementStatus = 'PENDING' | 'CONFIRMED' | 'HIDDEN'

export interface IRequirement {
  id: number,
  creatorId: number,
  txId: string,
  latestTxId: string,
  text: string,
  location: string,
  contacts: string,
  sourceUrl: string,
  products: Array<any>,
  status: RequirementStatus,
  createdAt: string,
  updatedAt: string
}

export interface IAttachment {
  id: number,
  creatorId: number,
  requirementId: number,
  type: string,
  data: string,
  txId: string,
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

export interface ILogin {
  username: string
  password: string
}
