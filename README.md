[![Build Status](https://travis-ci.com/CassandraSpruit/Vivi.svg?branch=master)](https://travis-ci.com/CassandraSpruit/Vivi)
[![codecov](https://codecov.io/gh/CassandraSpruit/Vivi/branch/master/graph/badge.svg)](https://codecov.io/gh/CassandraSpruit/Vivi)
[![npm](https://img.shields.io/npm/v/@cspruit/vivi)](https://www.npmjs.com/package/@cspruit/vivi)
[![license](https://img.shields.io/github/license/CassandraSpruit/Vivi)](https://github.com/CassandraSpruit/Vivi/blob/master/LICENSE)

---

# Vivi
A lightweight component-focused Javascript framework. Vivi is currently still in it's early stages, so breaking changes are more common. This package uses semantic versioning, so major breaking changes is generally reserved for major versions.

## Installation and Gettings Started
- Install by running ```npm install --save-dev @cspruit/vivi``` in the same directory as the package.json file lives.
- Webpack is required to use Vivi's automatic template and style loading. For more detail, checkout the [Getting Started](https://github.com/CassandraSpruit/Vivi/wiki/Getting-Started) page.

## Contributing
_All contributions, suggestions, and issues are welcome!_

Check out the [Issues](https://github.com/CassandraSpruit/Vivi/issues) page. In general anything listed is up for grabs, though bugs tend to be more detailed than enhancements and might be better to pick up if starting out.

### How to Contribute
1. Fork this repository
2. Create a branch: ```git checkout -b <branch_name>```
    - There's no standard for branch names, but if it's connected to an issue try starting with i(issue-number)_branch-name. Ex: i17_My-cool-branch-name
3. Make your changes and commit them: ```git commit -m '<commit_message>'```
    - It's not enforced, but please remeber to write unit tests, if applicable.
    - You can run tests by running ```npm run test```. Or if you have jest installed, you can run it for specific files.
    - Note: There seems to be a bug with running code coverage along with debugging in VS Code. You can turn off coverage in the jest.config.js file by commenting "collectCoverage: true" out or setting it to false.
4. Push to the original branch: ```git push origin https://github.com/CassandraSpruit/Vivi.git```
5. Create a [Pull Request](https://github.com/CassandraSpruit/Vivi/pulls)

## License
This project uses [GPL 3.0](https://github.com/CassandraSpruit/Vivi/blob/master/LICENSE).
