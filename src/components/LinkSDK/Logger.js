class Logger {
  static showLogs = false;

  static info(msg: String) {
    if (Logger.showLogs) {
      console.info('LeanSdk', msg);
    }
  }

  static error(msg, tag = 'LeanSdk-Error') {
    if (Logger.showLogs) {
      console.error(tag, msg);
    }
  }
}

export default Logger;
