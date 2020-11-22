const jwt = require("jwt-simple");
const moment = require("moment");

exports.createToken = function (
  _id,
  email,
  given_name,
  family_name,
  role,
  picture,
  two_factors_activated
) {
  let payload = {
    uid: _id,
    email: email,
    given_name: given_name,
    family_name: family_name,
    role: role,
    picture: picture,
    two_factors_activated: two_factors_activated,
    iat: moment().unix(),
    exp: moment().add(2, "days").unix,
  };

  return jwt.encode(payload, process.env.SECRET_JWT_SEED);
};
