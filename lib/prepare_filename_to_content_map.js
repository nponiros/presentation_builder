'use strict';

const path = require('path');
const fm = require('front-matter');

const splitBody = require('./split_body');

// slideName => { attributes (front-matter stuff), data }
function prepareFilenameToContentMap(filepaths, readFile, options) {
  options = options || {};
  const filenameToContentMap = filepaths
      .map((filepath) => {
        return {
          name: path.basename(filepath, path.extname(filepath)),
          content: fm(readFile(filepath))
        };
      }).map((file) => {
        const data = Object.assign(
            {},
            options.layoutAttributes, {
              sections: splitBody(file.content.body, options.sectionSplitter)
            },
            file.content.attributes
        );
        return {
          name: file.name,
          content: {
            attributes: file.content.attributes,
            data
          }
        };
      }).reduce((map, current) => {
        map.set(current.name, current.content);
        return map;
      }, new Map());

  return filenameToContentMap;
}

module.exports = prepareFilenameToContentMap;
