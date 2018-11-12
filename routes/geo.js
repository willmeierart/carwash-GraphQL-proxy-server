import 'babel-polyfill'
import express from 'express'
import geolib from 'geolib'
require('dotenv').config()

const router = express.Router()

// things that could be abstracted to here:

router.post('/', (req, res, next) => {})
