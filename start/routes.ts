import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'

router.get('/', [AuthController, 'showLogin'])
router.post('/login', [AuthController, 'login'])
router.get('/register', [AuthController, 'showRegister'])
router.post('/register', [AuthController, 'register'])
router.get('/logout', [AuthController, 'logout'])
router.get('/dashboard', [AuthController, 'dashboard']).use(middleware.auth())

router.get('/google/redirect', async ({ ally }) => {
  await ally.use('google').redirect()
})

router.get('/google/callback', [AuthController, 'googleCallback'])
