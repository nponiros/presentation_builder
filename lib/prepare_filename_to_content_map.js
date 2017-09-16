'use strict';

const path = require('path');
const fm = require('front-matter');

const splitBody = require('./split_body');

// slideName => { attributes (front-matter stuff), data }
function prepareFilenameToContentMap(filepaths, readFile, options) {
  options = options || {};
  return filepaths
      .map((filepath) => {
        if (options.slideResolutionFullPath) {
          const pathNoExt = filepath.substring(0, filepath.length - path.extname(filepath).length);
          return {
            name: pathNoExt,
            content: fm(readFile(filepath))
          };
        }

        return {
          name: path.basename(filepath, path.extname(filepath)),
          content: fm(readFile(filepath))
        };
      }).map((file) => {
        const data = Object.assign(
            {},
            {filename: file.name},
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
}

module.exports = prepareFilenameToContentMap;
