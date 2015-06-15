var fs = require('fs');
var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var input = fs.readFileSync(__dirname + '/input.css', 'utf-8');

var test = function (input, opts, done) {
    postcss([ plugin(opts) ]).process(input).then(function(result) {
        done(null, result);
    }).catch(function(error) {
        done(error);
    });
};

describe('postcss-chunk', function () {

    it('breaks input into chunks of max size', function (done) {
        test(input, {size: 5}, function(err, result) {
            if (err) return done(err);
            var chunks = result.chunks;
            expect(chunks.length).to.equal(3);
            expect(chunks[0].root.nodes.length).to.equal(5);
            expect(chunks[2].root.nodes.length).to.equal(2);
            done();
        });
    });

    it('counts multiple selectors per rule', function(done) {
        var newInput = input.replace('two', 'two-a, two-b');
        test(newInput, {size: 5}, function(err, result) {
            if (err) return done(err);
            var chunks = result.chunks;
            expect(chunks.length).to.equal(3);
            expect(chunks[0].root.nodes.length).to.equal(4);
            expect(chunks[2].root.nodes.length).to.equal(3);
            done();
        });
    });

    it('counts at-rules as one rule', function(done) {
        var newInput = input + '@media print { a {}, b {}, c {} }';
        test(newInput, {size: 5}, function(err, result) {
            if (err) return done(err);
            var chunks = result.chunks;
            expect(chunks.length).to.equal(4);
            expect(chunks[3].root.nodes.length).to.equal(1);
            done();
        });
    });

    it('supports nested at-rules', function(done) {
        var newInput = input + '@media print { @media print { a {}, b {}, c {} } }';
        test(newInput, {size: 5}, function(err, result) {
            if (err) return done(err);
            var chunks = result.chunks;
            expect(chunks.length).to.equal(4);
            expect(chunks[3].root.nodes.length).to.equal(1);
            done();
        });
    });
});
