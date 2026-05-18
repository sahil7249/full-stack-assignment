import express from 'express'
import env from 'dotenv'
import userRouter  from './routers/user.router.js'
import errorMiddleware from './middleware/error.middleware.js'
import storeRouter from './routers/store.router.js'
import ratingRouter from './routers/rating.router.js'

env.config( { path :'.env'})

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use('/api/user',userRouter)
app.use('/api/store',storeRouter)
app.use('/api/rating',ratingRouter)

app.use(errorMiddleware)

app.listen(PORT,() => {
    console.log("App is running on the link : http://localhost:8080/")
})