import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { before } from 'node:test'

export default class CustomerData extends BaseModel {
  @column({ isPrimary: true })
  declare E_id: number

  @column()
  declare full_name: string | null

  @column()
  declare email: string

  @column()
  declare age: number | null

  @column()
  declare city: string | null

  @column()
  declare position: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
