function executeGeneratorFn(genFn, callback) {
    var iterator = genFn();

    function execute(nextValue) {
        if (!nextValue.done) {
            nextValue.value(next);
        } else {
            callback instanceof Function && callback(null, nextValue.value);
        }
    }

    function next() {
        try {
            execute(iterator.next(arguments));
        } catch (e) {
            callback instanceof Function && callback(e);
        }
    }

    next();
}

exports.executeGeneratorFn = executeGeneratorFn;