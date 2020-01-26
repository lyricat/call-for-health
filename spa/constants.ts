export const isProduct = process.env.APP_ENV === 'prod'

export const GA = ''

export const HOST = isProduct ? process.env.APP_API_HOST : 'http://api.localhost:3001'
