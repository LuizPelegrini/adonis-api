import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '500mb',
      extnames: ['jpeg', 'jpg', 'png', 'mp4', 'mov'],
    }),
  })
  public messages = {}
}
