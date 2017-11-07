var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
	
	name: {
		type: String,
		require: true,
		unique: true
	},
	hash: {
		type: String,
		require: true
	},
	salt: {
		type: String,
		require: true
	},
	iteration: {
		type: Number,
		require: true
	},
	created: {
		type: Date,
		default: Date.now()
	},
	notes: [{
		number: Number,
		title: {
			type: String,
			default: 'Безымянная'
		},
		text: {
			type: String,
			require: true
		},
		color: {
			type: String,
			require: true
		},
		created: {
			type: Date,
			default: new Date()
			}
		}]
});

userSchema.virtual('password')
	.set(function(data){
		this.salt = String(Math.random());
		this.iteration = parseInt(Math.random() * 10 + 1);
		this.hash = this.getHash(data);
	})
	.get(function(){
		return this.hash;
	});

userSchema.methods.getHash = function(password){
	var c = password;
	for(var i = 0; i < this.iteration; i++){
		c = crypto.createHmac('sha1', this.salt).update(c).digest('hex');
	};
	return c;
};

userSchema.methods.checkPassword = function(data){
	return this.getHash(data) === this.hash;
};

module.exports = mongoose.model('UserNotes', userSchema);