'use strict';

const prepareFilenameToContentMap = require('./lib/prepare_filename_to_content_map');
const prepareFilenameToLayoutsMap = require('./lib/prepare_filename_to_layouts_map');
const splitBody = require('./lib/split_body');
const renderSlides = require('./lib/render_slides');

module.exports = {
  splitBody,
  prepareFilenameToContentMap,
  prepareFilenameToLayoutsMap,
  renderSlides
};
