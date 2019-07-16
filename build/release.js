const readline = require('readline');
const util = require('util');
const exec = require('child_process').execFileSync;

async function ask(question) {
  const readLineFromShell = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    readLineFromShell.question(question, answer => {
      resolve(answer);
      readLineFromShell.close();
    });
  });
}

function requireNoCache(modulePath) {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
}

async function main() {
  const currentVer = require('../package.json').version;
  const inputVer = await ask(`当前版本号：${currentVer}\n\r请输入发布版本号：`);
  const versionMessage = await ask(`请输入版本信息：`);
  const isBetaVersion = /(^pre)|-/.test(inputVer);

  // upgrade version
  exec('npm', ['version', '--no-git-tag-version', inputVer]);
  const releaseVer = requireNoCache('../package.json').version;

  console.log(`正在发布 ${releaseVer} ... \n\r`);

  // build
  exec('npm', ['run', 'build'], { stdio: 'inherit' });

  // publish
  exec('npm', ['publish', '--tag', isBetaVersion ? 'beta' : 'latest'], {
    stdio: 'inherit'
  });

  // git push
  exec('git', ['add', '-A']);
  exec('git', ['commit', '-m', `release:${releaseVer}: ${versionMessage}`]);
  if (!isBetaVersion) {
    exec('git', ['tag', releaseVer]);
  }
  exec('git', ['push', '--follow-tags']);
}
try {
  main();
} catch (e) {
  console.error(e);
}
