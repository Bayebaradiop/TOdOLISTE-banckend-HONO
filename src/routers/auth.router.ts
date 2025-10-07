import { Hono } from 'hono'
import { AuthController } from '../controllers/auth.controller'

const authRouter = new Hono()
const authController = new AuthController()


authRouter.post('/register', authController.register)

authRouter.post('/login', authController.login)

authRouter.post('/logout', authController.logout)

export { authRouter }