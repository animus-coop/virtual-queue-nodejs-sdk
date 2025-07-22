import express, { Request, Response } from 'express'
import { verifyToken } from '@vqueue/sdk'

const app = express()

const port = process.env.PORT || 3000

// Verofy the token at root path, this expects a `token` url query param
app.get('/', (req: Request, res: Response) => {
  const token = req.query.token as string

  // Call `verifyToken`
  verifyToken(token)
    // If there is no problem with the API request
    // you get a `VerificationResult` that tells you
    // if the token is valid or not
    .then((verificationResult) => {
      res.json(verificationResult)
      // Here you can handle your business logic discriminating
      // by the `verificationResult.success` boolean value
    })
    // In case of errors like network errorr, invalid UUID
    // or any unexpected results you'll get an exception
    //
    // If you prefer you can use the `safeVerifyToken` function
    // that never throws but returns {succes: false,
    // message: <exception message>} in case of unexpected errors
    .catch((err) => {
      console.log(err)
      res.json({
        error: 'There was an error while verifying the token',
        exception_message: err,
      })
    })
})

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})
