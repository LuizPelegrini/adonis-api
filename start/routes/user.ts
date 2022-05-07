import Route from '@ioc:Adonis/Core/Route'

Route.get('/users', 'User/MainController.show').middleware('auth')
Route.put('/users', 'User/MainController.update').middleware('auth')

Route.post('/users/register', 'User/RegisterController.store')
Route.get('/users/register/:key', 'User/RegisterController.show')
Route.put('/users/register', 'User/RegisterController.update')

Route.post('/users/password-recovery', 'User/PasswordRecoveryController.store')
Route.put('/users/password-recovery', 'User/PasswordRecoveryController.update')

Route.get('/users/search', 'User/SearchController.index').middleware('auth')

Route.put('/users/avatar', 'User/AvatarController.update').middleware('auth')
Route.delete('/users/avatar', 'User/AvatarController.destroy').middleware('auth')

Route.post('/users/follow/:id', 'User/FollowsController.store').middleware('auth')
Route.delete('/users/follow/:id', 'User/FollowsController.destroy').middleware('auth')
