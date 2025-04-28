// src/api/index.ts
import * as products from './products'
import * as login from './Login'
import * as user from './Users'
import * as register from './Register'
import * as transfer from './Transfer'

class API {
  products = products
  user = user
  transfer = transfer
  login = login
  register = register
}
const api = new API()
export default api
