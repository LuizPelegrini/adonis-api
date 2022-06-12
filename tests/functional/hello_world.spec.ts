import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Example', (group) => {
  // this will start a global transaction before each test and rollback after test is completed
  // it will ensure we can create the same user within different tests (e.g avoiding duplicated username error in the database)
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('ensure login works', async (ctx) => {
    // pass 'password' at least because we have to use it as its un-hashed value below
    // create a user with 5 posts
    const user = await UserFactory.with('posts', 5).merge({ password: 'secret' }).create()

    const response = await ctx.client
      .post('/auth')
      .json({
        email: user.email,
        password: 'secret',
      })
      .send()

    response.assertStatus(200)
    ctx.assert.exists(response.body().token)
  })
})
