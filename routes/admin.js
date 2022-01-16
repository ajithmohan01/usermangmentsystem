const { response } = require("express");
var express = require("express");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();
var user = express.Router();
var userHelper = require("../helpers/user-helpers");



router.get("/", function (req, res, next) {
  if(req.session.adminloggedIn){
    res.redirect("admin/adminpanel");
  }else{
  res.render("admin/adminlogin", { admin: true ,loginErr:req.session.loginErr,emptyInput:req.session.emptyInput });
  req.session.loginErr = null;
  req.session.emptyInput=null;
  }
});


router.get("/adminpanel", function (req, res, next) {
  if(req.session.adminloggedIn){
  userHelpers.getAllUsers().then((users) => {
    res.render("admin/adminpanel", { users, admin: true });
  });
}else{
  res.redirect("/admin");
}
});


router.post("/adminpanel", (req, res) => {
  res.redirect("/admin/adminpanel");
});


router.get("/adduser", function (req, res, next) {
  res.render("admin/adminedit", { admin: true ,emptyInput:req.session.emptyInput,siggnerr:req.session.siggnerr});
  req.session.emptyInput=false
  req.session.siggnerr=false
});


router.post("/add-user", function (req, res) {
  userHelpers.checkuser(req.body).then((userExist)=>{
    if(userExist){
      req.session.siggnerr=true
      res.redirect("/admin/adduser")
    }else if(req.body.Email == "" || req.body.Name == "" || req.body.password ==""){
    req.session.emptyInput=true
    res.redirect("/admin/adduser")
  }else{
    userHelper.adduser(req.body).then((result)=>{
      res.redirect("/admin/adminpanel");
    })
  }
})
});


router.get("/delete-user/:id", (req, res) => {
  let userId = req.params.id;
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect("/admin/adminpanel");
  });
});


router.get("/update-users/:id", async (req, res) => {
  let user = await userHelper.getUsersdetials(req.params.id);
  console.log(user);
  res.render("admin/update-users", { id: req.params.id, data: user });
});


router.post("/update-users/:id", async (req, res) => {
  console.log("body");
  console.log(req.body);
  let users = await userHelper.updateUser(req.params.id, req.body);
  if (users) {
    res.redirect("/admin/adminpanel");
  }
});


router.post("/", (req, res) => {
  console.log(req.body);
  if(req.body.Email==""||req.body.password==""){
    req.session.emptyInput=true
    res.redirect("/admin");
  }else{
  userHelper.doLogin(req.body).then((response) => {
    console.log(response);
    if (response) {
      req.session.adminloggedIn = true;
      req.session.admin = req.body;
      res.redirect("admin/adminpanel");
    } else {
      req.session.loginErr = true;
      res.redirect("/admin");
    }
  });
}
});


router.get("/adminlogout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});


router.get("/block-user/:id",(req,res)=>{
  userHelpers.blockUser(req.params.id).then((respose)=>{
    res.redirect("/admin/adminpanel")
  })
})


module.exports = router;
