export default function () {
  try {
    const token = localStorage.getItem('token')
    return token
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      return ''
    }
  }
}
