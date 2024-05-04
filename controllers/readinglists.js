const router = require('express').Router()

const { UserBlogs, User } = require('../models')
const Session = require('../models/session')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    try{
        const userId = req.body.userId
        const blogId = req.body.blogId

        if(!userId || !blogId)
        {
            return res.status(404).json({error: "blogId or userId not found"})
        }

        const userBlog = await UserBlogs.create({ userId, blogId });
        return res.status(201).json(userBlog); 
    }

    catch(error)
    {
        res.status(500).json({error: error.message})
    }
})

const tokenExtractor = async (req, res, next) => {
    console.log("Token extractor middleware")
    const authorization = req.get('authorization')
    console.log(authorization)
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        const session = await Session.findOne({ where: { token: authorization.substring(7) } });
        if(!session)
          return res.status(401).json({ error: 'account has no active session' })
  
      } 
      
      catch
      {
        return res.status(401).json({ error: 'token invalid' })
      }
    }
    else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

// Update blog in readinglist's read status
router.put('/:id', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        
        if (user) {
          const reading_list = await UserBlogs.findByPk(req.params.id)

          console.log(reading_list.userId, user.id)

          if(reading_list.userId != user.id)
            return res.status(400).json({error: "You are not authorized to change this user's reading list"})

          reading_list.read = req.body.read
          await reading_list.save()
          return res.status(200).json({status: "Read status of blog successfully changed"})
        } 

        else {
            return res.status(404).end()
        }
      } 
      
      catch(error) {
        console.log({error})
      }
})

module.exports = router