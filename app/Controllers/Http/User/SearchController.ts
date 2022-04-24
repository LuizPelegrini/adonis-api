import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'

export default class SearchesController {
  public async index({ request, response }: HttpContextContract) {
    const { keyword } = request.qs()

    if (!keyword) {
      return response.status(422).send({
        error: {
          message: `Missing query param 'keyword'`,
        },
      })
    }

    const users = await User.query()
      .where('name', 'LIKE', `%${keyword}%`)
      .orWhere('username', 'LIKE', `%${keyword}%`)
      .orWhere('email', 'LIKE', `%${keyword}%`)
      .preload('avatar')

    return users
  }
}
