import type { HttpContext } from '@adonisjs/core/http'

import UserData from '#models/customer_Data'
import User from '#models/user'
import ExcelJS from 'exceljs'
import { CustomerValidator } from '#validators/customer'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class CustomerController {
  async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users', { users })
  }
  async export({ response }: HttpContext) {
    const customers = await UserData.all()

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Customers')

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'City', key: 'city', width: 25 },
      { header: 'Profile Picture', key: 'profile_photo', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ]

    customers.forEach((customer) => {
      worksheet.addRow({
        id: customer.E_id,
        name: customer.full_name,
        email: customer.email,
        age: customer.age,
        city: customer.city,
        profile_photo: customer.profile_photo
          ? `http://localhost:3333/${customer.profile_photo}`
          : 'No Image',
        createdAt: customer.createdAt?.toFormat('yyyy-MM-dd HH:mm:ss') || '',
        updatedAt: customer.updatedAt?.toFormat('yyyy-MM-dd HH:mm:ss') || '',
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename=customers.xlsx')
    return response.send(buffer)
  }

  async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(CustomerValidator)
    const profilePhoto = data.profile_photo

    if (!profilePhoto) {
      return response.badRequest('Profile photo is required')
    }

    const fileName = `${cuid()}.${profilePhoto.extname}`

    await profilePhoto.move(app.makePath('public/uploads/profiles'), {
      name: fileName,
    })
    await UserData.create({
      full_name: data.full_name,
      email: data.email,
      age: data.age,
      city: data.city,
      position: data.position,
      profile_photo: fileName,
    })

    return response.redirect('/customer/show')
  }

  async show({ view }: HttpContext) {
    const customer = await UserData.all()
    console.log(customer)
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
