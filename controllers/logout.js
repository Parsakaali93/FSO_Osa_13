const router = require('express').Router()

const Session = require('../models/session')

router.post('/', async (req, res) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(400).json({ error: 'Token not provided' });
      }
  
      await Session.destroy({ where: { token: token } });
  
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'An error occurred while logging out' });
    }
  });

module.exports = router