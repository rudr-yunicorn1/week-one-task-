import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth' // We'll create these
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
  async googleCallback({ ally, auth, response, session }: HttpContext) {
    const google = ally.use('google')

    // Handle possible errors (user denied access, etc.)
    if (google.accessDenied()) {
      session.flash('error', 'You cancelled the login with Google.')
      return response.redirect('/')
    }

    if (google.stateMisMatch()) {
      session.flash('error', 'Request expired. Please try again.')
      return response.redirect('/')
    }

    if (google.hasError()) {
      session.flash('error', 'Something went wrong with Google login.')
      return response.redirect('/')
    }

    // Get user details from Google
    const googleUser = await google.user()

    // Find user by email (or create new one)
    let user = await User.findBy('email', googleUser.email)

    if (!user) {
      // Create new user (password not needed for social login)
      user = await User.create({
        email: googleUser.email!,
        // You can add fullName if available: googleUser.name
        // password: not required, but you can set a random one or leave null if column allows
      })
    }

    // Log the user in (starts session)
    await auth.use('web').login(user)

    return response.redirect('/dashboard')
  }

  async showLogin({ view }: HttpContext) {
    return view.render('login')
  }
  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password) // Does find + verify safely
      await auth.use('web').login(user) // Start session
      return response.redirect('/dashboard')
    } catch {
      session.flash('error', 'Invalid email or password.')
      return response.redirect().back()
    }
  }
  async showRegister({ view }: HttpContext) {
    return view.render('register')
  }

  async register({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    // console.log('DATA', data)
    const user = await User.create({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
    })
    await mail.send((message) => {
      message
        .to(user.email)
        .from('r.techrt123@gmail.com')
        .subject('Welcome to our App')
        .htmlView('emails/welcome', {
          name: user.full_name,
        })
    })
    await auth.use('web').login(user)
    return response.redirect('/dashboard')
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }

  async dashboard({ view }: HttpContext) {
    const result = await User.query().count('id')
    const userCount = Number(result[0]['count'])
    // console.log('User Count:', userCount)
    return view.render('dashboard', { userCount })
  }
}
