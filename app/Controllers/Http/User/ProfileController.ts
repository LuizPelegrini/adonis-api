import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { ShowValidator } from 'App/Validators/User/Profile'

export default class ProfileController {
  public async show(ctx: HttpContextContract) {
    const { request, params, auth } = ctx

    // validate path params
    const { username } = await request.validate({
      data: {
        username: params.username,
      },
      schema: new ShowValidator(ctx).schema,
    })

    // informacoes do username
    const user = await User.query()
      .where({ username })
      .preload('avatar')
      .withCount('posts')
      .withCount('followers')
      .withCount('following')
      .firstOrFail()

    // if the user whose profile is being requested is different than the user who is making th request...
    if (user.id !== auth.user!.id) {
      // check whether the authenticated user is following the user whose profile is being requested
      const isFollowing = await auth
        .user!.related('following')
        .query()
        .where({ following_id: user.id })
        .first()

      // append isFollowing to body response
      user.$extras.isFollowing = !!isFollowing
    }

    return user.serialize({
      fields: {
        omit: ['email', 'createdAt', 'updatedAt', 'rememberMeToken'],
      },
    })
  }
}
