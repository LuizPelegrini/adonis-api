import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { isFollowing } from 'App/Utils/isFollowing'
import { IndexValidator } from 'App/Validators/User/Following'

export default class FollowingController {
  public async index(ctx: HttpContextContract) {
    const { request, params, auth } = ctx

    const { username } = await request.validate({
      data: {
        username: params.username,
      },
      schema: new IndexValidator(ctx).schema,
    })

    const user = await User.findByOrFail('username', username)

    await user.load('following')

    // for every user this user is following, check whether the authenticated user is also following them
    const queries = user.following.map(async (user) => await isFollowing(user, auth))

    await Promise.all(queries)

    return user.following
  }
}
