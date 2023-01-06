import axios from "axios"
import express from "express"
import { createEmail } from "./gmailnator"
import mongoose from "mongoose"
import UserSchema from './userschema'

const app = express()

app.get('/api/action', async (req, res) => {
    const { type, host, port, username, proxyPassword, callbackUrl} = req.query
    console
    switch (type) {
        case 'create_gmail_mailbox':
            try {
                const {email, password, profileId, number} = await createEmail({host, port, username, password: proxyPassword})
                if (callbackUrl){
                    try {
                        // await axios.post(callbackUrl?.toString() ,{
                        //     profileId, email, password, number
                        // })
                        await UserSchema.insertMany([{
                            profileId, email, password, number
                        }])

                        return res.send({data: {profileId, email, password, number}})
                    } catch (err) {
                        return res.send({error: 'Invalid callbackUrl'})
                    }
                }
                return res.send({error: 'Invalid callbackUrl'})
            } catch (err) {
                return res.send({error: err})
            }
            default:
                return res.send({error: 'Error action type'})
    }
})


app.get('/api/test', async (req, res) => {
    console.log(req.body)
})


const port = 32459
app.listen(port, async () => {
    const mongoUri = process.env.mongoUri
    await mongoose.connect(mongoUri!)
    console.log( `server started at http://localhost:${ port }` );
} )

