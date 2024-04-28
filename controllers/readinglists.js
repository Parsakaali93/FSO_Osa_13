const router = require('express').Router()

const { UserBlogs } = require('../models')

// Get all users
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

module.exports = router