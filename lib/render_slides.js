'use strict';

const c = require('./constants');
const convertSlides = require('./convert_slides');

function renderSLides(nameToContentMap, layouts, processTemplate, options) {
  const slides = options.slides;
  const nestedSlidePrefix = options.nestedSlidePrefix || c.nestedSlidePrefix;
  const nestedSlideSuffix = options.nestedSlideSuffix || c.nestedSlideSuffix;

  const renderedSlides = slides.map((slideName) => {
    if (typeof slideName === 'object') {
      // Nested slide
      const contents = slideName.slides.map((subslideName) => {
        return convertSlides(nameToContentMap.get(subslideName), layouts, processTemplate);
      }).join('');

      return nestedSlidePrefix + contents + nestedSlideSuffix;
    } else {
      return convertSlides(nameToContentMap.get(slideName), layouts, processTemplate, options.markdownRendererOptions);
    }
  });
  return renderedSlides.join('');
}

module.exports = renderSLides;
