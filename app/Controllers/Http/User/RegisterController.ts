import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/User/Register'
import { User } from 'App/Models'
import { faker } from '@faker-js/faker'

export default class RegisterController {
  public async store({ request, response }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)

    const user = await User.create({ email })
    await user.save()

    // generates a random uuid
    const key = `${faker.datatype.uuid()}${new Date().getTime()}`

    // create a UserKey row with the user id
    await user.related('userKeys').create({ key })

    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    //TODO: send email

    return response.noContent()
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}
}
