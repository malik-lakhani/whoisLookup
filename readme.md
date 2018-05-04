# Whois Lookup Utility

## Prerequisites
* [Node.js >= 8.10.0/NPM](http://nodejs.org/download/)

## Setup

Clone project

```
http://192.168.1.5:10080/malik_lakhani/whoisLookup.git
```


Install Dependencies

```
npm install
```

Run Whois Lookup Utility

```
node whois.js {Domain}
```

ex.

```
node whois.js improwised.com
```

Output: 

```
{ 
  NetRange: '59.0.0.0 - 59.255.255.255',
  CIDR: '59.0.0.0/8',
  NetName: 'APNIC-59',
  OrgName: 'Asia Pacific Network Information Centre',
  'Updated Date': '1999-12-14T05:00:00Z',
  'Creation Date': '1999-12-14T17:13:10Z',
  ipAddress: '59.144.19.60' 
}
  
```