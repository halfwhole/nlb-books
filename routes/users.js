var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {
      id: 1,
      username: "first_user"
    },
    {
      id: 2,
      username: "second_user"
    }
  ]);
});

module.exports = router;
