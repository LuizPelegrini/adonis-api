import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { UpdateValidator } from 'App/Validators/User/Main'

export default class MainController {
  public async show({ auth }: HttpContextContract) {
    const user = auth.user!
    await user.load('avatar') // loads avatar info

    return user
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const user = auth.user! // ! because auth middleware is being used so we know the user data is available
    const data = await request.validate(UpdateValidator)

    const existentUsers = await User.query()
      .where({ username: data.username })
      .orWhere({ email: data.email })

    // make sure the email and username are not taken by someone else
    for (let i = 0; i < existentUsers.length; i++) {
      const existentUser = existentUsers[i]

      if (existentUser && existentUser.id !== user.id) {
        return response.notAcceptable({ error: { message: 'Username/Email already taken' } })
      }
    }

    user.merge(data)

    await user.save()

    return user
  }
}
