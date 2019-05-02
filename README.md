# POSTI-GRAPHQL

![pipeline status](https://posti-graphql.devaus.eu/pipeline.svg)
[![coverage report](https://posti-graphql.devaus.eu/coverage.svg)](https://posti-graphql.devaus.eu/coverage)
![latest version](https://img.shields.io/github/package-json/v/kirbo/posti-graphql.svg)
![last commit](https://img.shields.io/github/last-commit/kirbo/posti-graphql.svg)
![total downloads](https://img.shields.io/npm/dt/posti-graphql.svg)
![dependencies](https://img.shields.io/librariesio/github/kirbo/posti-graphql.svg)

## Description

`posti-graphql` extends [`posti`](https://www.npmjs.com/package/posti) by adding a GraphQL-server on top of it.

## Changelog

Check changes [here](./CHANGELOG.md).


## Installation

1. Install `posti`, [follow instructions here](https://github.com/kirbo/posti#installation-as-a-dependency-for-your-project).
2. Install `posti-graphql`
   ```
   yarn add posti-graphql
   ```
3. Create `npm` script for starting GraphQL server, in your `package.json`:
   ```
   "scripts": {
     "start-server": "posti-server"
   }
   ```
4. Start GraphQL server:
   ```
   yarn start-server
   ```
5. Play around, either in http://localhost:3000/graphql


## Demo
  Demo playground can be found [here](https://posti-graphql.demo.devaus.eu/graphql).

### Demo limitations
  - Maximum `50` requests per IP-address, within `30` minutes.
  - First `10` requests have 0 delay.
  - Maximum delay per request `30` seconds.
  - Every request after the `10th` request will delay for additional `2.5` seconds, until `30` seconds of delay, i.e.:
    - `11th` request = 2.5sec
    - `12th` request = 5sec
    - `13th` request = 7.5sec
    - `20th` request = 25sec
    - `22nd` request = 30sec
    - `50th` request = 30sec
    - `51st` request = error message that the maximum requests has been exceeded.
  - Default `limit` for queries is `10`.
  - Maximum allowed `limit` for queries is `50`.

### PRO-TIP
- Press `CTRL + Space` or `ALT + Space` in the Playground to open the autocomplete menu.
- Click the Green `Schema` button in the right corner to open the GraphQL schema.

### Examples to query

#### Addresses

##### Search all the addresses beginning with "mannerheimin" and that has building number 15
```
{
  Addresses (where: {
    address: "mannerheimin%"
    buildingNumber: 15
  }) {
    address
    postOfficeName
    municipalityName
    postalCode
    oddEven
    smallestBuildingNumber1
    smallestDeliveryLetter1
    smallestBuildingNumber2
    smallestDeliveryLetter2
    highestBuildingNumber1
    highestDeliveryLetter1
    highestBuildingNumber2
    highestDeliveryLetter2
  }
}
```

#####  Search all the addresses in postal code "00100" that has building number 2
```
{
  Addresses (where: {
    postalCode: "00100"
    buildingNumber: 2
  }) {
    address
    municipalityName
    postalCode
    smallestBuildingNumber1
    highestBuildingNumber1
  }
}
```

#####  Search all the addresses for "turuntie" and limit for 5 matches
```
{
  Addresses (where: {
    address: "turuntie"
  }, limit: 5) {
    address
    municipalityName
    postalCode
    smallestBuildingNumber1
    highestBuildingNumber1
  }
}
```

#### PostalCodes

##### Search all the postal codes beginning with `0010*`
```
{
  PostalCodes (where: {
    postalCode: "0010%"
  }) {
    postalCode
    postOfficeName
    entryIntoForceAt
    typeCode
    regionName
    municipalityName
    municipalityLanguage
  }
}
```

#### PostalCodeChanges

#####  Search all the renamed post offices from the changes
```
{
  PostalCodeChanges (where: {
    eventCode: 1
  }) {
    updatedAt
    oldPostalCode
    oldPostOfficeName
    postalCode
    postOfficeName
    municipalityName
    eventCode
  }
}
```

#####  Search all the closed post offices from the changes
```
{
  PostalCodeChanges (where: {
    eventCode: 2
  }) {
    updatedAt
    oldPostalCode
    oldPostOfficeName
    postalCode
    postOfficeName
    municipalityName
    eventCode
  }
}
```

#####  Search all the new post offices from the changes
```
{
  PostalCodeChanges (where: {
    eventCode: 3
  }) {
    updatedAt
    oldPostalCode
    oldPostOfficeName
    postalCode
    postOfficeName
    municipalityName
    eventCode
  }
}
```





### Links
  - [Coverage report](https://posti-graphql.devaus.eu/coverage)
  - [GraphQL Playground](https://posti-graphql.demo.devaus.eu/graphql)


## Disclaimer

I am not in any way affiliated with nor do I represent anything from [Finnish post - Posti](https://www.posti.fi/).


## License

MIT License

Copyright (c) 2018 Kimmo Saari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
