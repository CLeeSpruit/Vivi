## Contributing
_All contributions, suggestions, and issues are welcome!_

Check out the [Issues](https://github.com/CassandraSpruit/Vivi/issues) page. In general anything listed is up for grabs, though bugs tend to be more detailed than enhancements and might be better to pick up if starting out.

### How to Contribute
1. Fork this repository
2. Create a branch: ```git checkout -b <branch_name>
    - There's no standard for branch names, but if it's connected to an issue try starting with i(issue-number)_branch-name. Ex: i17_My-cool-branch-name
3. Make your changes and commit them: ```git commit -m '<commit_message>'```
    - It's not enforced, but please remeber to write unit tests, if applicable.
    - You can run tests by running ```npm run test```. Or if you have jest installed, you can run it for specific files.
    - Note: There seems to be a bug with running code coverage along with debugging in VS Code. You can turn off coverage in the jest.config.js file by commenting "collectCoverage: true" out or setting it to false.
4. Push to the original branch: ```git push origin https://github.com/CassandraSpruit/Vivi.git```
5. Create a [Pull Request](https://github.com/CassandraSpruit/Vivi/pulls)
