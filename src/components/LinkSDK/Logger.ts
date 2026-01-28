class Logger {
  static showLogs: boolean = false;

  static info(msg: string = '', extra: string | Record<string, unknown> | unknown = ''): void {
    if (Logger.showLogs) {
      console.info('LeanSdk', msg, extra);
    }
  }

  static error(msg: string, tag: string = 'LeanSdk-Error'): void {
    if (Logger.showLogs) {
      console.error(tag, msg);
    }
  }
}

export default Logger;
