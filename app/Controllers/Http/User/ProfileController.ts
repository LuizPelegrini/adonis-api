import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Profile'

export default class ProfilesController {
  public async show({ auth }: HttpContextContract) {
    const user = auth.user!

    return user
  }

  public async update({ request, auth }: HttpContextContract) {
    const user = auth.user! // ! because auth middleware is being used so we know the user data is available
    const data = await request.validate(UpdateValidator)

    user.merge(data)

    await user.save()

    return user
  }
}
