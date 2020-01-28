import http from '~/services/http'
import { IUser, IAttachment, IRequirement, ILogin } from '~/services/interface'

export const getRequirements = (query = {}): Promise<IRequirement[]> => http.get('/requirements', { params: query })

export const addRequirements = (data: IRequirement): Promise<IRequirement> => http.post('/requirements', { data })

export const editRequirements = (id:number, data: IRequirement): Promise<IRequirement> => http.put('/requirements/' + id, { data })

export const getRequirement = (id:number): Promise<IRequirement> => http.get('/requirements/' + id)

export const updateRequirementStatus = (id:number, data:any): Promise<IRequirement> => http.put(`/requirements/${id}/status`, { data })

export const getMe = (): Promise<IUser> => http.get('/account/me')

export const getMyRequirements = (): Promise<IRequirement[]> => http.get('/account/me/requirements')

export const getAttachments = (id:number): Promise<IAttachment[]> => http.get(`/requirements/${id}/attachments`)

export const getKYCLink = () => http.post('/kyc/faceid/start')

export const login = (data: ILogin) => http.post('/auth/login', { data })

export const register = (data: ILogin) => http.post('/auth/register', { data })
