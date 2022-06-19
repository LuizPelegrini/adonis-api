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

    // if user that is being queried is not the user who is making the request, then we can add isFollowing info. Otherwise, it'd be redundant to add isFollowing info for the user who is making the request to get his own following users.
    if (user.id !== auth.user!.id) {
      // for every user this user is following, check whether the authenticated user is also following them
      const queries = user.following.map(async (user) => await isFollowing(user, auth))
      await Promise.all(queries)
    }

    return user.following
  }
}
