const router = require('express').Router()

const { User, Blog, UserBlogs } = require('../models')
const Session = require('../models/session')

// Get all users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
    }
  })

  res.json(users)
})

// Get single user
router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) 
  {
    if(req.query.read === "true" || req.query.read === "false")
        where.read = req.query.read === "true"
  }

  where.userId = req.params.id
  
  const users = await User.findByPk(req.params.id, {
  
    include: [
    {
        model: Blog,
        attributes: { exclude: ['userId'] }
    },

    {
      model: Blog,
      as: 'reading_list',
      attributes: { exclude: ['userId']},
      through: {
        model: UserBlogs, // Include the junction model
        attributes: ['read', 'id', 'userId'], // Select the read attribute from the junction table
        where
      }
    },
  ]
  })

  res.json(users)
})

// Create user
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

// Change username
router.put('/:username', async (req, res) => {
  console.log("Change username route")

  const user = await User.findOne({username: req.params.username})
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

// Disable user
router.put('/disable/:id', async (req, res) => {
    try{
      console.log("Disable user route", req.params.id)
      const user = await User.findByPk(req.params.id)
      if (user) {
        user.disabled = req.body.disabled
        await user.save()

        const session = await Session.findOne({ where: { userId: user.id } })
        await session.destroy()

        res.json(user)
      } else {
        res.status(404).end()
      }
    }
    catch(err){
      console.log(err)
    }
})

function errorHandler(err, req, res, next) {
  console.log("Error handler")
  err.errors.map(e => console.log(e.message))
  res.status(400).json({ error: err.errors[0].message });
}

router.use(errorHandler);

module.exports = router