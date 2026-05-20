import express from 'express'
import env from 'dotenv'
import userRouter  from './routers/user.router.js'
import errorMiddleware from './middleware/error.middleware.js'
import storeRouter from './routers/store.router.js'
import ratingRouter from './routers/rating.router.js'
import authRouter  from './routers/auth.router.js'
import cors from 'cors'

env.config( { path :'.env'})

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',    
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use('/api/user',userRouter)
app.use('/api/stores',storeRouter)
app.use('/api/rating',ratingRouter)
app.use('/api/auth',authRouter)

app.use(errorMiddleware)

app.listen(PORT,() => {
    console.log(`App is running on the link : http://localhost:${PORT}/`)
})