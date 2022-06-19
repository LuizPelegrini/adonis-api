import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import { faker } from '@faker-js/faker'

test.group('/auth', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should be able to authenticate with valid credentials', async ({ client, assert }) => {
    // arrange
    const user = await UserFactory.merge({ password: 'secret' }).create()

    // action
    const response = await client.post('/auth').json({
      email: user.email,
      password: 'secret',
    })

    // assert
    response.assertStatus(200)
    assert.exists(response.body().token)
  })

  test('should not be able to authenticate with invalid credentials', async ({ client }) => {
    const response = await client.post('/auth').json({
      email: faker.internet.email(),
      password: 'secret',
    })

    response.assertStatus(400)
  })

  test('should be able to delete token after logout', async ({ client, assert }) => {
    const user = await UserFactory.merge({ password: 'secret' }).create()

    const { response } = await client.post('/auth').json({
      email: user.email,
      password: 'secret',
    })

    const deleteResponse = await client
      .delete('/auth')
      .header('Authorization', `Bearer ${response.body.token}`)

    const apiToken = await Database.from('api_tokens').where({ user_id: user.id }).first()

    deleteResponse.assertStatus(200)
    assert.isNull(apiToken)
  })
})
