import Route from '@ioc:Adonis/Core/Route'

Route.post('/users/register', 'User/RegisterController.store')
Route.get('/users/register/:key', 'User/RegisterController.show')
Route.put('/users/register', 'User/RegisterController.update')
