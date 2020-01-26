export default async (res: string) => {
  try {
    const token = localStorage.setItem('token', res)
    return token
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      return ''
    }
  }
}
