import express from "express"
import { PORT } from "./config/env"

const app = express()

app.get("/",(req,res) => {
    res.send("Hello world")
})

app.listen(PORT,() => {
    console.log(`listening on port http://localhost:${PORT}`)
})

export default app