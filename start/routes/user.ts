import Route from '@ioc:Adonis/Core/Route'

Route.post('/users/register', 'User/RegisterController.store')
Route.get('/users/register/:key', 'User/RegisterController.show')
Route.put('/users/register', 'User/RegisterController.update')

Route.post('/users/password-recovery', 'User/PasswordRecoveryController.store')
Route.put('/users/password-recovery', 'User/PasswordRecoveryController.update')

Route.get('/users', 'User/ProfileController.show').middleware('auth')
Route.put('/users', 'User/ProfileController.update').middleware('auth')

Route.put('/users/avatar', 'User/AvatarController.update').middleware('auth')
Route.delete('/users/avatar', 'User/AvatarController.destroy').middleware('auth')
