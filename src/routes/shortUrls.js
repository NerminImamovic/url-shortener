const { ShortUrlService } = require("../services/shortUrlService");
const { UserService } = require("../services/userService");

const express = require("express");
const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.get('/shortUrls', async (req, res, next) => { 

    try {
        const shortUrls = await ShortUrlService.getAllShortUrls();

        console.log("Ovdje " + JSON.stringify(shortUrls));
        
        res.render('pages/index', { shortUrls: shortUrls })
    } catch(err) {
        next(err);
        // console.log("error " + JSON.stringify(err));
    }

});
  
router.post('/shortUrls', async (req, res, next) => {

    try {
        const shortUrl = await ShortUrlService.addShortUrl({ fullUrl: req.body.fullUrl });

        if (req.session.userId) {
                          
            await UserService.updateUser(req.session.userId, { shortUrl });

            res.redirect('/profile');
        } else {

            res.redirect('/');

        }

    } catch(err) {



        next(err);
    }

});

router.get('/:shortUrl', async (req, res, next) => {

    try {
        const shortUrl = await ShortUrlService.getShortUrl(req.params.shortUrl)

        res.redirect(shortUrl.full);
    } catch (err) {
        next(err);
    }

})

module.exports = router;