const { UserService } = require("../services/userService");
const express = require("express");
const { requiresLogin } = require("../middlewares");
const { route } = require("./shortUrls");
const router = express.Router();

router.get('/profile', async (req, res, next) => {

    console.log("Ovdje");
    console.log("Reqqqq " + JSON.stringify(req.session));

    if (!req.session.userId) {
        return res.redirect('/shortUrls');
    }

    try {

        console.log("UserId " + req.session.userId);

        res.locals.userId = req.session.userId;
        const user = await UserService.getUser(req.session.userId);

        console.log("User " + JSON.stringify(user));

        res.render('pages/index', { shortUrls: user.shortUrls })

    } catch (err) {
        return next(err);
    }

})

// register
router.get('/register', (req, res, next) => {  

  if (req.session.userId) {
    return res.redirect('/shortUrls');
  }

  res.render('auth/register');
});

router.post('/register', async (req, res, next) => {

  console.log("OVDJE");

  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordconf) {
    let err = new Error('Password do not match');
    err.status = 400;
    res.send("password don't match");
    return next(err);
  }

  if (req.body.email && req.body.password && req.body.passwordconf) {

    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
        const user = await UserService.register(userData);

        console.log("USer " + JSON.stringify(user));

        req.session.userId = user._id;
        res.locals.userId = user._id;

        console.log("Req " + JSON.stringify(req.session));

        console.log("EEVOOO");

        return res.redirect('/profile');

    } catch (err) {
        next (err);
    }

  }

});

// login
router.get('/login', (req, res) => {

  if (req.session.userId) {
    return res.redirect('/shortUrls');
  }

  res.render('auth/login');
});
router.post('/login', async (req, res, next) => {


    const userData = {
        email: req.body.email,
        password: req.body.password,
    };
  
    try {

        console.log("vodjee");

        const user = await UserService.login(userData);

        console.log("User " + JSON.stringify(user));


        req.session.userId = user._id;
        res.locals.userId = user._id;
        return res.redirect('/profile');

    } catch (err) {
        return next(err);
    }
    
});


// logout
router.get('/logout', requiresLogin, (req, res, next) => {

  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/shortUrls');
      }
    })
  }

});

module.exports = router;