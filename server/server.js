const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "wefbweiuhwtu2049enjdskofkpowejf2391028xsihvfyqw9r3hoidkm"

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://tylerpav:Crazymisha12@blackjack.7djpl4q.mongodb.net/blackjack')

app.post("/signin", (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password === password) {
                const token = jwt.sign({email: user.email}, JWT_SECRET, {
                    expiresIn: "15m",
                })
                return res.json({status: "Success", data: token})
            } else {
                res.json("Password incorrect")
            }
        } else{
            res.json("User not found")
        }
    })
})

app.post("/userInfo", async (req, res) => {
    const { token, balance } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET, (err, res) => {
        if (err) {
          return "token expired";
        }
        return res;
      });
      console.log(user);
      if (user === "token expired") {
        return res.send({ status: "error", data: "token expired" });
      }
  
      const useremail = user.email;

      if(balance !== undefined) {
        try {
            await UserModel.updateOne({ email: useremail }, { balance: balance });
            const updatedUser = await UserModel.findOne({ email: useremail })
            res.send({ status: "ok", data: updatedUser })
        } catch (updateError) {
            res.send({ status: 'error', data: updateError })
        }
      } else {
        UserModel.findOne({ email: useremail })
            .then((data) => {
            res.send({ status: "ok", data: data });
            })
            .catch((error) => {
            res.send({ status: "error", data: error });
            });
        } 
    } catch (error) {
        console.error("Error", error)
        res.send({ status: "error", data: error.message })
    }
  });

  

app.post('/', (req, res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
