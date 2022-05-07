import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, DestroyValidator } from 'App/Validators/User/Follows'

export default class FollowsController {
  public async store(ctx: HttpContextContract) {
    const { request, params, auth, response } = ctx

    // validate path parameter
    const { followingId } = await request.validate({
      data: {
        followingId: params.id,
      },
      schema: new StoreValidator(ctx).schema,
    })

    if (auth.user!.id === followingId) {
      return response.unprocessableEntity({ error: { message: `User can't follow himself ` } })
    }

    await auth.user!.related('following').attach([followingId])
  }

  public async destroy(ctx: HttpContextContract) {
    const { request, params, auth } = ctx

    // validate path parameter
    const { followingId } = await request.validate({
      data: {
        followingId: params.id,
      },
      schema: new DestroyValidator(ctx).schema,
    })

    await auth.user!.related('following').detach([followingId])
  }
}
