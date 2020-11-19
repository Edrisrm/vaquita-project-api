'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function( _id, email, given_name, family_name, role, two_factors_activated ){

	let payload = {
		uid: _id,
		email: email,
		given_name: given_name,
		family_name:family_name,
		role: role,
		two_factors_activated: two_factors_activated,
		iat: moment().unix(),
		exp: moment().add(1, 'hours').unix 
	};

	return jwt.encode( payload, process.env.SECRET_JWT_SEED );
};