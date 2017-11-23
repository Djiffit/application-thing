// @flow

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'

import {createServer} from 'http'
import {execute, subscribe} from 'graphql'
import {SubscriptionServer} from 'subscriptions-transport-ws'
import connectDb from './connectDb'
import createEndpoints from './createEndpoints'
import {httpLoggerMiddleware as httpLogger} from './logger'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import schema from '../data/schema'

import type {$Application} from 'express'

export default async (): Promise<$Application> => {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(httpLogger)

  await connectDb()
  const port = process.env.PORT || 3000

  app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))
  app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql', subscriptionsEndpoint: `ws://localhost:3000/subscriptions`}))

  createEndpoints(app)
  const ws = createServer(app)
  ws.listen(port, () => {
    console.log(`Graphql server is now running on 3000`)
    new SubscriptionServer({
      schema,
      execute, 
      subscribe,
    }, {
      server: ws,
      path: '/subscriptions',
    })
  })

  
  return app
}
