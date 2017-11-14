const publ_db = require('@CodualDB//controllers/controller.publication'),
    user_db = require('@CodualDB//controllers/controller.user'),
    passport = require('passport'),
    config = require('@config'),
    express = require('express');

module.exports = (app) => {
    const API = app.api;
    let router_publ = express.Router();
    router_publ.get('/', (req, res) => res.send('Codual API publications'));
    //GET BY ID
    //REMOVE
    //UPDATE
    router_publ.post('/', (req, res) => res.send('Codual publications API'));
    //ADD
    router_publ.post('/create', passport.authenticate('jwt', config.session), API.publication.create(publ_db));
    //GET BY QUERY
    router_publ.post('/find', passport.authenticate('jwt', config.session), API.publication.get(publ_db));

    // router_publ.post('/is/logined', API.auth.verify);

    app.use('/api/v1/publications', router_publ);
}


