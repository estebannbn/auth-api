import express from 'express'
import config from 'config'
import logger from "./utils/logger.js";

const app = express()
const PORT = config.get('port')
app.use(express.json())
app.listen(PORT,()=> logger.info('Listening at port ' + PORT))