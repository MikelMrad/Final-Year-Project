export const getToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    const decoded = JSON.parse(atob(token.split('.')[1]))
    const expiry = decoded.exp * 1000
    if (expiry < Date.now()) {
      localStorage.removeItem('token')
      return null
    }
    return token
  }
  return null
}
