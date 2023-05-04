class Logger {
  static showLogs = false;

  static info(msg = '', extra = '') {
    if (Logger.showLogs) {
      console.info('LeanSdk', msg, extra);
    }
  }

  static error(msg, tag = 'LeanSdk-Error') {
    if (Logger.showLogs) {
      console.error(tag, msg);
    }
  }
}

export default Logger;
