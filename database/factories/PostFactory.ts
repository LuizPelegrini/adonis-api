import Factory from '@ioc:Adonis/Lucid/Factory'
import { Post } from 'App/Models'

export const PostFactory = Factory.define(Post, ({ faker }) => {
  return {
    description: faker.lorem.text(),
  }
}).build()
