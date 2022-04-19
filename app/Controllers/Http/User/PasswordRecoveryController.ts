import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/PasswordRecovery'
import { faker } from '@faker-js/faker'
import { User, UserKey } from 'App/Models'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class PasswordRecoveryController {
  public async store({ request, response }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)

    // finds the user by the email
    const user = await User.findByOrFail('email', email)

    // generates a random key to identify the user later on
    const key = `${faker.datatype.uuid()}${new Date().getTime()}`
    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    // Transaction (user_key creation + send email)
    await Database.transaction(async (trx) => {
      // create a user_key that relates to the user
      const userKey = new UserKey()
      userKey.useTransaction(trx)
      userKey.userId = user.id
      userKey.key = key
      await userKey.save()

      // send password recovery email
      await Mail.send((message) => {
        message.to(email)
        message.from('contact@facebook.com', 'Facebook')
        message.subject('Facebook - Password Recovery')
        message.htmlView('emails/password_recovery', { link })
      })

      return response.noContent()
    })
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, password } = await request.validate(UpdateValidator)
    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()

    // Transaction (user password update + key invalidation)
    await Database.transaction(async (trx) => {
      user.useTransaction(trx)
      userKey.useTransaction(trx)

      // update user password
      user.password = password
      await user.save()

      // invalidates key
      await userKey.delete()

      return response.ok({ message: 'Password reset' })
    })
  }
}
