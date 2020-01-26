export default async () => {
  try {
    const token = localStorage.getItem('token')
    return token
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      return ''
    }
  }
}
