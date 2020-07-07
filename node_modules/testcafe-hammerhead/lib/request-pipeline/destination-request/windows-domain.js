"use strict";

exports.__esModule = true;
exports.assign = assign;

var _promisifiedFunctions = require("../../utils/promisified-functions");

let cached = null;

async function queryOSForCredential(cmd) {
  try {
    const credential = await (0, _promisifiedFunctions.exec)(cmd);
    return credential.replace(/\s/g, '');
  } catch (err) {
    return '';
  }
}

async function assign(credentials) {
  if (!cached) {
    cached = {
      domain: await queryOSForCredential('echo %userdomain%'),
      workstation: await queryOSForCredential('hostname')
    };
  }

  credentials.domain = credentials.domain || cached.domain;
  credentials.workstation = credentials.workstation || cached.workstation;
}