import Route from '@ioc:Adonis/Core/Route'

Route.post('/users/register', 'User/RegisterController.store')
