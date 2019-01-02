const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const exec = require('child_process').exec
const db = require('./db/Connection')

router.use(passport.authenticate('token', {session: false}));
router.use(bodyParser.json());

//create
router.put('/users', function (req, res, next) {
    db.Radcheck
        .create({username: req.body.username, attribute: req.body.attribute, op: req.body.op, value: req.body.password})
        .then(response => {res.send(response)})
        .catch(next)
})

//read
router.get('/users', function (req, res, next) {
    db.Radcheck
        .findAndCountAll({
            offset: parseInt(req.query._offset),
            limit: parseInt(req.query._size)
        })
        .then(users => {
            res.send(users)
        })
        .catch(next)
})

//update
router.put('/users/:id', function (req, res, next) {
    db.Radcheck
        .update({value: req.body.password},{where: {id: req.params.id}})
        .then(result => {res.send(result)})
        .catch(next)
})

//downline
router.put('/downline/', function (req, res, next) {
    let ip = req.body.ip
    let username = req.body.username

    exec('python ./sesssion_out/session_out.py '+ ip +' '+ username +' ',function(error, stdout, stderr){
        if(error) {
            res.send('stderr : ' + stderr)
        }else if(stdout.length > 1){
            res.status(200).send(stdout)
        } else {
            res.status(200).send('you don\'t offer args')
        }
    });
})

//delete
router.delete('/users/:id', (req, res, next) => {
    db.Radcheck
        .destroy({ where: { id: req.params.id } })
        .then(result => {res.end('success')} )
        .catch(next);
});

//read
router.get('/userDetails', function (req, res, next) {
    db.Radacct
        .findAll({
            'attributes': [
                'radacctid', 'username', 'acctstarttime', 'acctstoptime', 'acctsessiontime', 'nasipaddress', 'calledstationid'
            ]
        })
        .then(users => {
            res.send(users)
        })
        .catch(next)
})

module.exports = router;
