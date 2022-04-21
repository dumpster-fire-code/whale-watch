import chalk from 'chalk';

class Logger {
  log(data: unknown) {
    console.log(data);
  }

  info(data: unknown) {
    this.formatAndLog(chalk.cyan, data);
  }

  success(data: unknown) {
    this.formatAndLog(chalk.green, data);
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
