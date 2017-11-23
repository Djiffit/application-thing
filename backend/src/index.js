// @flow

import 'babel-polyfill'

// import createApp from '$app/createApp'
// import logger from '$app/logger'
import createApp from '$app/createApp'

require('dotenv').load()

const start = async () => {
  const app = await createApp()
}
 
start()
