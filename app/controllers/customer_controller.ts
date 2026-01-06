import type { HttpContext } from '@adonisjs/core/http'

import UserData from '#models/customer_Data'
import User from '#models/user'

import { CustomerValidator } from '#validators/customer'

export default class CustomerController {
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.json({ message: 'List of users', users })
  }

  async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(CustomerValidator)
    const user = await UserData.create(data)

    return response.json({ message: 'User created', user })
  }

  async show({ response }: HttpContext) {
    const users = await UserData.all()
    return response.json({ message: 'List of users', users })
  }

  async showcreate({ view }: HttpContext) {
    return view.render('customer_create')
  }
  async update({ view }: HttpContext) {
    return view.render('update')
  }
  async edit({ request, response }: HttpContext) {
    const data = await request.validateUsing(CustomerValidator)
    const user = await UserData.query().where('email', data.email).update({
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
