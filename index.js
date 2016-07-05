#!/usr/bin/env node
import http from 'http';
import querystring from 'querystring';

const HOST = 'fanyi.youdao.com';
const PATH = '/openapi.do';
const PARAMS = {
  keyfrom: 'vimvim',
  key: '816393792',
  type: 'data',
  doctype: 'json',
  version: '1.1',
};

function translate(str = '') {
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'GET',
      hostname: HOST,
      path: `${PATH}?${querystring.stringify(PARAMS)}&q=${encodeURIComponent(str)}`,
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));

      res.on('end', () => resolve(Buffer.concat(chunks)));

      res.on('error', reject);
    });
    req.end();
  });
}

function parse(str) {
  let result = [];
  try {
    const data = JSON.parse(str.toString('utf-8'));
    if (data.basic && Array.isArray(data.basic.explains)) {
      result = [...data.basic.explains];
    }
  } catch (e) {} // eslint-disable-line
  return result;
}

function print(data) {
  console.log('##################################');
  data.forEach(item => {
    console.log(`# ${item}`);
  });
  console.log('##################################');
}


translate(process.argv[2])
  .then((response) => {
    print(parse(response));
  });

