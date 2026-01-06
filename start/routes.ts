import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const CustomerContoller = () => import('#controllers/customer_controller')
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

router.get('/users', [CustomerContoller, 'index'])
router.get('/customer/show', [CustomerContoller, 'show'])
router.post('/customer', [CustomerContoller, 'create'])
router.get('/customer/create', [CustomerContoller, 'showcreate'])

router.get('/customer/update', [CustomerContoller, 'update'])
router.post('/customer/update', [CustomerContoller, 'edit'])

router.get('/customer/delete', [CustomerContoller, 'showdelete'])
router.get('/customer/distroy', [CustomerContoller, 'destroy'])

// router.get('')
