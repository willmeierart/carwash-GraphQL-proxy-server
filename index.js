import 'babel-polyfill'
import fetch from 'node-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { weaveSchemas } from 'graphql-weaver'

if (!process.browser) global.fetch = fetch

const PORT = 3000
const app = express()

const CWUE = 'https://api.graphcms.com/simple/v1/carwashusaexpress'
const CLONE = 'https://api.graphcms.com/simple/v1/cjfjtoyj6015w0150471puqoo'
const ALL_ENDPOINTS = [CWUE, CLONE]

async function run() {
  const schema = await weaveSchemas({
    endpoints: [
      {
        namespace: '_carwashUSAexpress',
        typePrefix: 'Primary',
        url: CWUE
      },
      {
        namespace: '_clone',
        typePrefix: 'Secondary',
        url: CLONE
      }
    ]
  })

  app.use(cors({ allow: '*' }))
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
  app.get('/', graphiqlExpress({ endpointURL: '/graphql' }))
  // app.post('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

  app.listen(PORT, () => {
    console.log(`running on ${PORT}`)
  })
}

try {
  run()
} catch (e) {
  console.log(e, e.message, e.stack)
}