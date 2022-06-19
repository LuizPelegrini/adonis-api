import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { isFollowing } from 'App/Utils/isFollowing'
import { IndexValidator, DestroyValidator } from 'App/Validators/User/Follower'

export default class FollowersController {
  public async index(ctx: HttpContextContract) {
    const { request, params, auth } = ctx

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

    // for each follower of this user, add the info whether it's following you or not
    const queries = user.followers.map(async (user) => await isFollowing(user, auth))
    await Promise.all(queries)

    return user.followers
  }

  // This will remove a person who is following you from your followers list, kind of blocking that person from following you
  public async destroy(ctx: HttpContextContract) {
    const { request, params, auth } = ctx
    const { id } = await request.validate({
      data: {
        id: params.id,
      },
      schema: new DestroyValidator(ctx).schema,
    })

    // remove the person from your list of followers
    await auth.user!.related('followers').detach([id])
  }
}
