# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2017-09-16

* Add `filename` property to the result of prepareFilenameToContentMap as part of the data property

## [1.1.0] - 2016-08-21

* Update dependencies and devDependencies
* Add new property to OptionsObject named markdownRendererOptions used to configure markdown-it
* Add new property to OptionsObject named slideResolutionFullPath. This option changes the way slides read from disk match to slides given in the slides option. For more details the the slides resolution section of the readme

## [1.0.1] - 2016-07-30

* Fix bug in body splitter. If the word 'undefined' was part of a previous section then the latter sections were broken.
* Add test for this.

## [1.0.0] - 2016-05-29

* Initial release
