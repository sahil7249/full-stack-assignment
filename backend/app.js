import express from 'express'
import env from 'dotenv'
import { userRouter } from './routers/user.router.js'

env.config( { path :'.env'})

const app = express()
const PORT = process.env.PORT || 8000

app.use('/api',userRouter)

app.listen(PORT,() => {
    console.log("App is running on the link : http://localhost:8080/")
})