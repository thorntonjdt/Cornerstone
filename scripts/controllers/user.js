var path = require('path');
var jwt = require('jsonwebtoken');

var User = require('../models/user.js');
var Manager = require('../models/manager.js');
var Tenant = require('../models/tenant.js');

module.exports = {
  create: async (req, res) => {
    const { email, password, first_name, last_name, role } = req.body

    if(!email || !password || !first_name || !last_name) {
      throw new Error('You must enter an email and password')
    }
    let duplicateEmails = await User.find({email: email});
    if(!duplicateEmails.length){
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
      var token = jwt.sign(u, 'this is my secret and nobody elses', {
       expiresIn: 60 * 60 * 24 // expires in 24 hours
      });
      res.send({"token": token});
    } else {
      res.send({error: "A user with that email already exists."})
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

    let user = await User.findOne({email: req.body.email})

    if(!user) {
      res.send({message: 'User not found'});
    } else {
      let isMatch = await User.comparePassword(req.body.password, user.password);

      if(isMatch){
        var roleField = user.manager ? {manager: user.manager} : {tenant: user.tenant};
        var u = {
          first_name: user.first_name,
          last_name: user.last_name,
          id: user._id,
          ...roleField
        };
        var token = jwt.sign(u, 'this is my secret and nobody elses', {
         expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
        res.send({ token: token });
      } else {
        res.send({message: 'Invalid password'});
      }
    }
  },

  addPhoto: async (req, res) => {
    upload(req, res, function(error){
      if(error){
        console.log(error);
      }
      User.update({ _id: req.params.id }, { $set: { img: "https://s3-us-west-2.amazonaws.com/jabberusers/"+req.params.id+".png" }}, (error) => {
        if(error){
          console.log(error);
        }
        res.send({"message": "Success"});
      });
    })
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
    let user = await User.findById(req.params.id);

    let isMatch = await User.comparePassword(req.body.password, user.password);

    if(isMatch){
      let duplicateEmails = await User.find({email: req.body.email});

      if(!duplicateEmails.length){
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
