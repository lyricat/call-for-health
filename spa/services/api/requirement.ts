import http from '~/services/http'
import { IRequirement } from '~/services/interface/index'

export const add = (data: IRequirement): Promise<IRequirement> => http.post('/requirements', { data })

export const edit = (data: IRequirement): Promise<IRequirement> => http.post('/requirements', { data })
