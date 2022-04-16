import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/User/Register'
import { User } from 'App/Models'
import { faker } from '@faker-js/faker'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class RegisterController {
  public async store({ request, response }: HttpContextContract) {
    // validate request body
    const { email, redirectUrl } = await request.validate(StoreValidator)

    // create user and save it
    const user = await User.create({ email })
    await user.save()

    // generates a random uuid
    const key = `${faker.datatype.uuid()}${new Date().getTime()}`

    // create a UserKey row with the user id
    await user.related('userKeys').create({ key })

    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    // send email
    await Mail.send((message) => {
      message.to(email)
      message.from('contact@facebook.com', 'Facebook')
      message.subject('Account Creation')
      message.htmlView('emails/register', { link })
    })

    return response.noContent()
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}
}
