#!/usr/bin/env node
import https from 'node:https';
import querystring from 'node:querystring';

const REMOTE_ADDRESS = '123.123.219.80';
const HOSTNAME = 'fanyi.youdao.com';
const PATH = '/openapi.do';
const PARAMS = {
  keyfrom: 'vimvim',
  key: '816393792',
  type: 'data',
  doctype: 'json',
  version: '1.1',
};

const translate = (str = '') =>
  new Promise((resolve, reject) => {
    const req = https.request({
      hostname: REMOTE_ADDRESS,
      method: 'GET',
      path: `${PATH}?${querystring.stringify({
        ...PARAMS,
        q: str,
      })}`,
      headers: {
        host: HOSTNAME,
      },
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks))));
      res.on('error', reject);
    });
    req.end();
  });

translate(process.argv[2])
  .then((ret) => ret && ret.basic && ret.basic.explains)
  .then((ret) => {
    const line = '##################################\n';
    process.stdout.write(line);
    if (Array.isArray(ret)) {
      ret.forEach(item => {
        process.stdout.write(`# ${item}\n`);
      });
    }
    process.stdout.write(line);
  });
