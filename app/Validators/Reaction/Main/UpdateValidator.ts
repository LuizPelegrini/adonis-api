import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { reactions } from 'App/Utils'

export default class MainValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(reactions),
    postId: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
  })
  public messages = {}
}
