'use strict';

describe("FetchPipe API", ()=> {
    var url = "http://jsonplaceholder.typicode.com/posts/1";
    var invalidUrl = "http://jsonplaceholder.typicode.com/XXX/1"; //HTTP 404

    beforeEach(()=> {
        fetchPipe.removeAllHandlers();
    });

    it("should work with the plain vanilla calls as is", (done)=> {
        fetch(url).then((res)=> {
                done();
            }
        ).catch((e)=> {
                fail("API call resulted in to unexpected error.");
                done();
        });
    });

    it("should call the success handler", (done)=> {
        fetchPipe.onSuccess((r)=> {
            done();
            return r;
        });

        fetch(url).then((res)=> {
                //Do nothing
            }
        ).catch((e)=> {
                fail("API call resulted in to unexpected error.");
                done();
            });

    });

    it("should call the request handler", (done)=> {
        var gotRequestCallback = false;

        fetchPipe.onRequest((request, options)=> {
            gotRequestCallback = true;
        });

        fetchPipe(url).then((res)=> {
                expect(gotRequestCallback).toBe(true);
                done();
            }
        ).catch((e)=> {
                fail("API call resulted in to unexpected error.");
                done();
            });

    });

    it("should call the error handler", (done)=> {
        fetchPipe.onError((r)=> {
            done();
        });

        fetchPipe(invalidUrl).then((res)=> {
                //Do nothing - we should never be here
                fail("Unexpected call to success when error was expected.");
            }
        ).catch((e)=> {
                fail("API call resulted in to unexpected error.");
                done();
            });

    });
});