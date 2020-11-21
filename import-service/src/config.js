import {config} from 'dotenv'
import {join} from 'path'

config({
    path: join(__dirname, '../.env')
})

export const BUCKET = process.env.BUCKET
