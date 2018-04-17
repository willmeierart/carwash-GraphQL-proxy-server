import 'babel-polyfill'
import fetch from 'node-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { weaveSchemas } from 'graphql-weaver'

if (!process.browser) global.fetch = fetch

const PORT = 3001
const app = express()

const CWUE = 'https://api.graphcms.com/simple/v1/carwashusaexpress'
const CLONE = 'https://api.graphcms.com/simple/v1/cjfjtoyj6015w0150471puqoo'
const ALL_ENDPOINTS = [CWUE, CLONE]

async function run() {
  // const schema = await weaveSchemas({
  //   endpoints: [
  //     {
  //       namespace: '_Carwash_USA_Express',
  //       typePrefix: 'Primary',
  //       url: CWUE
  //     },
  //     {
  //       namespace: '_Cloned_CWUE',
  //       typePrefix: 'Secondary',
  //       url: CLONE
  //     }
  //   ]
  // })
  const primaryEndpointData = [
    {
      namespace: '_Carwash_USA_Express',
      typePrefix: 'Primary',
      url: CWUE
    }
  ]
  const otherEndpointData = [
    {
      namespace: '_Cloned_CWUE',
      typePrefix: 'Secondary',
      url: CLONE
    }
  ]

  let activeEndpoints = primaryEndpointData
  let schema = await weaveSchemas({ endpoints: activeEndpoints })
  

  const determineSchema = (req, res, next) => {
    console.log(JSON.stringify(req.body))
    const isLocationsQuery = JSON.stringify(req.body).indexOf('allLocations') !== -1
    if (isLocationsQuery) {
      activeEndpoints = primaryEndpointData.concat(otherEndpointData)
    }
    console.log(activeEndpoints)
    // schema = await weaveSchemas({ endpoints: activeEndpoints })
    // return graphqlExpress({ schema })
    // return res
    // return
    next()
  }

  

  app.use(cors({ allow: '*' }))
  app.use('/graphql',
    bodyParser.json(),
    determineSchema,
    graphqlExpress({ schema })
  )
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