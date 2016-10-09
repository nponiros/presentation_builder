'use strict';

const c = require('./constants');
const convertSlides = require('./convert_slides');

function renderSLides(nameToContentMap, layouts, processTemplate, options) {
  const slides = options.slides;
  const nestedSlidePrefix = options.nestedSlidePrefix || c.nestedSlidePrefix;
  const nestedSlideSuffix = options.nestedSlideSuffix || c.nestedSlideSuffix;

  const renderedSlides = slides.map((slideName) => {
    // Nested slide
    if (typeof slideName === 'object') {
      let pwd = '';
      if (options.slideResolutionFullPath && slideName.pwd) {
        pwd = slideName.pwd + '/';
      }
      const contents = slideName.slides.map((subslideName) => {
        return convertSlides(nameToContentMap.get(`${pwd}${subslideName}`), layouts, processTemplate, options.markdownRendererOptions);
      }).join('');

      return nestedSlidePrefix + contents + nestedSlideSuffix;
    } else {
      return convertSlides(nameToContentMap.get(slideName), layouts, processTemplate, options.markdownRendererOptions);
    }
  });
  return renderedSlides.join('');
}

module.exports = renderSLides;
