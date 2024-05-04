const router = require('express').Router()

const { Blog, User } = require('../models')
const Session = require('../models/session')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

router.get('/', async (req, res, next) => {
    const where = {}

    try{
      if (req.query.search) {
        where[Op.or] = [
          {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }},

          {author: {
            [Op.iLike]: `%${req.query.search}%`
          }}
        ]}
      
        console.log("where", where)

      const blogs = await Blog.findAll(
      {
        where,
        order: [
          ['likes', 'DESC']
        ]
      })

      console.log(JSON.stringify(blogs, null, 2))
      res.json(blogs)
      }
      catch(error)
      {
          next(error)
      }
})

const tokenExtractor = async (req, res, next) => {
  console.log("Token extractor middleware")
  const authorization = req.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) 
  {
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

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
      const user = await User.findByPk(req.decodedToken.id)
      console.log(req.body)

      const currentYear = new Date().getFullYear();
      if(req.body.year < 1991 || req.body.year > currentYear)
        return res.status(400).json({error: 'Year must be between 1991 and current year'})

      const blog = await Blog.create({...req.body, userId: user.id})
      return res.json(blog)
    } 
    
    catch(error) {
      next(error)
    }

  })

router.delete('/:id', tokenExtractor, async (req, res, next) => {
    try{
        const user = await User.findByPk(req.decodedToken.id)
       
        console.log("Delete blog")
        const blog = await Blog.findByPk(req.params.id)
        if(user.id != blog.userId)
          return res.status(400).json({ error: 'Cannot delete a blog you did not create' })
        await blog.destroy()
        res.json({message: 'Blog Deleted!'})
    }

   catch(error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
    try{
        const blog = await Blog.findByPk(req.params.id)
        blog.likes++;
        await blog.save()
        res.json({likes: blog.likes})
    }

    catch(error) {
      next(error)
    }
  })


  function errorHandler(err, req, res, next) {
    console.log("Error handler")
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
  
router.use(errorHandler);

module.exports = router