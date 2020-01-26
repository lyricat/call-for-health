import http from '~/services/http'
import { IUser } from '~/services/interface'
import { IRequirement } from '~/services/interface'

export const getUser = (): Promise<IUser> => http.get('/user')

export const getRequirements = (): Promise<IRequirement[]> => http.get('/requirements')

export const getRequirement = (id:number): Promise<IRequirement> => http.get('/requirements/' + id)
