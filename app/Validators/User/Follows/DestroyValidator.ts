import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DestroyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    followingId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
  })

  public messages = {}
}
