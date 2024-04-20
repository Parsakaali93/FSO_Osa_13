const router = require('express').Router()

const { User, Blog } = require('../models')

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
  const user = await User.findOne({username: req.params.username})
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

function errorHandler(err, req, res, next) {
  console.log("Error handler")
  err.errors.map(e => console.log(e.message))
  res.status(400).json({ error: err.errors[0].message });
}

router.use(errorHandler);

module.exports = router