## Setting up development server

Express backend: use port 3000.
```
$ PORT=3000 npm run devstart
```

React frontend: use port 5000.
```
$ cd client
$ PORT=5000 npm start
```

Test changes in the React app (`localhost:5000`). (Otherwise, you have to `$ npm run build` everytime you make changes to have it show on the Express app.)
The React app has been configured to use the backend as a proxy on port 3000.

## Deploying for production (on Heroku)

Express will serve the static files in `client/build`.
On post-build, add a `heroku-postbuild` hook in package.json:
```
"scripts": {
  "start": "node index.js", // or whatever
  "heroku-postbuild": "cd client && npm install && npm run build"
}
```

The Express app will be served, adding static files from the React app accordingly.
