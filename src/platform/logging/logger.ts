type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogFields {
  [key: string]: unknown;
}

const LEVEL_LABEL: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
};

function formatMessage(tag: string, level: LogLevel, message: string, fields?: LogFields) {
  const base = `[${LEVEL_LABEL[level]}] [${tag}] ${message}`;
  if (!fields || Object.keys(fields).length === 0) {
    return base;
  }
  const serialized = JSON.stringify(fields, (_key, value) => {
    if (value instanceof Error) {
      return { message: value.message, stack: value.stack };
    }
    return value;
  });
  return `${base} ${serialized}`;
}

export function createLogger(tag: string) {
  const log = (level: LogLevel, message: string, fields?: LogFields, error?: unknown) => {
    const mergedFields = { ...fields };
    if (error instanceof Error) {
      mergedFields.error = { message: error.message, stack: error.stack };
    } else if (error) {
      mergedFields.error = error;
    }

    const formatted = formatMessage(tag, level, message, mergedFields);

    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }
  };

  return {
    debug: (message: string, fields?: LogFields) => log('debug', message, fields),
    info: (message: string, fields?: LogFields) => log('info', message, fields),
    warn: (message: string, fields?: LogFields) => log('warn', message, fields),
    error: (message: string, fields?: LogFields, error?: unknown) => log('error', message, fields, error),
  };
}
