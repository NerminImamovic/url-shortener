
function requiresLogin (req, res, next) {

  console.log("Req sesssion " + JSON.stringify(req.session)); 

  if (req.session && req.session.userId) {


      return next();
    } else {
      const err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    } 
}

module.exports = { requiresLogin };