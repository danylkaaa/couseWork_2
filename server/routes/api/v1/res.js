const router = require('express').Router();
const Utils = require('@utils');
const validate = require('@validator');
const DBimage = require("@DBcore").images;
const passport = require('passport');
let tools = {};

tools.collectDataFromReq = {
    post (req) {
        let args = {query: {}};
        if (req.files && req.files.file) {
            args.query.file = req.files.file;
        }
        return args;
    },
    get (req) {
        let args = {query: {}};
        //id
        if (req.query.id && Utils.isValid.id(req.query.id)) {
            args.query.id = Utils.convert.str2id(req.query.id);
        }
        return args;

    }
}

tools.verifyData = {
    post (args) {
        if (!args.query.file || !Utils.files.isImage(args.query.file)) {
            throw Utils.errors.InvalidRequesDataError('Your file is not an image')
        }
        else return true;
    },
    get (args) {
        if (!args.query.id) {
            throw Utils.errors.InvalidRequesDataError('Invalid id of file')
        }
        return true;
    }
}
tools.result = {
    post (res, args) {
        return res.json(
            {
                success: true,
                id: args.idOfSavedImage
            }
        )
    }
}
router.route('/')
    .get(async (req, res, next) => {
        const args = tools.collectDataFromReq.get(req);
        console.log(args);
        try {
            tools.verifyData.get(args);
        } catch (err) {
            return Utils.sendError(res, 400, err.message);
        }
        try {
            const result = await DBimage.get.byID(args.query.id);
            if (!result) {
                return Utils.sendError(res, 404, "Not found");
            }
            const stream = DBimage.get.stream(args.query.id);
            console.log(result)
            res.type(result.contentType);
            // console.log(1)

            (await stream).pipe(res);
        } catch (e) {
            // console.log(e)
            return Utils.sendError(res, 500, `Server error: ${e}`);
        }
    })
    .post(passport.authenticate(['access-token', 'basic', 'facebook'], {session: false}), async (req, res, next) => {
        const args = tools.collectDataFromReq.post(req);
        try {
            tools.verifyData.post(args);
        } catch (err) {
            return Utils.sendError(res, 400, err.message);
        }
        try {
            args.idOfSavedImage = await DBimage.save(
                args.query.file,
                {
                    owner: req.user.id
                }
            )
            if (args.idOfSavedImage) {
                return tools.result.post(res, args);
            } else {
                return Utils.sendError(res, 400, "Bad arguments");
            }
        } catch (err) {
            console.log(err);
            return Utils.sendError(res, 500, `Server error: ${err}`);
        }
    })
module.exports = router;