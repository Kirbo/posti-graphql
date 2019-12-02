# Posti-graphql
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [3.4.0] - 2019-12-02

### Changed
- Updated the dependencies.
- Updated Node version into 10


## [3.2.0] - 2019-05-02

### Added
- Configuration ability to defined the `limit` in queries.
- Possibility to enable logs, by launching `log=true posti-server`.
  If you need even more verbose logs, use: `log=info posti-server`.
- New type in `Addresses` query: `buildingNumber`. This will automacitally search for the building number between range:
  - `smallestBuildingNumber1`
  - `smallestBuildingNumber2`
  - `highestBuildingNumber1`
  - `highestBuildingNumber2`
  See the [example in README.md line 58](./README.md).

### Changed
- Updated `README.md`.

### Fixed
- Comments in schema.


## [3.1.3] - 2019-05-01

### Changed
- Added link to coverage in `README.md`.


## [3.1.2] - 2019-05-01

### Changed
- Updated the dependencies.

### Fixed
- Postgres test also works now.


## [3.1.1] - 2019-05-01

### Added
- Missing dependency `regenerator-runtime`.


## [3.1.0] - 2019-05-01

### Added
- Ability to use `cors`, see [example configuration](https://github.com/kirbo/posti/blob/master/posti.config.example.js#L47).

### Changed
- Updated the dependencies.


## [3.0.1] - 2019-05-01

### Fixed
- Fixing CI/CD pipeline.


## [3.0.0] - 2019-05-01

### Changed
- Updated the dependencies.


## [2.0.0] - 2018-08-29

### Changed
- Updated the dependencies.

### Breaking changes
- Had to change engine dependency from node `0.1.0` into `6.0.0`.


## [1.0.0] - 2018-08-22

### Changed
- Updated dependencies and fixed Jest config.


## [0.1.2] - 2018-03-27

### Added
- A little more documentation in [`README.md`](./README.md).


## [0.1.1] - 2018-03-27

### Changed
- Improved CI/CD pipeline.


## [0.1.0] - 2018-03-26

### Changed
- Initial release.
