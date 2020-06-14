const ShortUrl = require('../models/shortUrl')

ShortUrlService = {

    async addShortUrl (data) {
       return await ShortUrl.create({ full: data.fullUrl });
    },

    async getAllShortUrls () {
        return await ShortUrl.find({});
    },

    async getShortUrl(short) {
        const shortUrl = await ShortUrl.findOne({ short })
        if (shortUrl == null) {
            const err = new Error('Url not found.');
            err.status = 404;
            throw err;
        }
      
        shortUrl.clicks++
        shortUrl.save();

        return shortUrl;
    }
    
};

exports.ShortUrlService = ShortUrlService;