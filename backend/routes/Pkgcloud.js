/**
 *  2018-4-10
 */
var express = require('express');
var request = require('request');
var router = express.Router();


var logger = require('log4js').getLogger('Pkgcloud');
var pkgcloud =require('pkgcloud');
router.get('/pkgcloud',function (req, res, next) {

    /** var params = {};

     params.provider= req.query.provider;// required
     params.username= req.query.username; // required
     params.password= req.query.password; // required
     params.region= "nfvoproj";
     params.keystoneAuthVersion= req.query.keystoneAuthVersion;
     params.domainId=req.query.domainId;
     params.projectName = req.query.name;
     params.domainName= req.query.domainName;
     params.authUrl= req.query.authUrl // required**/


    console.log('----servers info following-----');

    /**var nc = pkgcloud.network.createClient({
		provider: 'openstack', // required
		username: 'admin', // required
		password: '123456', // required
		region: 'RegionOne',
		keystoneAuthVersion: 'v2',
		domainId: 'Default',
		domainName: 'Default',
		authUrl: 'http://192.168.80.246:5000' // required
	});
     nc.getNetworks(function(err, netWorks) {
		console.log(err);
		console.log(JSON.stringify(netWorks));
	});**/



    var client =pkgcloud.compute.createClient({
        provider: 'openstack', // required
        username: 'admin', // required

        password: 'keystone', // required
        region: 'RegionOne',
        keystoneAuthVersion: 'v2',
        tenant: 'admin',
        authUrl: '192.168.80.1:5000' // required
    });
    /** client.getFlavors(function (err, flavors) {
		console.log(err);
		console.log(JSON.stringify(flavors));
	  });**/
    /** client.getFlavor('1be6ce2d-0ac6-41cf-b0ba-fd6e916d045f', function (err, flavor) {
		console.log(err);
		console.log(flavor);
		console.log(JSON.stringify(flavor));
	  })**/
    client.getImages(function(err,images){
        console.log(err);
        console.log(images);
        console.log(JSON.stringify(images));

    })


    /** //获取云主机
     var client = require('pkgcloud').compute.createClient({
	    provider: 'openstack', // required
		username: 'admin', // required
		password: 'keystone', // required
		region: 'RegionOne',
		keystoneAuthVersion: 'v2',
		tenant: 'admin',
		authUrl: '192.168.80.1:5000' // required
	});

     client.getServers(function (err, servers) {
		console.log(err);
		console.log(JSON.stringify(servers));
	});**/



    res.writeHead(200, {"Content-Type": "application/json"});
    res.write('112234');
    res.end();

});
//获取服务列表
router.get('/getServers',function (req, res, next) {
    console.log('------------------servers------------------');
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    console.log(req.query.tenantId);
    console.log('------------------end------------------');
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    console.log(param);
    var client = require('pkgcloud').compute.createClient(param);

    client.getServers(function (err, servers) {
        res.writeHead(200, {"Content-Type": "application/json"});
        if(err != null){
            servers = [];
        }
        var table_data = {};
        var metadata = {};
        var pagination = {};
        table_data.items = servers;
        pagination.total = servers.length;
        pagination.offset = 0;
        pagination.size = 0;
        metadata.pagination =  pagination;
        table_data.metadata = metadata;
        res.write(JSON.stringify(table_data));
        res.end();
    });
});
//获取网络列表
router.get('/getNetWorks',function (req, res, next) {
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    var client = require('pkgcloud').network.createClient(param);
    client.getNetworks(function (err, netWorks) {
        if(err != null){
            netWorks = [];
        }
        var table_data = {};
        var metadata = {};
        var pagination = {};
        table_data.items = netWorks;
        pagination.total = netWorks.length;
        pagination.offset = 0;
        pagination.size = 0;
        metadata.pagination =  pagination;
        table_data.metadata = metadata;

        res.writeHead(200, {"Content-Type": "application/json"});

        res.write(JSON.stringify(table_data));

        res.end();
    });
});
//获取flavors
router.get('/getFlavors',function (req, res, next) {
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    var client = require('pkgcloud').compute.createClient(param);

    client.getFlavors(function (err, flavors) {

        if(err != null){
            flavors = [];
        }

        var table_data = {};
        var metadata = {};
        var pagination = {};
        table_data.items = flavors;
        pagination.total = flavors.length;
        pagination.offset = 0;
        pagination.size = 0;
        metadata.pagination =  pagination;
        table_data.metadata = metadata;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(table_data));
        res.end();
    });
});
//获取Images
router.get('/getImages',function (req, res, next) {
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    var client = require('pkgcloud').compute.createClient(param);
    client.getImages(function (err, Images) {
        if(err != null){
            Images = [];
        }
        var table_data = {};
        var metadata = {};
        var pagination = {};
        table_data.items = Images;
        pagination.total = Images.length;
        pagination.offset = 0;
        pagination.size = 0;
        metadata.pagination =  pagination;
        table_data.metadata = metadata;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(table_data));
        res.end();
    });
});


//获取Images
router.get('/getImage',function (req, res, next) {
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    var client = require('pkgcloud').compute.createClient(param);
    client.getImage(req.query.imageId, function(err,image){
        if(err == null){
            res.write(JSON.stringify(image));
        }else{
            res.write('{}');//处理报错
        }
        res.end();
    })
});
//获取子网Subnets
router.get('/getSubnets',function (req, res, next) {
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    var client = require('pkgcloud').network.createClient(param);
    client.getSubnets(function (err, Subnets) {
        if(err != null){
            Subnets = [];
        }
        var table_data = {};
        var metadata = {};
        var pagination = {};
        table_data.items = Subnets;
        pagination.total = Subnets.length;
        pagination.offset = 0;
        pagination.size = 0;
        metadata.pagination =  pagination;
        table_data.metadata = metadata;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(table_data));
        res.end();
    });
});
//获取端口信息
router.get('/getPorts',function (req, res, next) {
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    var client = require('pkgcloud').network.createClient(param);
    client.getPorts(function (err, Ports) {
        if(err != null){
            Ports = [];
        }
        var table_data = {};
        var metadata = {};
        var pagination = {};
        table_data.items = Ports;
        pagination.total = Ports.length;
        pagination.offset = 0;
        pagination.size = 0;
        metadata.pagination =  pagination;
        table_data.metadata = metadata;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(table_data));
        res.end();
    });
});
//测试
router.get('/getLimits',function (req, res, next) {
    var param = {};
    param.provider = req.query.provider;
    param.username = req.query.username;
    param.password = req.query.password;
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = req.query.authUrl;
    if(req.query.tenantId!=null ){
        param.tenantId = req.query.tenantId;
    }
    var client = require('pkgcloud').compute.createClient(param);
    client.getLimits(function (err, Limits) {
        if(err == null){
            res.write(JSON.stringify(Limits));
        }else{
            res.write('{}');//处理报错
        }
        res.end();
    })

});


//获取端口信息
router.get('/getContainers',function (req, res, next) {
    var param = {};
    param.provider = 'openstack';
    param.username = 'admin';
    param.password = 'keystone';
    param.region = 'RegionOne';
    param.keystoneAuthVersion = 'v2';
    param.authUrl = 'http://192.168.80.1:5000';
    param.tenantName = 'admin';
    var client = require('pkgcloud').compute.createClient(param);
    client.getVolumeAttachments('', function(err,volume){
        console.log(err);
        console.log(volume);
    })
});



module.exports = router;
