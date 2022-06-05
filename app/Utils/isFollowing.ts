import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { User } from 'App/Models'

// check whether the authenticated user is following the user whose profile is being requested
export const isFollowing = async (user: User, auth: AuthContract) => {
  const isFollowing = await auth
    .user!.related('following')
    .query()
    .where({ following_id: user.id })
    .first()

  // append isFollowing to body response
  user.$extras.isFollowing = !!isFollowing
}
