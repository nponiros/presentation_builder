'use strict';

const c = require('./constants');
const convertSections = require('./convert_sections');

function convertSlides(slide, layouts, processTemplate, options) {
  slide.data.sections = convertSections(slide.data.sections, options);

  const layout = layouts.get(slide.attributes.layout || c.defaultLayout);
  return processTemplate(layout, slide.data);
}

module.exports = convertSlides;
