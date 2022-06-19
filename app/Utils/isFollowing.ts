import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { User } from 'App/Models'

// check whether the authenticated user is following the user whose profile is being requested
export const isFollowing = async (user: User, auth: AuthContract) => {
  // only add isFollowing info when the user is not the same as the auth user.
  // example, User A is requesting to see the the followers of User B, and User A is following User B, so in this case, we dont need to add the isFollowing in the UserA when displaying User B followers' list
  if (user.id !== auth.user!.id) {
    const isFollowing = await auth
      .user!.related('following')
      .query()
      .where({ following_id: user.id })
      .first()

    // append isFollowing to body response
    user.$extras.isFollowing = !!isFollowing
  }
}
