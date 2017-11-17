# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-11-17

* Breaking: If a slide cannot be converted (usually because the slide cannot be found) we throw an exception "Could not convert ${subslideName}" for normal slides and Could not convert ${pwd}${subslideName} for nested slides
* Breaking: Update front-matter to 2.3.0, the front-matter separators must be at start of line otherwise those won't be recognized as front-matter separators
* Breaking: Update markdown-it to 8.4.0, this is a major version update and might break things

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
