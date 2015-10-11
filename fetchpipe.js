(() => {
    'use strict';

    if (!self.fetch) {
        throw new Error("Your environment doesn't support Fetch API, please use the polyfill.");
        return;
    }

    //Handlers
    var successHandlers = [];
    var errorHandlers = [];
    var requestHandlers = [];

    //FetchPipe function
    self.fetchPipe = (input, init) => {
        var p = new Promise((resolve, reject) => {
            //Call request handlers
            if (!init) {
                init = {};
            }

            handleRequest(input, init);

            //Make the actual call
            fetch(input, init).then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    //Call the chain of handlers before resolving it
                    var updatedReply = handleSuccess(r);
                    //Send the result of the success handler
                    resolve(updatedReply);
                } else {
                    handleError(r, reject);
                }

            }).catch((e) => {
                handleError(e, reject);
            });
        });

        return p;
    };

    //Call the registered handlers
    function handleRequest(request, options) {
        if (requestHandlers.length == 0) {
            return;
        }

        requestHandlers.forEach((handler) => {
            handler(request, options);
        });
    }

    function handleSuccess(r) {
        if (successHandlers.length == 0) {
            return r;
        }

        if (successHandlers.length > 0) {
            var updatedReply = r;
            successHandlers.forEach((handler) => {
                updatedReply = handler(updatedReply); //Original could also be passed as sencon arg
            });
        }

        return updatedReply;
    }

    function handleError(r, reject) {
        if (errorHandlers.length == 0) {
            reject(r);
            return;
        }

        errorHandlers.forEach((handler) => {
            handler(r);
        });

        reject(r);
    }

    //Register your handler/ interceptors: each handler should be registered only once, typically when your application is starting
    self.fetchPipe.onSuccess = (handler) => {
        successHandlers.push(handler);
    };

    self.fetchPipe.onError = (handler) => {
        errorHandlers.push(handler);
    };

    self.fetchPipe.onRequest = (handler) => {
        requestHandlers.push(handler);
    };

    self.fetchPipe.removeAllHandlers = ()=> {
        successHandlers = [];
        errorHandlers = [];
        requestHandlers = [];
    };

})();

//----------------> Consumer code starts here 


fetchPipe.onError((r) => {
    console.log("FROM ERROR HANDLER: ", r);
    return r;
});

fetchPipe.onRequest((request, options) => {
    console.log("FROM REQUEST HANDLER: ", request);
    if (!options.headers) {
        options.headers = {};
    }

    options.headers["authtoken"] = 'xxyyy';
});

//Success scenario
fetchPipe("http://jsonplaceholder.typicode.com/posts/1").then((r) => {
    console.log(r);
}).catch((e) => {
    console.log("ERROR: ", e);
});

//Passheaders:
fetchPipe("http://jsonplaceholder.typicode.com/posts/1", {
    headers: {
        "SomeOtherToken": "1234"
    }
}).then((r) => {
    console.log(r);
}).catch((e) => {
    console.log("ERROR: ", e);
});