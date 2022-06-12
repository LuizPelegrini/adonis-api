import Factory from '@ioc:Adonis/Lucid/Factory'
import { User } from 'App/Models'
import { PostFactory } from './PostFactory'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
})
  .relation('posts', () => PostFactory)
  .build()
