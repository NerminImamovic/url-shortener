const User = require('../models/user')

UserService = {

    async getUser (id) {
        
        try {
           return await User.findById(id).populate('shortUrls');
        } catch (err) {
            throw err;
        }
    }, 

    async register(data) {
        try {

            console.log("Daata " + JSON.stringify(data));

            const user = await User.create(data);

            console.log("uuuuuuu " + JSON.stringify(user));

            return user;

        } catch (err) {

            console.log("Errr " + JSON.stringify(err));

            throw err;
        }
    }, 

    async login(data) {

        if (data.email && data.password) {

            try {

                console.log("data " + JSON.stringify(data));

                const user =  await User.authenticate(data.email, data.password);

                console.log("User " + JSON.stringify(user));

                return user;

            } catch (err) {
                throw err;
            }

          } else {
            const err = new Error('All fields are required.');
            err.status = 400;
            throw err;
          }

    }, 

    async updateUser(userId, data) {

        try {

            const user = await this.getUser(userId);

            console.log("Data " + JSON.stringify(data));
            
            const shortUrls = user.shortUrls;

            shortUrls.push(data.shortUrl);

            user.shortUrls = shortUrls;
            user.save();

            return user;

        } catch (err) {
            throw err;
        }

    }

};

exports.UserService = UserService;