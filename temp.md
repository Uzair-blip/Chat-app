```javascript
function isPrimeOrFactors(number) {
    // Handle edge cases: numbers less than 2 are not prime
  if (number < 2) {
    return "Not prime"; //Or you could return an empty array [] if you prefer.
    }
    // Check for divisibility from 2 up to the square root of the number
  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
            // Found a factor, so it's not prime.  Return the factors.
      const factors = [];
      //Efficiently find all factors
      for (let j = 1; j <= Math.sqrt(number); j++) {
        if (number % j === 0) {
          factors.push(j);
          if (j * j !== number) { //Avoid duplicates for perfect squares
            factors.push(number / j);
                    }
                }
            }
      factors.sort((a,b) => a - b); //Sort factors in ascending order
      return factors;
        }
    }
    // No factors found, so it's prime
  return "Prime";
}
// Example usage:
console.log(isPrimeOrFactors(2)); // Output: Prime
console.log(isPrimeOrFactors(15)); // Output: [ 1, 3, 5, 15 ]
console.log(isPrimeOrFactors(17)); // Output: Prime
console.log(isPrimeOrFactors(20)); // Output: [ 1, 2, 4, 5, 10, 20 ]
console.log(isPrimeOrFactors(1)); // Output: Not prime
console.log(isPrimeOrFactors(0)); // Output: Not prime
console.log(isPrimeOrFactors(9)); // Output: [ 1, 3, 9 ]

```
This response provides a more robust and modular Express server structure compared to a simple `app.js` file.  It incorporates best practices like error handling, environment variable usage, and separation of concerns.


**Project Structure:**

```
express-server/
├── src/
│   ├── app.js          // Main application file
│   ├── routes/         // Contains route handlers
│   │   └── index.js    // Example route handler
│   ├── middleware/    // Contains custom middleware
│   │   └── errorHandler.js //Handles errors
│   ├── config/         // Configuration settings
│   │   └── index.js    // Environment variables
│   └── models/         // Database models (if applicable)
│       └── ...
├── package.json
├── .env                // Environment variables (keep this out of version control!)
```

**1. `package.json`:**

```json
{
  "name": "express-server",
  "version": "1.0.0",
  "description": "A robust and modular Express.js server",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1" //For development, restarts server on code changes.  Optional.
  }
}
```

**2. `.env`:** (Keep this file out of version control; use a `.gitignore` entry)

```
PORT=3000
NODE_ENV=development  //Change to 'production' for deployment
```

**3. `src/config/index.js`:**

```javascript
require('dotenv').config(); //Loads environment variables from .env

module.exports = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
};
```

**4. `src/middleware/errorHandler.js`:**

```javascript
const { environment } = require('../config');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error details for debugging

  const status = err.status || 500;
  const message = environment === 'development' ? err.message : 'Internal Server Error'; // Different responses for dev and prod

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
```

**5. `src/routes/index.js`:**

```javascript
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});


//Example of a route that could throw an error (for demonstrating error handling)

router.get('/error', (req, res, next) => {
    const error = new Error('This is a sample error');
    error.status = 400; //Set a custom status code
    next(error); //Pass the error to the error handling middleware
});

module.exports = router;
```

**6. `src/app.js`:**

```javascript
const express = require('express');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json()); //For parsing JSON bodies


// Routes
app.use('/', routes);


// Error Handling Middleware (Must be placed after all other routes)
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port} in ${config.environment} mode`);
});


//Graceful Shutdown (For production environments)
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit();
  });
});

```


To run this:

1.  Ensure Node.js and npm (or yarn) are installed.
2.  Clone this structure or create it manually.
3.  Install dependencies: `npm install`
4.  Start the server: `npm start`


This example demonstrates a more production-ready structure.  Remember to adapt and expand it based on your specific application needs (database integration, authentication, etc.).  Adding a development dependency like `nodemon` simplifies the development workflow by automatically restarting the server whenever you make code changes.
