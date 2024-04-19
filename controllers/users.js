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
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
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

module.exports = router