import 'babel-polyfill'
import fetch from 'node-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { weaveSchemas } from 'graphql-weaver'
require('dotenv').config()

import geoRouter from './routes/geo'

if (!process.browser) global.fetch = fetch

const PORT = 3001
const app = express()

const CWUE = process.env.BASE
const CLONE = process.env.SECONDARY
const ALL_ENDPOINTS = [ CWUE, CLONE ]

async function run () {
	const schema = await weaveSchemas({
		endpoints: [
			{
				namespace: '_Carwash_USA_Express',
				typePrefix: 'Primary',
				url: CWUE
			},
			{
				namespace: '_Cloned_CWUE',
				typePrefix: 'Secondary',
				url: CLONE
			}
		]
	})

	app.use(cors({ allow: '*' }))

	app.use('/geo', geoRouter)

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
