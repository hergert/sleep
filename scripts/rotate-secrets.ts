import { randomBytes } from 'crypto';
import { execFileSync } from 'child_process';

interface Options {
  config?: string;
  env?: string;
  dryRun?: boolean;
}

function parseArgs(argv: string[]): Options {
  const options: Options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if ((arg === '--config' || arg === '-c') && i + 1 < argv.length) {
      options.config = argv[++i];
    } else if ((arg === '--env' || arg === '-e') && i + 1 < argv.length) {
      options.env = argv[++i];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else {
      console.warn(`Ignoring unknown argument: ${arg}`);
    }
  }
  return options;
}

function generateSecrets() {
  return [
    {
      name: 'AUTH_ENCRYPTION_KEY',
      value: randomBytes(32).toString('base64'),
      note: '32-byte base64 key (AES-256-GCM compatible)',
    },
    {
      name: 'AUTH_SESSION_SECRET',
      value: randomBytes(32).toString('hex'),
      note: '32-byte hex session secret',
    },
    {
      name: 'AUTH_JWT_SECRET',
      value: randomBytes(32).toString('base64'),
      note: '32-byte base64 JWT signing key',
    },
  ];
}

function putSecret(name: string, value: string, options: Options) {
  const args = ['secret', 'put', name, '--value', value];
  if (options.config) {
    args.push('--config', options.config);
  }
  if (options.env) {
    args.push('--env', options.env);
  }

  console.log(`\n> wrangler ${args.join(' ')}`);
  if (options.dryRun) {
    console.log('(dry-run) skipping command execution');
    return;
  }

  try {
    execFileSync('wrangler', args, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to update secret ${name}:`, (error as Error).message);
    process.exitCode = 1;
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const secrets = generateSecrets();

  console.log('Rotating Cloudflare Worker secrets:\n');
  secrets.forEach((secret) => {
    console.log(`- ${secret.name}: ${secret.note}`);
    console.log(`  Generated value: ${secret.value}`);
    putSecret(secret.name, secret.value, options);
  });

  if (options.dryRun) {
    console.log('\nDry run complete. No secrets were changed.');
  } else {
    console.log('\nSecret rotation finished.');
  }
}

main();
