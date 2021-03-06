var fs = require('fs');
var path = require('path');
var assert = require("assert");
var helpers = require('../src/file.js');

describe('#file and directory', function() {

    var DIR = '';
    beforeEach(function(done) {
        fs.mkdir('/tmp/web-ui-test/', function() {
            DIR = '/tmp/web-ui-test/';
            done.apply(null, arguments);
        });
    });
    afterEach(function(done) {
        helpers.rmdir(DIR, done);
    });

    it('move directory ', function() {
        this.timeout(0);
        return new Promise(function(resolve, reject) {
            helpers.mkdirs(path.join(DIR, '1-1/2-1/3-1/4-1/5-1/6-1'), function(error) {
                error ? reject(error) : resolve();
            });
        }).then(function() {
            return new Promise(function(resolve, reject) {
                helpers.mkdirs(path.join(DIR, '1-1/2-2/3-2'), function(error) {
                    error ? reject(error) : resolve();
                });
            });
        }).then(function() {
            return new Promise(function(resolve, reject) {
                // construct a big file
                var bufferStr = [];
                for (var i = 0; i < 10000000; i += 1) {
                    bufferStr.push('just for test!');
                }
                fs.writeFile(path.join(DIR, '1-1/2-2/bigfile.txt'), bufferStr, function(error) {
                    error ? reject(error) : resolve();
                });
            });
        }).then(function() {
            return new Promise(function(resolve, reject) {
                helpers.mvdir(path.join(DIR, '1-1'), path.join(DIR, '1-1-mv'), function(error) {
                    error ? reject(error) : resolve();
                });
            });
        }).then(function() {
            assert.equal(true, fs.existsSync(path.join(DIR, '1-1-mv/2-1/3-1/4-1/5-1/6-1')));
            assert.equal(true, fs.existsSync(path.join(DIR, '1-1-mv/2-2/3-2')));
            assert.equal(true, fs.existsSync(path.join(DIR, '1-1-mv/2-2/bigfile.txt')));
            assert.equal(false, fs.existsSync(path.join(DIR, '1-1')));
        });
    });

});
