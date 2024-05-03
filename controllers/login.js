const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')

const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  try{
    const body = request.body

    const user = await User.findOne({
      where: {
        username: body.username
      }
    })

    const passwordCorrect = body.password === 'password'

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    console.log("Session", userForToken.id, token)

    const session = await Session.create({
      userId: userForToken.id,
      token: token,
    });

    response
      .status(200)
      .send({token, username: user.username, name: user.name })
  }
  catch(error)
  {
    console.log(error)
  }
})

module.exports = router