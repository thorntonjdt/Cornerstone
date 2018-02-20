var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	phone: {type: String},
	tenant: {type: mongoose.Schema.ObjectId, ref: 'Tenant'},
	manager: {type: mongoose.Schema.ObjectId, ref: 'Manager'},
	setup: {type: Boolean, default: false},
	img: { type: String }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.updateUser = function(user, id, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
				User.update({ _id: id }, {password: hash}, callback);
	    });
	});
}

module.exports.comparePassword = function(candidatePassword, hash){
		return bcrypt.compare(candidatePassword, hash);
}
