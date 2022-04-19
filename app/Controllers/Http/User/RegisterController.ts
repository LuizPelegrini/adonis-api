import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/Register'
import { User, UserKey } from 'App/Models'
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

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()

    // creates a username based on the name
    const username = name.split(' ')[0].toLocaleLowerCase() + new Date().getTime()

    // save user data
    user.merge({ name, password, username })
    await user.save()

    // delete/invalidate key
    await userKey.delete()

    return response.ok({ message: 'User created' })
  }
}
