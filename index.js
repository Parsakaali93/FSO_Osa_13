require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')

const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

app.use(express.json());

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes:{
    type: DataTypes.INTEGER,
    allowNull: true,
    default: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {  
  console.log(`Server running on port ${PORT}`)
})


app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    try {
      console.log(req.body)
      const blog = await Blog.create(req.body)
      return res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
    res.json({message: 'Blog Deleted!'})

  } else {
    res.status(404).end()
  }
})

/*
const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })

    for (const key in blogs) {
        if (blogs.hasOwnProperty(key)) {
            const blog = blogs[key];
            console.log(`${blog.title}, ${blog.author}, ${blog.likes}`);
        }
    }        
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()*/