const whois = require('whois')
const parser = require('parse-whois');
const dns = require('dns');
const { exec } = require('child_process');
const assert = require('assert');

// Domain passed as command line argument.
const domain = process.argv[2];

assert.ok(domain, 'Domain is required');
assert.ok(domain.match(/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/g), 'Invalid domain');


/*
====================================================================================================

Function to get whois data with domain and ip.

input: domain

output:
  {
    NetRange: '59.0.0.0 - 59.255.255.255',
    CIDR: '59.0.0.0/8',
    NetName: 'APNIC-59',
    OrgName: 'Asia Pacific Network Information Centre',
    'Updated Date': '1999-12-14T05:00:00Z',
    'Creation Date': '1999-12-14T17:13:10Z',
    ipAddress: '59.144.19.60'
  }

====================================================================================================
*/
const whoisLookup = function (domain) {

  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err, address, family) => {
      if (err) {
        return reject(err)
      }
      return resolve(address)
    });
  })
  .then((ip) => {
    return Promise.all([
      whoisIpLookup(ip),
      whoisDomainLookup(domain),
      Promise.resolve(ip)
    ])
  })
  .then(([ipData, domainData, ip]) => {

    ipDomainData = ipData.concat(domainData)

    //convert
    let result = {};
    for (let i=0; i<ipDomainData.length; i++) {
      result[ipDomainData[i].attribute] = ipDomainData[i].value;
    }

    //result
    console.log(Object.assign({}, result, {ipAddress: ip}))
  })
  .catch((err) => {
    console.log(err);
  })
}


/*
====================================================================================================

Function to get whois data for IP.

input: ip

output:
  {
    NetRange: '59.0.0.0 - 59.255.255.255',
    CIDR: '59.0.0.0/8',
    NetName: 'APNIC-59',
    OrgName: 'Asia Pacific Network Information Centre',
  }

====================================================================================================
*/
const whoisIpLookup = (ip) => {
  return new Promise((resolve, reject) => {

    exec(`whois ${ip}`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err);
      }

      let results = parser.parseWhoIsData(stdout);

      let obj = results.filter(function (obj) {
        return (
          obj.attribute.toLowerCase().indexOf('netrange') != -1 ||
          obj.attribute.toLowerCase().indexOf('cidr') != -1 ||
          obj.attribute.toLowerCase().indexOf('netname') != -1 ||
          obj.attribute.toLowerCase().indexOf('orgname') != -1
        );
      });

      resolve(obj);
    });
  })
}

/*
====================================================================================================

Function to get whois data for Domain.

input: domain

output:
  {
    'Updated Date': '1999-12-14T05:00:00Z',
    'Creation Date': '1999-12-14T17:13:10Z',
  }

====================================================================================================
*/
const whoisDomainLookup = (domain) => {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, function(err, data) {

      if (err) {
        return reject(err)
      }

      let results = parser.parseWhoIsData(data);

      let obj = results.filter(function (obj) {
        return (
          obj.attribute.toLowerCase().indexOf('updated date') != -1 ||
          obj.attribute.toLowerCase().indexOf('creation date') != -1
        );
      });

      return resolve(obj)
    })
  })
}

/*
====================================================================================================

Call whois Lookup utility function with domain.

====================================================================================================
*/
whoisLookup(domain);