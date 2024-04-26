const router = require('express').Router()

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

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
        group: 'author',
        attributes: ['author', [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes'], [sequelize.fn('COUNT', sequelize.col('id')), 'total_blogs']]
      })

      res.json(blogs)
      }
      catch(error)
      {
          next(error)
      }
})

  function errorHandler(err, req, res, next) {
    console.log("Error handler")
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
router.use(errorHandler);

module.exports = router