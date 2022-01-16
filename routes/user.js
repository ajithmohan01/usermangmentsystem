var express = require("express");
const { response } = require("../app");
const signinuser = require("../helpers/signinuser");
var router = express.Router();

// to get loginpage

router.get("/", function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

// to get signup
router.get("/signup", function (req, res) {
  res.render("user/signup", { emptyInput: req.session.emptyInput ,sign:req.session.sign});
  req.session.emptyInput = false;
});

// to get home and check session
router.get("/home", checklogedin, function (req, res, next) {
  res.render("user/home");
});

function checklogedin(req, res, next) {
  if (req.session.loggedIn) {
    next();
    return;
  }
  res.redirect("/");
}

router.get("/login", function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/home");        
  } else {
    res.render("user/login", { loginErr: req.session.loginErr, emptyField:req.session.emptyField});
    req.session.loginErr = false;
    req.session.emptyField = false;
    req.session.sign=false

  }
});

router.post("/signup", function (req, res, next) {
  signinuser.check(req.body).then((userExist)=>{
    if(userExist){
      req.session.sign=true
      res.redirect("/signup");
    }else if (req.body.Email == "" || req.body.Name == "" || req.body.password == "") {
    req.session.emptyInput = true;
    res.redirect("/signup");
  } else {
    signinuser.doSignup(req.body).then((response) => {
      res.redirect("/");
    });
  }
})
});


router.post("/login", (req, res) => {
  if (req.body.Email == "" || req.body.Name == "" || req.body.password == "") {
    req.session.emptyField = true;
    res.redirect("/");
  } 
  else {
    signinuser.doLogin(req.body).then((response) => {
      if (response.status) {
        if (response.user.permission) {
          req.session.loggedIn = true;
          req.session.user = response.user;
          res.redirect("/home");
        } else {
          res.redirect("/");
        }
      } else {  
        req.session.loginErr = true;
        res.redirect("/");
      }
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
