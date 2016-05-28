'use strict';

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const NESTED_SLIDE_PREFIX = '<section>';
const NESTED_SLIDE_SUFFIX = '</section>';

// TODO: externalize
function convertToMarkdown(data) {
  const keys = Object.keys(data);
  keys.forEach((key) => {
    if (key !== 'code_editor') {
      data[key] = md.render(data[key]);
    } else {
      if (data[key].indexOf('\n') === 0) {
        data[key] = data[key].substring(1);
      } else if (data[key].indexOf('\r\n') === 0) {
        data[key] = data[key].substring(3);
      }
    }
  });
  return data;
}

// TODO: externalize (needs renaming first)
function renderSlides(slideName, nameToContentMap, layouts, processTemplate) {
  const slide = nameToContentMap.get(slideName);
  let slideTemplate = '';

  const data = Object.assign(slide.data, convertToMarkdown(slide.data.sections));

  if (slide.attributes.layout && slide.attributes.layout !== 'default') {
    const layout = layouts.get(slide.attributes.layout);
    // Only convert sections to markdown -> front matter stuff should stay as is
    slideTemplate += processTemplate(layout, {data});
  } else {
    const layout = layouts.get('default');
    slideTemplate += processTemplate(layout, {data});
  }

  return slideTemplate;
}

function getSlides(options, nameToContentMap, layouts, processTemplate) {
  const slides = options.slides;
  const nestedSlidePrefix = options.nestedSlidePrefix || NESTED_SLIDE_PREFIX;
  const nestedSlideSuffix = options.nestedSlideSuffix || NESTED_SLIDE_SUFFIX;

  const renderedSlides = slides.map((slide) => {
    if (typeof slide === 'object') {
      // Nested slide
      const contents = slide.slides.map((subslide) => {
        return renderSlides(subslide, nameToContentMap, layouts, processTemplate);
      }).join('');

      return nestedSlidePrefix + contents + nestedSlideSuffix;
    } else {
      return renderSlides(slide, nameToContentMap, layouts, processTemplate);
    }
  });
  return renderedSlides.join('');
}

module.exports = getSlides;
