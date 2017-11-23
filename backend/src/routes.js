// @flow

import register from '$modules/auth/handlers/register'
import login from '$modules/auth/handlers/login'
import verify from '$modules/auth/handlers/verify'
import refresh from '$modules/auth/handlers/refresh'
import notFound from '$modules/error/handlers/404'

import {auth} from '$modules/auth/middlewares'

export default {
  'post /auth/register': {handler: register},
  'post /auth/login': {handler: login},
  'get /auth/verify': {handler: verify},
  'post /auth/refresh': {handler: refresh},
  'get *': {handler: notFound},
}
