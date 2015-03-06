/**
 * Queue module.
 * this is a helper module for queueing ajax queries.
 */

(function(){
    return function (baseUrl) {
        var self = this;
        self.path = baseUrl || "#";
        self.queue = [];
        self.lastData = null;
        self.next = function (func) {
            self.queue.push(func);
            return self;
        };
        self.callback = function () {
            self.queue.shift();
            if (self.queue.length > 0) {
                _runArray(self.queue[0]);
            }
        };
        var _getParamNames = function (func) {
            var funStr = func.toString();
            var arr = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^s,]+)/g);
            return (arr == null);
        };
        var _runArray = function (func) {
            _getParamNames(func) ? func() : func(self.callback);
        };
        self.run = function () {
            if (self.queue.length > 0) {
                _runArray(self.queue[0]);
            }
        };
    };
})();