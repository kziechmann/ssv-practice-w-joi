const express = require('express');
const router = express.Router();
const knex = require('../knex');
const validate = require('express-validation')
const validation = require('../validations/signup')

//Get all user data
router.get('/users', (req, res, next) => {
  return knex('users')
    .then(result => {
      res.status(200).send(result)
    })
})

//New user signup
router.post('/signup', validate(validation.signup), function(req, res, next) {
  const { first_name, last_name, email, password } = req.body

  if (first_name && last_name && email && password) {
    return knex('users')
    .where('email', email)
    .first()
    .then(exists => {
      if(exists) {
        next({
          status: 400,
          errors: [
            {
              messages: [
                'that email is already registered'
              ]
            }]
          })
      } else {
        return knex('users')
        .insert({first_name, last_name, email, password})
        .then(user => {
          res.status(200).send({first_name, last_name, email, password})
        })
      }
    })
  }
})

router.use(function(err, req, res, next) {
  res.status(err.status).send(err)
})

module.exports = router;
