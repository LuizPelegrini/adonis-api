import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { IndexValidator } from 'App/Validators/User/Follower'

export default class FollowersController {
  public async index(ctx: HttpContextContract) {
    const { request, params } = ctx

    // validate path params
    const { username } = await request.validate({
      data: {
        username: params.username,
      },
      schema: new IndexValidator(ctx).schema,
    })

    const user = await User.query()
      .where({ username })
      .preload('followers', (query) => {
        query.select(['id', 'name', 'createdAt'])
        query.orderBy('name', 'asc')
        query.preload('avatar')
      })
      .firstOrFail()

    return user.followers
  }

  // public async destroy({ params, auth }: HttpContextContract) {
  // Maybe reuse FollowsController.destroy??
  // }
}
