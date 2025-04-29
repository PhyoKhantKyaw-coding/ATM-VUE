// src/api/index.ts
import * as products from './products'
import * as login from './login'
import * as user from './users'
import * as register from './register'
import * as transfer from './transfer'

class API {
  products = products
  user = user
  transfer = transfer
  login = login
  register = register
}
const api = new API()
export default api
