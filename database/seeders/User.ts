import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

// create mock users when running 'node ace db:seed'
export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      email: 'luiz@admin.my',
      password: '1234567890',
    })
  }
}
