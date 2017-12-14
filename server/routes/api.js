let router = require('express').Router();
const Utils = require('@utils');
const config = require('@config');
router.use('/v1/auth', require('@APIv1/auth'));
router.use('/v1/res', require('@APIv1/res'));
router.use('/v1/publications', require('@APIv1/publications'));
router.get('/v1/docs', async (req, res, next) => {
    res.json({success: true, item: Utils.md.render(await Utils.fs.read(config.API_DOCS))})
})
module.exports = router;