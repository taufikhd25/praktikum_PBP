const express = require('express');
const app = express();
const Joi = require('joi');

const port = 3000;

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({
        error: result.error.details[0].message,
      });
    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = result.value;
    next();
  };
};

// Joi schema
const signupSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().min(3).max(10).required(),
});

// Routes
app.use(express.json()); // Add this line to parse JSON bodies

// POST /signup route
app.post('/signup', validateRequest(signupSchema), (req, res) => {
  res.json({
    message: 'Successfully signed up!',
    data: req.value.body,
  });
});

// PUT /user/:id route
const userSchema = Joi.object().keys({
  id: Joi.string().alphanum().required(),
});
app.put('/user/:id', validateRequest(userSchema), (req, res) => {
  res.json({
    message: 'Successfully updated user!',
    data: req.value.body,
  });
});

// GET /user route
app.get('/user', validateRequest(userSchema), (req, res) => {
  res.json({
    message: 'Successfully retrieved user!',
    data: req.value.query,
  });
});

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
