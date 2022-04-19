import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/Register'
import { User, UserKey } from 'App/Models'
import { faker } from '@faker-js/faker'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RegisterController {
  public async store({ request, response }: HttpContextContract) {
    // validate request body
    const { email, redirectUrl } = await request.validate(StoreValidator)

    // Starts a transaction (create user + create user_key + send email)
    await Database.transaction(async (trx) => {
      // create user
      const user = new User()
      user.email = email

      // make sure the model is using transactions
      user.useTransaction(trx)

      // and save it
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
    })
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

    // Starts a transaction (update user + delete user_key)
    await Database.transaction(async (trx) => {
      // make sure the models are using the same transaction
      user.useTransaction(trx)
      userKey.useTransaction(trx)

      user.merge({ name, password, username })
      // save user data
      await user.save()
      // delete/invalidate key
      await userKey.delete()

      return response.ok({ message: 'User created' })
    })
  }
}
