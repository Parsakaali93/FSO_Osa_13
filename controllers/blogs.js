const router = require('express').Router()

const { Blog } = require('../models')



router.get('/', async (req, res, next) => {
    try{
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
    }
    catch(error)
    {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
      console.log(req.body)
      const blog = await Blog.create(req.body)
      return res.json(blog)
    } 
    
    catch(error) {
      next(error)
    }

  })

router.delete('/:id', async (req, res, next) => {
    try{
        const blog = await Blog.findByPk(req.params.id)
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
router.use(errorHandler);

module.exports = router