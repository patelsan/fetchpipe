'use strict';

describe("FetchPipe API", function () {
    var url = "http://jsonplaceholder.typicode.com/posts/1";
    var invalidUrl = "http://jsonplaceholder.typicode.com/XXX/1"; //HTTP 404

    beforeEach(function () {
        fetchPipe.removeAllHandlers();
    });

    it("should work with the plain vanilla calls as is", function (done) {
        fetch(url).then(function (res) {
            done();
        })["catch"](function (e) {
            fail("API call resulted in to unexpected error.");
            done();
        });
    });

    it("should call the success handler", function (done) {
        fetchPipe.onSuccess(function (r) {
            done();
            return r;
        });

        fetch(url).then(function (res) {
            //Do nothing
        })["catch"](function (e) {
            fail("API call resulted in to unexpected error.");
            done();
        });
    });

    it("should call the request handler", function (done) {
        var gotRequestCallback = false;

        fetchPipe.onRequest(function (request, options) {
            gotRequestCallback = true;
        });

        fetchPipe(url).then(function (res) {
            expect(gotRequestCallback).toBe(true);
            done();
        })["catch"](function (e) {
            fail("API call resulted in to unexpected error.");
            done();
        });
    });

    it("should call the error handler", function (done) {
        fetchPipe.onError(function (r) {
            done();
        });

        fetchPipe(invalidUrl).then(function (res) {
            //Do nothing - we should never be here
            fail("Unexpected call to success when error was expected.");
        })["catch"](function (e) {
            fail("API call resulted in to unexpected error.");
            done();
        });
    });
});

//# sourceMappingURL=api.test-compiled.js.map