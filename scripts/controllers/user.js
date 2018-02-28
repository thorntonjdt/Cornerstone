var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var User = require('../models/user');
var Manager = require('../models/manager');
var Tenant = require('../models/tenant');

module.exports = {
  create: async (req, res) => {
    const { email, password, first_name, last_name, role } = req.body
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //Validate inputs
    if(!email || !password || !first_name || !last_name || !role || password.length < 7 || !reg.test(email)) {
      res.send({"error": "Invalid"})
    }

    //Check if a user with new email already exists
    let duplicateEmails = await User.findOne({email: email}).lean();
    if(!duplicateEmails){

      //Check if user is a tenant and manager
      var roleField;
      if(role == "Manager"){
        var newManager = new Manager();
        await newManager.save();
        roleField = {manager: newManager._id};
      } else {
        var newTenant = new Tenant();
        await newTenant.save();
        roleField = {tenant: newTenant._id};
      }

      var newUser = new User({
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name,
        ...roleField
      })

      await User.createUser(newUser);

      let u = {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        ...roleField
      }

      //Create authentication token for newly created user
      var token = jwt.sign(u, secret, {
       expiresIn: 60 * 60 * 24 // expires in 24 hours
      });
      res.send({"token": token});
    } else {
      res.send({"error": "A user with that email already exists."})
    }

  },

  update: async (req, res) => {
    await User.update({_id: req.params.id}, req.body);

    res.send({"message": "Success"});
  },

  delete: async (req, res) => {
    await User.remove(req.params.id)

    res.send({"message": "User successfuly deleted"});
  },

  login: async (req, res) => {

    let user = await User.findOne({email: req.body.email}).lean();

    if(!user) {
      res.send({error: 'Invalid log-in information'});
    } else {

      //Validate password
      let isMatch = await User.comparePassword(req.body.password, user.password);
      if(isMatch){
        var roleField = user.manager ? {manager: user.manager} : {tenant: user.tenant};
        var u = {
          first_name: user.first_name,
          last_name: user.last_name,
          id: user._id,
          ...roleField
        };

        //Valid log-in information so send user token
        var token = jwt.sign(u, secret, {
         expiresIn: 60 * 60 * 12 // expires in 12 hours
        });

        res.send({ token: token });
      } else {
        res.send({error: 'Invalid log-in information'});
      }
    }
  },

  getInfo: async (req, res) => {
    let user = await User.findById(req.params.id, 'first_name last_name phone').lean();

    res.send({"payload": user});
  },

  getAccount: async (req, res) => {
    let user = await User.findById(req.params.id, 'email password').lean();

    res.send({"payload": user.email});
  },

  updateEmail: async (req, res) => {
    let user = await User.findById(req.params.id).lean();

    let isMatch = await User.comparePassword(req.body.password, user.password);

    if(isMatch){
      let duplicateEmail = await User.findOne({email: req.body.email}).lean();

      if(!duplicateEmail){
        await User.update({_id: req.params.id}, {email: req.body.email})

        res.send({"message": "Success"})
      } else {
        res.send({"error": "A user with that email already exists"})
      }

    } else {
      res.send({"error": "Invalid password"})
    }
  },

  updatePassword: async (req, res) => {
    let user = await User.findById(req.params.id);

    let isMatch = await User.comparePassword(req.body.oldPassword, user.password);

    if(isMatch){
      await User.updateUser({password: req.body.password}, req.params.id)

      res.send({"message": "Success"})
    } else {
      res.send({"error": "Invalid password"})
    }
  }
}
