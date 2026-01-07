import type { HttpContext } from '@adonisjs/core/http'

import UserData from '#models/customer_Data'
import User from '#models/user'

import { CustomerValidator } from '#validators/customer'

export default class CustomerController {
  async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users', { users })
  }

  async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(CustomerValidator)
    await UserData.create({
      full_name: data.full_name,
      email: data.email,
      age: data.age,
      city: data.city,
      position: data.position,
    })

    return response.redirect('/customer/show')
  }

  async show({ view }: HttpContext) {
    const customer = await UserData.all()
    return view.render('customerData', { customer })
  }

  async showcreate({ view }: HttpContext) {
    return view.render('customer_create')
  }
  async update({ view }: HttpContext) {
    return view.render('update')
  }
  async edit({ request, response }: HttpContext) {
    const data = await request.validateUsing(CustomerValidator)
    await UserData.query().where('email', data.email).update({
      full_name: data.full_name,
      age: data.age,
      city: data.city,
      position: data.position,
    })

    return response.redirect('/customer/show')
  }

  async showdelete({ view }: HttpContext) {
    return view.render('delete')
  }

  async destroy({ request, response }: HttpContext) {
    const email = request.input('email')
    await UserData.query().where('email', email).delete()

    return response.redirect('/customer/show')
  }
}
