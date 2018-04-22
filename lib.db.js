#!/usr/bin/env node
/*
 * assets.db-lite.js
 *
 * this zero-dependency package will provide a persistent, in-browser database
 *
 * browser example:
 *     <script src="assets.db-lite.js"></script>
 *     <script>
 *     var dbTable1;
 *     dbTable1 = window.dbTable1 = window.utility2_db.dbTableCreateOne({ name: "dbTable1" });
 *     dbTable1.idIndexCreate({ name: "field1" });
 *     dbTable1.crudSetOneById({ field1: "hello", field2: "world" });
 *     console.log(dbTable1.crudGetManyByQuery({
 *         limit: Infinity,
 *         query: { field1: "hello" },
 *         skip: 0,
 *         sort: [{ fieldName: 'field1', isDescending: false }]
 *     }));
 *     </script>
 *
 * node example:
 *     var db, dbTable1;
 *     utility2_db = require("./assets.db-lite.js");
 *     dbTable1 = global.dbTable1 = utility2_db.dbTableCreateOne({ name: "dbTable1" });
 *     dbTable1.idIndexCreate({ name: "field1" });
 *     dbTable1.crudSetOneById({ field1: "hello", field2: "world" });
 *     console.log(dbTable1.crudGetManyByQuery({
 *         limit: Infinity,
 *         query: { field1: "hello" },
 *         skip: 0,
 *         sort: [{ fieldName: 'field1', isDescending: false }]
 *     }));
 */



/* istanbul instrument in package db */
/* jslint-utility2 */
/*jslint
    bitwise: true,
    browser: true,
    maxerr: 4,
    maxlen: 100,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var local;



    // run shared js-env code - init-before
    (function () {
        // init local
        local = {};
        // init modeJs
        local.modeJs = (function () {
            try {
                return typeof navigator.userAgent === 'string' &&
                    typeof document.querySelector('body') === 'object' &&
                    typeof XMLHttpRequest.prototype.open === 'function' &&
                    'browser';
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        // init utility2_rollup
        local = local.global.utility2_rollup || local;
        /* istanbul ignore next */
        if (!local) {
            local = local.global.utility2_rollup ||
                local.global.utility2_rollup_old ||
                require('./assets.utility2.rollup.js');
            local.fs = null;
        }
        // init exports
        if (local.modeJs === 'browser') {
            local.global.utility2_db = local;
        } else {
            // require builtins
            // local.assert = require('assert');
            local.buffer = require('buffer');
            local.child_process = require('child_process');
            local.cluster = require('cluster');
            local.console = require('console');
            local.constants = require('constants');
            local.crypto = require('crypto');
            local.dgram = require('dgram');
            local.dns = require('dns');
            local.domain = require('domain');
            local.events = require('events');
            local.fs = require('fs');
            local.http = require('http');
            local.https = require('https');
            local.module = require('module');
            local.net = require('net');
            local.os = require('os');
            local.path = require('path');
            local.process = require('process');
            local.punycode = require('punycode');
            local.querystring = require('querystring');
            local.readline = require('readline');
            local.repl = require('repl');
            local.stream = require('stream');
            local.string_decoder = require('string_decoder');
            local.timers = require('timers');
            local.tls = require('tls');
            local.tty = require('tty');
            local.url = require('url');
            local.util = require('util');
            local.v8 = require('v8');
            local.vm = require('vm');
            local.zlib = require('zlib');
/* validateLineSortedReset */
            module.exports = local;
            module.exports.__dirname = __dirname;
        }
        // init lib
        local.local = local.db = local;
    }());



    // run shared js-env code - function-before
    /* istanbul ignore next */
    (function () {
        local.assert = function (passed, message, onError) {
        /*
         * this function will throw the error message if passed is falsey
         */
            var error;
            if (passed) {
                return;
            }
            error = message && message.message
                // if message is an error-object, then leave it as is
                ? message
                : new Error(typeof message === 'string'
                    // if message is a string, then leave it as is
                    ? message
                    // else JSON.stringify message
                    : JSON.stringify(message));
            // debug error
            local._debugAssertError = error;
            onError = onError || function (error) {
                throw error;
            };
            onError(error);
        };

        local.cliRun = function (fnc) {
        /*
         * this function will run the cli
         */
            var nop;
            nop = function () {
            /*
             * this function will do nothing
             */
                return;
            };
            local.cliDict._eval = local.cliDict._eval || function () {
            /*
             * code
             * eval code
             */
                local.global.local = local;
                require('vm').runInThisContext(process.argv[3]);
            };
            local.cliDict['--eval'] = local.cliDict['--eval'] || local.cliDict._eval;
            local.cliDict['-e'] = local.cliDict['-e'] || local.cliDict._eval;
            local.cliDict._help = local.cliDict._help || function () {
            /*
             * [none]
             * print help
             */
                var element, result, lengthList, sortDict;
                console.log(require(__dirname + '/package.json').name + ' v' +
                    require(__dirname + '/package.json').version);
                sortDict = {};
                result = [['[command]', '[args]', '[description]', -1]];
                lengthList = [result[0][0].length, result[0][1].length];
                Object.keys(local.cliDict).sort().forEach(function (key, ii) {
                    if (key[0] === '_' && key !== '_default') {
                        return;
                    }
                    sortDict[local.cliDict[key].toString()] =
                        sortDict[local.cliDict[key].toString()] || (ii + 1);
                    element = (/\n +\*(.*)\n +\*(.*)/).exec(local.cliDict[key].toString());
                    // coverage-hack - ignore else-statement
                    nop(local.global.__coverage__ && (function () {
                        element = element || ['', '', ''];
                    }()));
                    element = [
                        key.replace('_default', '[none]') + ' ',
                        element[1].trim() + ' ',
                        element[2].trim(),
                        (sortDict[local.cliDict[key].toString()] << 8) + ii
                    ];
                    result.push(element);
                    lengthList.forEach(function (length, jj) {
                        lengthList[jj] = Math.max(element[jj].length, length);
                    });
                });
                result.sort(function (aa, bb) {
                    return aa[3] < bb[3]
                        ? -1
                        : 1;
                });
                console.log('usage:   ' + __filename + ' [command] [args]');
                console.log('example: ' + __filename + ' --eval    ' +
                    '"console.log(\'hello world\')"\n');
                result.forEach(function (element, ii) {
                    lengthList.forEach(function (length, jj) {
                        while (element[jj].length < length) {
                            element[jj] += '-';
                        }
                    });
                    element = element.slice(0, 3).join('---- ');
                    if (!ii) {
                        element = element.replace((/-/g), ' ');
                    }
                    console.log(element);
                });
            };
            local.cliDict['--help'] = local.cliDict['--help'] || local.cliDict._help;
            local.cliDict['-h'] = local.cliDict['-h'] || local.cliDict._help;
            local.cliDict._default = local.cliDict._default || local.cliDict._help;
            local.cliDict.help = local.cliDict.help || local.cliDict._help;
            local.cliDict._interactive = local.cliDict._interactive || function () {
            /*
             * [none]
             * start interactive-mode
             */
                local.global.local = local;
                local.replStart();
            };
            if (local.replStart) {
                local.cliDict['--interactive'] = local.cliDict['--interactive'] ||
                    local.cliDict._interactive;
                local.cliDict['-i'] = local.cliDict['-i'] || local.cliDict._interactive;
            }
            local.cliDict._version = local.cliDict._version || function () {
            /*
             * [none]
             * print version
             */
                console.log(require(__dirname + '/package.json').version);
            };
            local.cliDict['--version'] = local.cliDict['--version'] || local.cliDict._version;
            local.cliDict['-v'] = local.cliDict['-v'] || local.cliDict._version;
            // run fnc()
            fnc = fnc || function () {
                if (local.cliDict[process.argv[2]]) {
                    local.cliDict[process.argv[2]]();
                    return;
                }
                local.cliDict._default();
            };
            fnc();
        };

        local.jsonCopy = function (jsonObj) {
        /*
         * this function will return a deep-copy of the jsonObj
         */
            return jsonObj === undefined
                ? undefined
                : JSON.parse(JSON.stringify(jsonObj));
        };

        local.jsonStringifyOrdered = function (jsonObj, replacer, space) {
        /*
         * this function will JSON.stringify the jsonObj,
         * with object-keys sorted and circular-references removed
         */
            var circularList, stringify, tmp;
            stringify = function (jsonObj) {
            /*
             * this function will recursively JSON.stringify the jsonObj,
             * with object-keys sorted and circular-references removed
             */
                // if jsonObj is not an object or function, then JSON.stringify as normal
                if (!(jsonObj &&
                        typeof jsonObj === 'object' &&
                        typeof jsonObj.toJSON !== 'function')) {
                    return JSON.stringify(jsonObj);
                }
                // ignore circular-reference
                if (circularList.indexOf(jsonObj) >= 0) {
                    return;
                }
                circularList.push(jsonObj);
                // if jsonObj is an array, then recurse its jsonObjs
                if (Array.isArray(jsonObj)) {
                    return '[' + jsonObj.map(function (jsonObj) {
                        // recurse
                        tmp = stringify(jsonObj);
                        return typeof tmp === 'string'
                            ? tmp
                            : 'null';
                    }).join(',') + ']';
                }
                // if jsonObj is not an array, then recurse its items with object-keys sorted
                return '{' + Object.keys(jsonObj)
                    // sort object-keys
                    .sort()
                    .map(function (key) {
                        // recurse
                        tmp = stringify(jsonObj[key]);
                        if (typeof tmp === 'string') {
                            return JSON.stringify(key) + ':' + tmp;
                        }
                    })
                    .filter(function (jsonObj) {
                        return typeof jsonObj === 'string';
                    })
                    .join(',') + '}';
            };
            circularList = [];
            // try to derefernce all properties in jsonObj
            (function () {
                try {
                    jsonObj = JSON.parse(JSON.stringify(jsonObj));
                } catch (ignore) {
                }
            }());
            return JSON.stringify(typeof jsonObj === 'object' && jsonObj
                // recurse
                ? JSON.parse(stringify(jsonObj))
                : jsonObj, replacer, space);
        };

        local.listShuffle = function (list) {
        /*
         * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
         * this function will inplace shuffle the list, via fisher-yates algorithm
         */
            var ii, random, swap;
            for (ii = list.length - 1; ii > 0; ii -= 1) {
                // coerce to finite integer
                random = (Math.random() * (ii + 1)) | 0;
                swap = list[ii];
                list[ii] = list[random];
                list[random] = swap;
            }
            return list;
        };

        local.nop = function () {
        /*
         * this function will do nothing
         */
            return;
        };

        local.normalizeValue = function (type, value, valueDefault) {
        /*
         * this function will normalize the value by type
         */
            switch (type) {
            case 'list':
                return Array.isArray(value)
                    ? value
                    : valueDefault || [];
            case 'number':
                return Number(value) || valueDefault || 0;
            case 'string':
                return typeof value === 'string'
                    ? value
                    : valueDefault || '';
            }
        };

        local.objectSetOverride = function (arg, overrides, depth, env) {
        /*
         * this function will recursively set overrides for items in the arg
         */
            arg = arg || {};
            env = env || (typeof process === 'object' && process.env) || {};
            overrides = overrides || {};
            Object.keys(overrides).forEach(function (key) {
                var arg2, overrides2;
                arg2 = arg[key];
                overrides2 = overrides[key];
                if (overrides2 === undefined) {
                    return;
                }
                // if both arg2 and overrides2 are non-null and non-array objects,
                // then recurse with arg2 and overrides2
                if (depth > 1 &&
                        // arg2 is a non-null and non-array object
                        typeof arg2 === 'object' && arg2 && !Array.isArray(arg2) &&
                        // overrides2 is a non-null and non-array object
                        typeof overrides2 === 'object' && overrides2 &&
                        !Array.isArray(overrides2)) {
                    local.objectSetOverride(arg2, overrides2, depth - 1, env);
                    return;
                }
                // else set arg[key] with overrides[key]
                arg[key] = arg === env
                    // if arg is env, then overrides falsey value with empty string
                    ? overrides2 || ''
                    : overrides2;
            });
            return arg;
        };

        local.onErrorDefault = function (error) {
        /*
         * this function will if error exists, then print error.stack to stderr
         */
            if (error && !local.global.__coverage__) {
                console.error(error);
            }
        };

        local.onErrorWithStack = function (onError) {
        /*
         * this function will create a new callback that will call onError,
         * and append the current stack to any error
         */
            var stack;
            stack = new Error().stack.replace((/(.*?)\n.*?$/m), '$1');
            return function (error, data, meta) {
                if (error &&
                        error !== local.errorDefault &&
                        String(error.stack).indexOf(stack.split('\n')[2]) < 0) {
                    // append the current stack to error.stack
                    error.stack += '\n' + stack;
                }
                onError(error, data, meta);
            };
        };

        local.onParallel = function (onError, onEach, onRetry) {
        /*
         * this function will create a function that will
         * 1. run async tasks in parallel
         * 2. if counter === 0 or error occurred, then call onError with error
         */
            var onParallel;
            onError = local.onErrorWithStack(onError);
            onEach = onEach || local.nop;
            onRetry = onRetry || local.nop;
            onParallel = function (error, data) {
                if (onRetry(error, data)) {
                    return;
                }
                // decrement counter
                onParallel.counter -= 1;
                // validate counter
                local.assert(
                    onParallel.counter >= 0 || error || onParallel.error,
                    'invalid onParallel.counter = ' + onParallel.counter
                );
                // ensure onError is run only once
                if (onParallel.counter < 0) {
                    return;
                }
                // handle error
                if (error) {
                    onParallel.error = error;
                    // ensure counter <= 0
                    onParallel.counter = -Math.abs(onParallel.counter);
                }
                // call onError when isDone
                if (onParallel.counter <= 0) {
                    onError(error, data);
                    return;
                }
                onEach();
            };
            // init counter
            onParallel.counter = 0;
            // return callback
            return onParallel;
        };

        local.replStart = function () {
        /*
         * this function will start the repl-debugger
         */
            /*jslint evil: true*/
            var self;
            if (global.utility2_serverRepl1) {
                return;
            }
            // start replServer
            self = global.utility2_serverRepl1 = require('repl').start({ useGlobal: true });
            self.nop = function () {
            /*
             * this function will do nothing
             */
                return;
            };
            self.onError = function (error) {
            /*
             * this function will debug any repl-error
             */
                // debug error
                global.utility2_debugReplError = error;
                console.error(error);
            };
            // save repl eval function
            self.evalDefault = self.eval;
            // hook custom repl eval function
            self.eval = function (script, context, file, onError) {
                var match, onError2;
                match = (/^(\S+)(.*?)\n/).exec(script) || {};
                onError2 = function (error, data) {
                    // debug error
                    global.utility2_debugReplError = error || global.utility2_debugReplError;
                    onError(error, data);
                };
                switch (match[1]) {
                // syntax sugar to run async shell command
                case '$':
                    switch (match[2]) {
                    // syntax sugar to run git diff
                    case ' git diff':
                        match[2] = ' git diff --color | cat';
                        break;
                    // syntax sugar to run git log
                    case ' git log':
                        match[2] = ' git log -n 4 | cat';
                        break;
                    }
                    // run async shell command
                    require('child_process').spawn(match[2], {
                        shell: true,
                        stdio: ['ignore', 1, 2]
                    })
                        // on shell exit, print return prompt
                        .on('exit', function (exitCode) {
                            console.error('exit-code ' + exitCode);
                            self.evalDefault(
                                '\n',
                                context,
                                file,
                                onError2
                            );
                        });
                    script = '\n';
                    break;
                // syntax sugar to grep current dir
                case 'grep':
                    // run async shell command
                    require('child_process').spawn('find . -type f | grep -v ' +
/* jslint-ignore-begin */
'"\
/\\.\\|\\(\\b\\|_\\)\\(\\.\\d\\|\
archive\\|artifact\\|\
bower_component\\|build\\|\
coverage\\|\
doc\\|\
external\\|\
fixture\\|\
git_module\\|\
jquery\\|\
log\\|\
min\\|mock\\|\
node_module\\|\
rollup\\|\
swp\\|\
tmp\\|\
vendor\\)s\\{0,1\\}\\(\\b\\|_\\)\
" ' +
/* jslint-ignore-end */
                            '| tr "\\n" "\\000" | xargs -0 grep -in "' +
                            match[2].trim() + '"', { shell: true, stdio: ['ignore', 1, 2] })
                        // on shell exit, print return prompt
                        .on('exit', function (exitCode) {
                            console.error('exit-code ' + exitCode);
                            self.evalDefault(
                                '\n',
                                context,
                                file,
                                onError2
                            );
                        });
                    script = '\n';
                    break;
                // syntax sugar to list object's keys, sorted by item-type
                case 'keys':
                    script = 'console.error(Object.keys(' + match[2] +
                        ').map(function (key) {' +
                        'return typeof ' + match[2] + '[key] + " " + key + "\\n";' +
                        '}).sort().join("") + Object.keys(' + match[2] + ').length)\n';
                    break;
                // syntax sugar to print stringified arg
                case 'print':
                    script = 'console.error(String(' + match[2] + '))\n';
                    break;
                }
                // eval the script
                self.evalDefault(script, context, file, onError2);
            };
            self.socket = { end: self.nop, on: self.nop, write: self.nop };
            // init process.stdout
            process.stdout._writeDefault = process.stdout._writeDefault ||
                process.stdout._write;
            process.stdout._write = function (chunk, encoding, callback) {
                process.stdout._writeDefault(chunk, encoding, callback);
                // coverage-hack - ignore else-statement
                self.nop(self.socket.writable && (function () {
                    self.socket.write(chunk, encoding);
                }()));
            };
            // start tcp-server
            global.utility2_serverReplTcp1 = require('net').createServer(function (socket) {
                // init socket
                self.socket = socket;
                self.socket.on('data', self.write.bind(self));
                self.socket.on('error', self.onError);
                self.socket.setKeepAlive(true);
            });
            // coverage-hack - ignore else-statement
            self.nop(process.env.PORT_REPL && (function () {
                console.error('repl-server listening on tcp-port ' + process.env.PORT_REPL);
                global.utility2_serverReplTcp1.listen(process.env.PORT_REPL);
            }()));
        };

        local.setTimeoutOnError = function (onError, timeout, error, data) {
        /*
         * this function will async-call onError
         */
            if (typeof onError === 'function') {
                setTimeout(function () {
                    onError(error, data);
                }, timeout);
            }
            return data;
        };
    }());



    // run shared js-env code - lib.storage.js
    (function (local) {
        var child_process,
            clear,
            defer,
            deferList,
            fs,
            getItem,
            init,
            keys,
            length,
            modeJs,
            os,
            removeItem,
            setItem,
            storage,
            storageDir;

        // init modeJs
        modeJs = (function () {
            try {
                return typeof navigator.userAgent === 'string' &&
                    typeof document.querySelector('body') === 'object' &&
                    typeof XMLHttpRequest.prototype.open === 'function' &&
                    'browser';
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
        storageDir = 'tmp/storage.' + (local.modeJs === 'browser'
            ? 'undefined'
            : process.env.NODE_ENV);
        switch (modeJs) {
        case 'node':
            // require modules
            child_process = require('child_process');
            fs = require('fs');
            os = require('os');
            break;
        }

        clear = function (onError) {
        /*
         * this function will clear storage
         */
            defer({ action: 'clear' }, onError);
        };

        defer = function (options, onError) {
        /*
         * this function will defer options.action until storage is ready
         */
            var data, isDone, objectStore, onError2, request, tmp;
            onError = onError || function (error) {
                // validate no error occurred
                local.assert(!error, error);
            };
            if (!storage) {
                deferList.push(function () {
                    defer(options, onError);
                });
                init();
                return;
            }
            switch (modeJs) {
            case 'browser':
                onError2 = function () {
                    /* istanbul ignore next */
                    if (isDone) {
                        return;
                    }
                    isDone = true;
                    onError(
                        request && (request.error || request.transaction.error),
                        data || request.result || ''
                    );
                };
                switch (options.action) {
                case 'clear':
                case 'removeItem':
                case 'setItem':
                    objectStore = storage
                        .transaction(storageDir, 'readwrite')
                        .objectStore(storageDir);
                    break;
                default:
                    objectStore = storage
                        .transaction(storageDir, 'readonly')
                        .objectStore(storageDir);
                }
                switch (options.action) {
                case 'clear':
                    request = objectStore.clear();
                    break;
                case 'getItem':
                    request = objectStore.get(String(options.key));
                    break;
                case 'keys':
                    data = [];
                    request = objectStore.openCursor();
                    request.onsuccess = function () {
                        if (!request.result) {
                            onError2();
                            return;
                        }
                        data.push(request.result.key);
                        request.result.continue();
                    };
                    break;
                case 'length':
                    request = objectStore.count();
                    break;
                case 'removeItem':
                    request = objectStore.delete(String(options.key));
                    break;
                case 'setItem':
                    request = objectStore.put(options.value, String(options.key));
                    break;
                }
                ['onabort', 'onerror', 'onsuccess'].forEach(function (handler) {
                    request[handler] = request[handler] || onError2;
                });
                // debug request
                local._debugStorageRequest = request;
                break;
            case 'node':
                switch (options.action) {
                case 'clear':
                    child_process.spawnSync('rm -f ' + storage + '/*', {
                        shell: true,
                        stdio: ['ignore', 1, 2]
                    });
                    setTimeout(onError);
                    break;
                case 'getItem':
                    fs.readFile(
                        storage + '/' + encodeURIComponent(String(options.key)),
                        'utf8',
                        // ignore error
                        function (error, data) {
                            onError(error && null, data || '');
                        }
                    );
                    break;
                case 'keys':
                    fs.readdir(storage, function (error, data) {
                        onError(error, data && data.map(decodeURIComponent));
                    });
                    break;
                case 'length':
                    fs.readdir(storage, function (error, data) {
                        onError(error, data && data.length);
                    });
                    break;
                case 'removeItem':
                    fs.unlink(
                        storage + '/' + encodeURIComponent(String(options.key)),
                        // ignore error
                        function () {
                            onError();
                        }
                    );
                    break;
                case 'setItem':
                    tmp = os.tmpdir() + '/' + Date.now() + Math.random();
                    // save to tmp
                    fs.writeFile(tmp, options.value, function (error) {
                        // validate no error occurred
                        local.assert(!error, error);
                        // rename tmp to key
                        fs.rename(
                            tmp,
                            storage + '/' + encodeURIComponent(String(options.key)),
                            onError
                        );
                    });
                    break;
                }
                break;
            }
        };

        deferList = [];

        getItem = function (key, onError) {
        /*
         * this function will get the item with the given key from storage
         */
            defer({ action: 'getItem', key: key }, onError);
        };

        init = function () {
        /*
         * this function will init storage
         */
            var onError, request;
            onError = function (error) {
                // validate no error occurred
                local.assert(!error, error);
                if (modeJs === 'browser') {
                    storage = window[storageDir];
                }
                while (deferList.length) {
                    deferList.shift()();
                }
            };
            if (modeJs === 'browser') {
                storage = window[storageDir];
            }
            if (storage) {
                onError();
                return;
            }
            switch (modeJs) {
            case 'browser':
                // init indexedDB
                try {
                    request = window.indexedDB.open(storageDir);
                    // debug request
                    local._debugStorageRequestIndexedDB = request;
                    request.onerror = onError;
                    request.onsuccess = function () {
                        window[storageDir] = request.result;
                        onError();
                    };
                    request.onupgradeneeded = function () {
                        if (!request.result.objectStoreNames.contains(storageDir)) {
                            request.result.createObjectStore(storageDir);
                        }
                    };
                } catch (ignore) {
                }
                break;
            case 'node':
                // mkdirp storage
                storage = storageDir;
                child_process.spawnSync(
                    'mkdir',
                    ['-p', storage],
                    { stdio: ['ignore', 1, 2] }
                );
                onError();
                break;
            }
        };

        keys = function (onError) {
        /*
         * this function will get all the keys in storage
         */
            defer({ action: 'keys' }, onError);
        };

        length = function (onError) {
        /*
         * this function will get the number of items in storage
         */
            defer({ action: 'length' }, onError);
        };

        removeItem = function (key, onError) {
        /*
         * this function will remove the item with the given key from storage
         */
            defer({ action: 'removeItem', key: key }, onError);
        };

        setItem = function (key, value, onError) {
        /*
         * this function will set the item with the given key and value to storage
         */
            defer({ action: 'setItem', key: key, value: value }, onError);
        };

        // init local
        local.storage = storage;
        local.storageClear = clear;
        local.storageDefer = defer;
        local.storageDeferList = deferList;
        local.storageDir = storageDir;
        local.storageGetItem = getItem;
        local.storageInit = init;
        local.storageKeys = keys;
        local.storageLength = length;
        local.storageRemoveItem = removeItem;
        local.storageSetItem = setItem;
    }(local));



    // run shared js-env code - lib.dbTable.js
    (function () {
        local._DbTable = function (options) {
        /*
         * this function will create a dbTable
         */
            options = local.objectSetOverride(options);
            this.name = String(options.name);
            // register dbTable in dbTableDict
            local.dbTableDict[this.name] = this;
            this.dbRowList = [];
            this.isDirty = null;
            this.idIndexList = [{ isInteger: false, name: '_id', dict: {} }];
            this.onSaveList = [];
            this.sizeLimit = options.sizeLimit || 0;
        };

        local._DbTable.prototype._cleanup = function () {
        /*
         * this function will cleanup soft-deleted records from the dbTable
         */
            var dbRow, ii, list;
            if (!this.isDirty && this.dbRowList.length <= this.sizeLimit) {
                return;
            }
            this.isDirty = null;
            // cleanup dbRowList
            list = this.dbRowList;
            this.dbRowList = [];
            // optimization - for-loop
            for (ii = 0; ii < list.length; ii += 1) {
                dbRow = list[ii];
                // cleanup isRemoved
                if (!dbRow.$meta.isRemoved) {
                    this.dbRowList.push(dbRow);
                }
            }
            if (this.sizeLimit && this.dbRowList.length >= 1.5 * this.sizeLimit) {
                this.dbRowList = this._crudGetManyByQuery(
                    {},
                    this.sortDefault,
                    0,
                    this.sizeLimit
                );
            }
        };

        local._DbTable.prototype._crudGetManyByQuery = function (
            query,
            sort,
            skip,
            limit,
            shuffle
        ) {
        /*
         * this function will get the dbRow's in the dbTable,
         * with the given query, sort, skip, and limit
         */
            var ii, result;
            result = this.dbRowList;
            // get by query
            if (result.length && query && Object.keys(query).length) {
                result = local.dbRowListGetManyByQuery(this.dbRowList, query);
            }
            // sort
            local.normalizeValue('list', sort).forEach(function (element) {
                // bug-workaround - v8 does not have stable-sort
                // optimization - for-loop
                for (ii = 0; ii < result.length; ii += 1) {
                    result[ii].$meta.ii = ii;
                }
                if (element.isDescending) {
                    result.sort(function (aa, bb) {
                        return -local.sortCompare(
                            local.dbRowGetItem(aa, element.fieldName),
                            local.dbRowGetItem(bb, element.fieldName),
                            aa.$meta.ii,
                            bb.$meta.ii
                        );
                    });
                } else {
                    result.sort(function (aa, bb) {
                        return local.sortCompare(
                            local.dbRowGetItem(aa, element.fieldName),
                            local.dbRowGetItem(bb, element.fieldName),
                            aa.$meta.ii,
                            bb.$meta.ii
                        );
                    });
                }
            });
            // skip
            result = result.slice(skip || 0);
            // shuffle
            ((shuffle && local.listShuffle) || local.nop)(result);
            // limit
            result = result.slice(0, limit || Infinity);
            return result;
        };

        local._DbTable.prototype._crudGetOneById = function (idDict) {
        /*
         * this function will get the dbRow in the dbTable with the given idDict
         */
            var id, result;
            idDict = local.objectSetOverride(idDict);
            result = null;
            this.idIndexList.some(function (idIndex) {
                id = idDict[idIndex.name];
                // optimization - hasOwnProperty
                if (idIndex.dict.hasOwnProperty(id)) {
                    result = idIndex.dict[id];
                    return result;
                }
            });
            return result;
        };

        local._DbTable.prototype._crudRemoveOneById = function (idDict, circularList) {
        /*
         * this function will remove the dbRow from the dbTable with the given idDict
         */
            var id, result, self;
            if (!idDict) {
                return null;
            }
            self = this;
            circularList = circularList || [idDict];
            result = null;
            self.idIndexList.forEach(function (idIndex) {
                id = idDict[idIndex.name];
                // optimization - hasOwnProperty
                if (!idIndex.dict.hasOwnProperty(id)) {
                    return;
                }
                result = idIndex.dict[id];
                delete idIndex.dict[id];
                // optimization - soft-delete
                result.$meta.isRemoved = true;
                self.isDirty = true;
                if (circularList.indexOf(result) >= 0) {
                    return;
                }
                circularList.push(result);
                // recurse
                self._crudRemoveOneById(result, circularList);
            });
            self.save();
            return result;
        };

        local._DbTable.prototype._crudSetOneById = function (dbRow) {
        /*
         * this function will set the dbRow into the dbTable with the given dbRow._id
         * WARNING - existing dbRow with conflicting dbRow._id will be removed
         */
            var existing, id, normalize, timeNow;
            normalize = function (dbRow) {
            /*
             * this function will recursively normalize dbRow
             */
                if (typeof dbRow === 'object' && dbRow) {
                    Object.keys(dbRow).forEach(function (key) {
                        // remove invalid property
                        if (key[0] === '$' || key.indexOf('.') >= 0 || dbRow[key] === null) {
                            // optimization - soft-delete
                            dbRow[key] = undefined;
                            return;
                        }
                        // recurse
                        normalize(dbRow[key]);
                    });
                }
            };
            dbRow = local.jsonCopy(typeof dbRow === 'object' && dbRow
                ? dbRow
                : {});
            // update timestamp
            timeNow = new Date().toISOString();
            dbRow._timeCreated = dbRow._timeCreated || timeNow;
            if (!local.modeImport) {
                dbRow._timeUpdated = timeNow;
            }
            // normalize
            normalize(dbRow);
            dbRow = local.jsonCopy(dbRow);
            // remove existing dbRow
            existing = this._crudRemoveOneById(dbRow) || dbRow;
            // init meta
            dbRow.$meta = { isRemoved: null };
            this.idIndexList.forEach(function (idIndex) {
                // auto-set id
                id = local.dbRowSetId(existing, idIndex);
                // copy id from existing to dbRow
                dbRow[idIndex.name] = id;
                // set dbRow
                idIndex.dict[id] = dbRow;
            });
            // update dbRowList
            this.dbRowList.push(dbRow);
            this.save();
            return dbRow;
        };

        local._DbTable.prototype._crudUpdateOneById = function (dbRow) {
        /*
         * this function will update the dbRow in the dbTable,
         * if it exists with the given dbRow._id
         * WARNING
         * existing dbRow's with conflicting unique-keys (besides the one being updated)
         * will be removed
         */
            var id, result;
            dbRow = local.jsonCopy(local.objectSetOverride(dbRow));
            result = null;
            this.idIndexList.some(function (idIndex) {
                id = dbRow[idIndex.name];
                // optimization - hasOwnProperty
                if (idIndex.dict.hasOwnProperty(id)) {
                    result = idIndex.dict[id];
                    return true;
                }
            });
            result = result || {};
            // remove existing dbRow
            this._crudRemoveOneById(result);
            // update dbRow
            dbRow._timeCreated = undefined;
            local.objectSetOverride(result, dbRow, 10);
            // replace dbRow
            result = this._crudSetOneById(result);
            return result;
        };

        local._DbTable.prototype.crudCountAll = function (onError) {
        /*
         * this function will count all of dbRow's in the dbTable
         */
            this._cleanup();
            return local.setTimeoutOnError(onError, 0, null, this.dbRowList.length);
        };

        local._DbTable.prototype.crudCountManyByQuery = function (query, onError) {
        /*
         * this function will count the number of dbRow's in the dbTable with the given query
         */
            this._cleanup();
            return local.setTimeoutOnError(
                onError,
                0,
                null,
                this._crudGetManyByQuery(query).length
            );
        };

        local._DbTable.prototype.crudGetManyById = function (idDictList, onError) {
        /*
         * this function will get the dbRow's in the dbTable with the given idDictList
         */
            var self;
            this._cleanup();
            self = this;
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                local.normalizeValue('list', idDictList).map(function (idDict) {
                    return self._crudGetOneById(idDict);
                })
            ));
        };

        local._DbTable.prototype.crudGetManyByQuery = function (options, onError) {
        /*
         * this function will get the dbRow's in the dbTable with the given options.query
         */
            this._cleanup();
            options = local.objectSetOverride(options);
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                this._crudGetManyByQuery(
                    options.query,
                    options.sort || this.sortDefault,
                    options.skip,
                    options.limit,
                    options.shuffle
                ),
                options.fieldList
            ));
        };

        local._DbTable.prototype.crudGetOneById = function (idDict, onError) {
        /*
         * this function will get the dbRow in the dbTable with the given idDict
         */
            this._cleanup();
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                this._crudGetOneById(idDict)
            ));
        };

        local._DbTable.prototype.crudGetOneByQuery = function (query, onError) {
        /*
         * this function will get the dbRow in the dbTable with the given query
         */
            var ii, result;
            this._cleanup();
            // optimization - for-loop
            for (ii = 0; ii < this.dbRowList.length; ii += 1) {
                result = local.dbRowListGetManyByQuery([this.dbRowList[ii]], query)[0];
                if (result) {
                    break;
                }
            }
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(result));
        };

        local._DbTable.prototype.crudGetOneByRandom = function (onError) {
        /*
         * this function will get a random dbRow in the dbTable
         */
            this._cleanup();
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                this.dbRowList[Math.floor(Math.random() * this.dbRowList.length)]
            ));
        };

        local._DbTable.prototype.crudRemoveAll = function (onError) {
        /*
         * this function will remove all of the dbRow's from the dbTable
         */
            var idIndexList;
            // save idIndexList
            idIndexList = this.idIndexList;
            // reset dbTable
            local._DbTable.call(this, this);
            // restore idIndexList
            local.dbTableCreateOne({
                name: this.name,
                idIndexCreateList: idIndexList
            }, onError);
        };

        local._DbTable.prototype.crudRemoveManyById = function (idDictList, onError) {
        /*
         * this function will remove the dbRow's from the dbTable with the given idDictList
         */
            var self;
            self = this;
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                local.normalizeValue('list', idDictList).map(function (dbRow) {
                    return self._crudRemoveOneById(dbRow);
                })
            ));
        };

        local._DbTable.prototype.crudRemoveManyByQuery = function (query, onError) {
        /*
         * this function will remove the dbRow's from the dbTable with the given query
         */
            var self;
            self = this;
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                self._crudGetManyByQuery(query).map(function (dbRow) {
                    return self._crudRemoveOneById(dbRow);
                })
            ));
        };

        local._DbTable.prototype.crudRemoveOneById = function (idDict, onError) {
        /*
         * this function will remove the dbRow from the dbTable with the given idDict
         */
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                this._crudRemoveOneById(idDict)
            ));
        };

        local._DbTable.prototype.crudSetManyById = function (dbRowList, onError) {
        /*
         * this function will set the dbRowList into the dbTable
         */
            var self;
            self = this;
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                local.normalizeValue('list', dbRowList).map(function (dbRow) {
                    return self._crudSetOneById(dbRow);
                })
            ));
        };

        local._DbTable.prototype.crudSetOneById = function (dbRow, onError) {
        /*
         * this function will set the dbRow into the dbTable with the given dbRow._id
         */
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                this._crudSetOneById(dbRow)
            ));
        };

        local._DbTable.prototype.crudUpdateManyById = function (dbRowList, onError) {
        /*
         * this function will update the dbRowList in the dbTable,
         * if they exist with the given dbRow._id's
         */
            var self;
            self = this;
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                local.normalizeValue('list', dbRowList).map(function (dbRow) {
                    return self._crudUpdateOneById(dbRow);
                })
            ));
        };

        local._DbTable.prototype.crudUpdateManyByQuery = function (query, dbRow, onError) {
        /*
         * this function will update the dbRow's in the dbTable with the given query
         */
            var result, self, tmp;
            self = this;
            tmp = local.jsonCopy(local.objectSetOverride(dbRow));
            result = self._crudGetManyByQuery(query).map(function (dbRow) {
                tmp._id = dbRow._id;
                return self._crudUpdateOneById(tmp);
            });
            return local.setTimeoutOnError(onError, 0, null, result);
        };

        local._DbTable.prototype.crudUpdateOneById = function (dbRow, onError) {
        /*
         * this function will update the dbRow in the dbTable,
         * if it exists with the given dbRow._id
         */
            return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
                this._crudUpdateOneById(dbRow)
            ));
        };

        local._DbTable.prototype.drop = function (onError) {
        /*
         * this function will drop the dbTable
         */
            console.error('dropping dbTable ' + this.name + ' ...');
            // cancel pending save
            this.timerSave = null;
            while (this.onSaveList.length) {
                this.onSaveList.shift()();
            }
            // reset dbTable
            local._DbTable.call(this, this);
            // clear persistence
            local.storageRemoveItem('dbTable.' + this.name + '.json', onError);
        };

        local._DbTable.prototype.export = function (onError) {
        /*
         * this function will export the db
         */
            var result, self;
            this._cleanup();
            self = this;
            result = '';
            self.idIndexList.forEach(function (idIndex) {
                result += self.name + ' idIndexCreate ' + JSON.stringify({
                    isInteger: idIndex.isInteger,
                    name: idIndex.name
                }) + '\n';
            });
            result += self.name + ' sizeLimit ' + self.sizeLimit + '\n';
            result += self.name + ' sortDefault ' + JSON.stringify(self.sortDefault) + '\n';
            self.crudGetManyByQuery({}).forEach(function (dbRow) {
                result += self.name + ' dbRowSet ' + JSON.stringify(dbRow) + '\n';
            });
            return local.setTimeoutOnError(onError, 0, null, result.trim());
        };

        local._DbTable.prototype.idIndexCreate = function (options, onError) {
        /*
         * this function will create an idIndex with the given options.name
         */
            var dbRow, idIndex, ii, name;
            options = local.objectSetOverride(options);
            name = String(options.name);
            // disallow idIndex with dot-name
            if (name.indexOf('.') >= 0 || name === '_id') {
                return local.setTimeoutOnError(onError);
            }
            // remove existing idIndex
            this.idIndexRemove(options);
            // init idIndex
            idIndex = {
                dict: {},
                isInteger: !!options.isInteger,
                name: name
            };
            this.idIndexList.push(idIndex);
            // populate idIndex with dbRowList
            // optimization - for-loop
            for (ii = 0; ii < this.dbRowList.length; ii += 1) {
                dbRow = this.dbRowList[ii];
                // auto-set id
                if (!dbRow.$meta.isRemoved) {
                    idIndex.dict[local.dbRowSetId(dbRow, idIndex)] = dbRow;
                }
            }
            this.save();
            return local.setTimeoutOnError(onError);
        };

        local._DbTable.prototype.idIndexRemove = function (options, onError) {
        /*
         * this function will remove the idIndex with the given options.name
         */
            var name;
            options = local.objectSetOverride(options);
            name = String(options.name);
            this.idIndexList = this.idIndexList.filter(function (idIndex) {
                return idIndex.name !== name || idIndex.name === '_id';
            });
            this.save();
            return local.setTimeoutOnError(onError);
        };

        local._DbTable.prototype.save = function (onError) {
        /*
         * this function will save the dbTable to storage
         */
            var self;
            self = this;
            if (local.modeImport) {
                return;
            }
            if (onError) {
                self.onSaveList.push(onError);
            }
            // throttle storage-writes to once every 1000 ms
            self.timerSave = self.timerSave || setTimeout(function () {
                self.timerSave = null;
                local.storageSetItem('dbTable.' + self.name + '.json', self.export(), function (
                    error
                ) {
                    while (self.onSaveList.length) {
                        self.onSaveList.shift()(error);
                    }
                });
            }, 1000);
        };

        local.dbCrudRemoveAll = function (onError) {
        /*
         * this function will remove all dbRow's from the db
         */
            var onParallel;
            onParallel = local.onParallel(function (error) {
                local.setTimeoutOnError(onError, 0, error);
            });
            onParallel.counter += 1;
            Object.keys(local.dbTableDict).forEach(function (key) {
                onParallel.counter += 1;
                local.dbTableDict[key].crudRemoveAll(onParallel);
            });
            onParallel();
        };

        local.dbDrop = function (onError) {
        /*
         * this function will drop the db
         */
            var onParallel;
            onParallel = local.onParallel(function (error) {
                local.setTimeoutOnError(onError, 0, error);
            });
            onParallel.counter += 1;
            onParallel.counter += 1;
            local.storageClear(onParallel);
            Object.keys(local.dbTableDict).forEach(function (key) {
                onParallel.counter += 1;
                local.dbTableDict[key].drop(onParallel);
            });
            onParallel();
        };

        local.dbExport = function (onError) {
        /*
         * this function will export the db as serialized text
         */
            var result;
            result = '';
            Object.keys(local.dbTableDict).forEach(function (key) {
                result += local.dbTableDict[key].export();
                result += '\n\n';
            });
            return local.setTimeoutOnError(onError, 0, null, result.trim());
        };

        local.dbImport = function (text, onError) {
        /*
         * this function will import the serialized text into the db
         */
            var dbTable;
            local.modeImport = true;
            setTimeout(function () {
                local.modeImport = null;
            });
            text.replace((/^(\w\S*?) (\S+?) (\S.*?)$/gm), function (
                match0,
                match1,
                match2,
                match3
            ) {
                // jslint-hack
                local.nop(match0);
                switch (match2) {
                case 'dbRowSet':
                    dbTable = local.dbTableCreateOne({ isLoaded: true, name: match1 });
                    dbTable.crudSetOneById(JSON.parse(match3));
                    break;
                case 'idIndexCreate':
                    dbTable = local.dbTableCreateOne({ isLoaded: true, name: match1 });
                    dbTable.idIndexCreate(JSON.parse(match3));
                    break;
                case 'sizeLimit':
                    dbTable = local.dbTableCreateOne({ isLoaded: true, name: match1 });
                    dbTable.sizeLimit = JSON.parse(match3);
                    break;
                case 'sortDefault':
                    dbTable = local.dbTableCreateOne({ isLoaded: true, name: match1 });
                    break;
                default:
                    local.onErrorDefault(new Error('dbImport - invalid operation - ' + match0));
                }
            });
            local.modeImport = null;
            return local.setTimeoutOnError(onError);
        };

        local.dbLoad = function (onError) {
        /*
         * this function will load the db from storage
         */
            var onParallel;
            onParallel = local.onParallel(function (error) {
                local.setTimeoutOnError(onError, 0, error);
            });
            local.storageKeys(function (error, data) {
                onParallel.counter += 1;
                onParallel.counter += 1;
                onParallel(error);
                local.normalizeValue('list', data)
                    .filter(function (key) {
                        return key.indexOf('dbTable.') === 0;
                    })
                    .forEach(function (key) {
                        onParallel.counter += 1;
                        local.storageGetItem(key, function (error, data) {
                            onParallel.counter += 1;
                            onParallel(error);
                            local.dbImport(data, onParallel);
                        });
                    });
                onParallel();
            });
        };

        local.dbRowGetItem = function (dbRow, key) {
        /*
         * this function will get the item with the given key from dbRow
         */
            var ii, value;
            value = dbRow;
            key = String(key).split('.');
            // optimization - for-loop
            for (ii = 0; ii < key.length && typeof value === 'object' && value; ii += 1) {
                value = value[key[ii]];
            }
            return value === undefined
                ? null
                : value;
        };

        local.dbRowListGetManyByOperator = function (dbRowList, fieldName, operator, bb, not) {
        /*
         * this function will get the dbRow's in dbRowList with the given operator
         */
            var ii, jj, result, fieldValue, test, typeof2;
            result = [];
            typeof2 = typeof bb;
            if (bb && typeof2 === 'object') {
                switch (operator) {
                case '$in':
                case '$nin':
                case '$regex':
                    break;
                default:
                    return result;
                }
            }
            switch (operator) {
            case '$eq':
                test = function (aa, bb) {
                    return aa === bb;
                };
                break;
            case '$exists':
                bb = !bb;
                test = function (aa, bb) {
                    return !((aa === null) ^ bb);
                };
                break;
            case '$gt':
                test = function (aa, bb, typeof1, typeof2) {
                    return typeof1 === typeof2 && aa > bb;
                };
                break;
            case '$gte':
                test = function (aa, bb, typeof1, typeof2) {
                    return typeof1 === typeof2 && aa >= bb;
                };
                break;
            case '$in':
                if (bb && typeof bb.indexOf === 'function') {
                    if (typeof2 === 'string') {
                        test = function (aa, bb, typeof1, typeof2) {
                            return typeof1 === typeof2 && bb.indexOf(aa) >= 0;
                        };
                    } else {
                        test = function (aa, bb) {
                            return bb.indexOf(aa) >= 0;
                        };
                    }
                }
                break;
            case '$lt':
                test = function (aa, bb, typeof1, typeof2) {
                    return typeof1 === typeof2 && aa < bb;
                };
                break;
            case '$lte':
                test = function (aa, bb, typeof1, typeof2) {
                    return typeof1 === typeof2 && aa <= bb;
                };
                break;
            case '$ne':
                test = function (aa, bb) {
                    return aa !== bb;
                };
                break;
            case '$nin':
                if (bb && typeof bb.indexOf === 'function') {
                    if (typeof2 === 'string') {
                        test = function (aa, bb, typeof1, typeof2) {
                            return typeof1 === typeof2 && bb.indexOf(aa) < 0;
                        };
                    } else {
                        test = function (aa, bb) {
                            return bb.indexOf(aa) < 0;
                        };
                    }
                }
                break;
            case '$regex':
                if (bb && typeof bb.test === 'function') {
                    test = function (aa, bb) {
                        return bb.test(aa);
                    };
                }
                break;
            case '$typeof':
                test = function (aa, bb, typeof1) {
                    // jslint-hack
                    local.nop(aa);
                    return typeof1 === bb;
                };
                break;
            }
            if (!test) {
                return result;
            }
            // optimization - for-loop
            for (ii = dbRowList.length - 1; ii >= 0; ii -= 1) {
                fieldValue = local.dbRowGetItem(dbRowList[ii], fieldName);
                // normalize to list
                if (!Array.isArray(fieldValue)) {
                    fieldValue = [fieldValue];
                }
                // optimization - for-loop
                for (jj = fieldValue.length - 1; jj >= 0; jj -= 1) {
                    if (not ^ test(fieldValue[jj], bb, typeof fieldValue[jj], typeof2)) {
                        result.push(dbRowList[ii]);
                        break;
                    }
                }
            }
            return result;
        };

        local.dbRowListGetManyByQuery = function (dbRowList, query, fieldName, not) {
        /*
         * this function will get the dbRow's in dbRowList with the given query
         */
            var bb, dbRowDict, result;
            // optimization - convert to boolean
            not = !!not;
            result = dbRowList;
            if (!(typeof query === 'object' && query)) {
                result = local.dbRowListGetManyByOperator(result, fieldName, '$eq', query, not);
                return result;
            }
            Object.keys(query).some(function (key) {
                bb = query[key];
                switch (key) {
                case '$not':
                    key = fieldName;
                    not = !not;
                    break;
                case '$or':
                    if (!Array.isArray(bb)) {
                        break;
                    }
                    dbRowDict = {};
                    bb.forEach(function (query) {
                        // recurse
                        local.dbRowListGetManyByQuery(result, query).forEach(function (dbRow) {
                            dbRowDict[dbRow._id] = dbRow;
                        });
                    });
                    result = Object.keys(dbRowDict).map(function (id) {
                        return dbRowDict[id];
                    });
                    return !result.length;
                }
                if (key[0] === '$') {
                    result = local.dbRowListGetManyByOperator(result, fieldName, key, bb, not);
                    return !result.length;
                }
                // recurse
                result = local.dbRowListGetManyByQuery(result, bb, key, not);
                return !result.length;
            });
            return result;
        };

        local.dbRowProject = function (dbRow, fieldList) {
        /*
         * this function will deepcopy and project the dbRow with the given fieldList
         */
            var result;
            if (!dbRow) {
                return null;
            }
            // handle list-case
            if (Array.isArray(dbRow)) {
                return dbRow.map(function (dbRow) {
                    // recurse
                    return local.dbRowProject(dbRow, fieldList);
                });
            }
            // normalize to list
            if (!(Array.isArray(fieldList) && fieldList.length)) {
                fieldList = Object.keys(dbRow);
            }
            result = {};
            fieldList.forEach(function (key) {
                if (key[0] !== '$') {
                    result[key] = dbRow[key];
                }
            });
            return JSON.parse(local.jsonStringifyOrdered(result));
        };

        local.dbRowSetId = function (dbRow, idIndex) {
        /*
         * this function will set a random and unique id into dbRow for the given idIndex,
         * if it does not exist
         */
            var id;
            id = dbRow[idIndex.name];
            if (typeof id !== 'number' && typeof id !== 'string') {
                do {
                    id = idIndex.isInteger
                        ? (1 + Math.random()) * 0x10000000000000
                        : 'a' + ((1 + Math.random()) * 0x10000000000000).toString(36).slice(1);
                // optimization - hasOwnProperty
                } while (idIndex.dict.hasOwnProperty(id));
                dbRow[idIndex.name] = id;
            }
            return id;
        };

        local.dbSave = function (onError) {
        /*
         * this function will save the db to storage
         */
            var onParallel;
            onParallel = local.onParallel(function (error) {
                local.setTimeoutOnError(onError, 0, error);
            });
            onParallel.counter += 1;
            Object.keys(local.dbTableDict).forEach(function (key) {
                onParallel.counter += 1;
                local.dbTableDict[key].save(onParallel);
            });
            onParallel();
        };

        local.dbTableCreateMany = function (optionsList, onError) {
        /*
         * this function will set the optionsList into the db
         */
            var onParallel, result;
            onParallel = local.onParallel(function (error) {
                local.setTimeoutOnError(onError, 0, error, result);
            });
            onParallel.counter += 1;
            result = local.normalizeValue('list', optionsList).map(function (options) {
                onParallel.counter += 1;
                return local.dbTableCreateOne(options, onParallel);
            });
            return local.setTimeoutOnError(onParallel, 0, null, result);
        };

        local.dbTableCreateOne = function (options, onError) {
        /*
         * this function will create a dbTable with the given options
         */
            var self;
            options = local.objectSetOverride(options);
            // register dbTable
            self = local.dbTableDict[options.name] =
                local.dbTableDict[options.name] || new local._DbTable(options);
            self.sortDefault = options.sortDefault ||
                self.sortDefault ||
                [{ fieldName: '_timeUpdated', isDescending: true }];
            // remove idIndex
            local.normalizeValue('list', options.idIndexRemoveList).forEach(function (idIndex) {
                self.idIndexRemove(idIndex);
            });
            // create idIndex
            local.normalizeValue('list', options.idIndexCreateList).forEach(function (idIndex) {
                self.idIndexCreate(idIndex);
            });
            // upsert dbRow
            self.crudSetManyById(options.dbRowList);
            // restore dbTable from persistent-storage
            self.isLoaded = self.isLoaded || options.isLoaded;
            if (!self.isLoaded) {
                local.storageGetItem('dbTable.' + self.name + '.json', function (error, data) {
                    // validate no error occurred
                    local.assert(!error, error);
                    if (!self.isLoaded) {
                        local.dbImport(data);
                    }
                    self.isLoaded = true;
                    local.setTimeoutOnError(onError, 0, null, self);
                });
                return self;
            }
            return local.setTimeoutOnError(onError, 0, null, self);
        };

        local.dbTableDict = {};

        local.sortCompare = function (aa, bb, ii, jj) {
        /*
         * this function will compare aa vs bb and return:
         * -1 if aa < bb
         *  0 if aa === bb
         *  1 if aa > bb
         * the priority for comparing different typeof's is:
         * null < boolean < number < string < object < undefined
         */
            var typeof1, typeof2;
            if (aa === bb) {
                return ii < jj
                    ? -1
                    : 1;
            }
            if (aa === null) {
                return -1;
            }
            if (bb === null) {
                return 1;
            }
            typeof1 = typeof aa;
            typeof2 = typeof bb;
            if (typeof1 === typeof2) {
                return typeof1 === 'object'
                    ? 0
                    : aa > bb
                    ? 1
                    : -1;
            }
            if (typeof1 === 'boolean') {
                return -1;
            }
            if (typeof2 === 'boolean') {
                return 1;
            }
            if (typeof1 === 'number') {
                return -1;
            }
            if (typeof2 === 'number') {
                return 1;
            }
            if (typeof1 === 'string') {
                return -1;
            }
            if (typeof2 === 'string') {
                return 1;
            }
            return 0;
        };
    }());
    switch (local.modeJs) {



    // run node js-env code - init-after
    /* istanbul ignore next */
    case 'node':
        // init cli
        if (module !== require.main || local.global.utility2_rollup) {
            break;
        }
        local.cliDict = {};
        local.cliDict.dbTableCrudGetManyByQuery = function () {
        /*
         * dbTable query
         * query dbRowList from dbTable
         */
            local.dbTableCreateOne({ name: process.argv[3] }, function (error, self) {
                // validate no error occurred
                local.assert(!error, error);
                console.log(JSON.stringify(self.crudGetManyByQuery(
                    JSON.parse(process.argv[4] || '{}')
                ), null, 4));
            });
        };
        local.cliDict.dbTableCrudRemoveManyByQuery = function () {
        /*
         * dbTable query
         * query and remove dbRowList from dbTable
         */
            local.dbTableCreateOne({ name: process.argv[3] }, function (error, self) {
                // validate no error occurred
                local.assert(!error, error);
                console.log(JSON.stringify(self.crudRemoveManyByQuery(
                    JSON.parse(process.argv[4])
                ), null, 4));
            });
        };
        local.cliDict.dbTableCrudSetManyById = function () {
        /*
         * dbTable dbRowList
         * set dbRowList into dbTable
         */
            local.dbTableCreateOne({ name: process.argv[3] }, function (error, self) {
                // validate no error occurred
                local.assert(!error, error);
                self.crudSetManyById(JSON.parse(process.argv[4]));
            });
        };
        local.cliDict.dbTableHeaderDictGet = function () {
        /*
         * dbTable
         * get headerDict from dbTable
         */
            local.dbTableCreateOne({ name: process.argv[3] }, function (error, self) {
                // validate no error occurred
                local.assert(!error, error);
                var tmp;
                tmp = [];
                self.idIndexList.forEach(function (idIndex) {
                    tmp.push({ isInteger: idIndex.isInteger, name: idIndex.name });
                });
                console.log(JSON.stringify({
                    idIndexList: tmp,
                    sizeLimit: self.sizeLimit,
                    sortDefault: self.sortDefault
                }, null, 4));
            });
        };
        local.cliDict.dbTableHeaderDictSet = function () {
        /*
         * dbTable
         * set headerDict into dbTable
         */
            local.dbTableCreateOne({ name: process.argv[3] }, function (error, self) {
                // validate no error occurred
                local.assert(!error, error);
                local.tmp = JSON.parse(process.argv[4]);
                self.sizeLimit = local.tmp.sizeLimit || self.sizeLimit;
                self.sortDefault = local.tmp.sortDefault || self.sortDefault;
                self.save();
                local.tmp = [];
                self.idIndexList.forEach(function (idIndex) {
                    local.tmp.push({ isInteger: idIndex.isInteger, name: idIndex.name });
                });
                local.cliDict.dbTableHeaderDictGet();
            });
        };
        local.cliDict.dbTableIdIndexCreate = function () {
        /*
         * dbTable idIndex
         * create idIndex in dbTable
         */
            local.dbTableCreateOne({ name: process.argv[3] }, function (error, self) {
                // validate no error occurred
                local.assert(!error, error);
                self.idIndexCreate(JSON.parse(process.argv[4]));
                self.save();
                local.tmp = [];
                self.idIndexList.forEach(function (idIndex) {
                    local.tmp.push({ isInteger: idIndex.isInteger, name: idIndex.name });
                });
                local.cliDict.dbTableHeaderDictGet();
            });
        };
        local.cliDict.dbTableIdIndexRemove = function () {
        /*
         * dbTable idIndex
         * remove idIndex from dbTable
         */
            local.dbTableCreateOne({ name: process.argv[3] }, function (error, self) {
                // validate no error occurred
                local.assert(!error, error);
                self.idIndexRemove(JSON.parse(process.argv[4]));
                self.save();
                local.cliDict.dbTableHeaderDictGet();
            });
        };
        local.cliDict.dbTableList = function () {
        /*
         * [none]
         * list dbTable's in db
         */
            local.storageKeys(function (error, data) {
                // validate no error occurred
                local.assert(!error, error);
                console.log(JSON.stringify(data.map(function (element) {
                    return element.split('.').slice(1, -1).join('.');
                }), null, 4));
            });
        };
        local.cliDict.dbTableRemove = function () {
        /*
         * dbTable
         * remove dbTable from db
         */
            local.storageRemoveItem('dbTable.' + process.argv[3] + '.json', function (error) {
                // validate no error occurred
                local.assert(!error, error);
                local.cliDict.dbTableList();
            });
        };
        local.cliRun();
        break;
    }
}());
