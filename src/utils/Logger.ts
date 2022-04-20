import chalk from 'chalk';

class Logger {
  info(data: unknown) {
    this.formatAndLog(chalk.cyan, data);
  }

  log(data: unknown) {
    this.formatAndLog(chalk.white, data);
  }

  error(data: unknown) {
    this.formatAndLog(chalk.red.bold, data);
  }

  private formatAndLog(format: (text: string) => string, data: unknown) {
    console.log(format(typeof data === 'string' ? data : JSON.stringify(data)));
  }
}

const logger = new Logger();

export { logger };
