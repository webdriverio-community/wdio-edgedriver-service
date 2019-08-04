exports.path = 'MicrosoftWebDriver.exe';
exports.start = function(args) {
  exports.defaultInstance = require('child_process').execFile(exports.path, args);
  return exports.defaultInstance;
};
exports.stop = function () {
  if (exports.defaultInstance !== null){
    exports.defaultInstance.kill();
  }
};

