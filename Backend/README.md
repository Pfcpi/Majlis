# Establishing a connection between the backend and frontend

- A connection means transfering data between from the server (backend): in our situation the server is the computer itself: to the frontend.

## How to achieve this

- Using restful API
  - REST is an acronym for REpresentational State Transfer and an architectural style for distributed hypermedia systems.

## What you need to understand (mouhssine, mouhamed, Ouss, Baddache)

- How to make a restfull api.
- How to create, read, update and delete data from the database.
- You do not need to fully understand the code written in the frontend.

## But how ??

Lets look at an example.

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('public'))

app.use((err, req, res, next) => {
  console.log(err.stack)
  console.log(err.name)
  console.log(err.code)

  res.status(500).json({
    message: 'Something went really wrong'
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
```

- Here we are setting the app, don't worry, these lines of code are the same for every express app.

- Defining a route for reading data

```javascript
app.get("/data", (req, res)) {
  res.send("Your data");
}
```

- There are several methods like, post, patch, delete...
- "/data" can be any route like "/" , "/you", "/link"...

and inside you handle the job of getting the data from the database

### 🚀 it is that simple

- do not worry, i'll be in charge of displaying the data in the frontend.