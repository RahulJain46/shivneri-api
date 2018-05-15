var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;

router.route('/signup')
    .post(function (req, res) {
        var url = 'mongodb://accountAdmin01:changeMe@localhost:27017/fortlisting';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('users');
            var user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                mobileNumber: req.body.mobileNumber,
                email: req.body.email
            };
            collection.findOne({ 'email': user.email }, function (err, results) {
                if (results) {
                    res.send({message: 'already registered'})
                }
                else {
                    collection.insert(user, function (err, results) {
                        res.send(results.ops[0]);
                       
                    });
                }

            });
        });

    });

router.route('/signin')
    .post(passport.authenticate('local', {
         
    }), function (req, res) {
        res.json(req.user);
     
       
    });


router.route('/profile')
    .all(function (req, res, next) {
        if (!req.user) {
            res.redirect('/');
        }
        next();
    })
    .get(function (req, res) {
        res.json(req.user);
    });
router.route('/google/callback')
    .get(passport.authenticate('google', {
        successRedirect: '/users/',
        failure: '/error/'
    }));

router.route('/google')
    .get(passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

module.exports = router;
