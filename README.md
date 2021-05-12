# k-order-backend
An API for a food ordering app.

# To start the app locally on your machine:
- You need node.js and mongoDB to be installed locally on your pc
- Run `npm install`
- Create a "config.env" file in the project's root directory, clone .env.example and fill the empty fields with your config.
- Add "/config/jwt-keys" folder and run the command `node utils/generatePublicAndPrivateKeys` to generate '.pem' files in the jwt-keys folder under '/config'
- Run `npm start`
