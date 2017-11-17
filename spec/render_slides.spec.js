'use strict';

const c = require('../lib/constants');
const renderSlides = require('../lib/render_slides');

describe('renderSlides()', () => {
  const layoutsMap = new Map();
  layoutsMap.set('default', '');

  const slide1Content = 'Slide 1';
  const slide1 = {
    attributes: {},
    data: {
      sections: {}
    }
  };

  const slide2Content = 'Slide 2';
  const slide2 = {
    attributes: {},
    data: {
      sections: {}
    }
  };

  const slide3Content = 'Slide 3';
  const slide3 = {
    attributes: {},
    data: {
      sections: {}
    }
  };

  const slide4Content = 'Slide 4';
  const slide4 = {
    attributes: {},
    data: {
      sections: {}
    }
  };

  const slide5Content = 'Slide 5';
  const slide5 = {
    attributes: {},
    data: {
      sections: {}
    }
  };

  const slidesMap = new Map();
  slidesMap.set('slide1', slide1);
  slidesMap.set('slide2', slide2);
  slidesMap.set('slide3', slide3);
  slidesMap.set('nested/slide4', slide4);
  slidesMap.set('nested/slide5', slide5);

  beforeEach(() => {
    slide1.data.sections.content = slide1Content;
    slide2.data.sections.content = slide2Content;
    slide3.data.sections.content = slide3Content;
    slide4.data.sections.content = slide4Content;
    slide5.data.sections.content = slide5Content;
  });

  function processTemplate(template, data) {
    return data.sections.content;
  }

  it('should return a string with the slides in the order those appear in the options.slides array', () => {
    const options = {
      slides: ['slide1', 'slide2', 'slide3']
    };

    const result = renderSlides(slidesMap, layoutsMap, processTemplate, options);

    const expected = '<p>Slide 1</p>\n<p>Slide 2</p>\n<p>Slide 3</p>\n';

    expect(result).toBe(expected);
  });

  it('should wrap nested slides into nestedSlidePrefix and nestedSlideSuffix', () => {
    const options = {
      slides: [
        'slide1', {
          slides: ['slide2', 'slide3']
        }
      ]
    };

    const result = renderSlides(slidesMap, layoutsMap, processTemplate, options);

    const expected = '<p>Slide 1</p>\n' + c.nestedSlidePrefix + '<p>Slide 2</p>\n<p>Slide 3</p>\n' + c.nestedSlideSuffix;

    expect(result).toBe(expected);
  });

  it('should accept a different nestedSlidePrefix and suffix', () => {
    const nestedSlidePrefix = '<div custom>';
    const nestedSlideSuffix = '</div>';
    const options = {
      slides: [
        'slide1', {
          slides: ['slide2', 'slide3']
        }
      ],
      nestedSlidePrefix,
      nestedSlideSuffix
    };

    const result = renderSlides(slidesMap, layoutsMap, processTemplate, options);

    const expected = '<p>Slide 1</p>\n' + nestedSlidePrefix + '<p>Slide 2</p>\n<p>Slide 3</p>\n' + nestedSlideSuffix;

    expect(result).toBe(expected);
  });

  it('should support a pwd attribute when nested slides are given with slideResolutionFullPath', () => {
    const options = {
      slides: [
        {
          pwd: 'nested',
          slides: ['slide4']
        }, {
          slides: ['nested/slide5']
        }
      ],
      slideResolutionFullPath: true
    };

    const result = renderSlides(slidesMap, layoutsMap, processTemplate, options);

    const expected = c.nestedSlidePrefix + '<p>Slide 4</p>\n' + c.nestedSlideSuffix +
        c.nestedSlidePrefix + '<p>Slide 5</p>\n' + c.nestedSlideSuffix;

    expect(result).toBe(expected);
  });

  it('should throw an exception if it fails to convert a slide', () => {
    const options = {
      slides: [
        'notAvailable'
      ]
    };

    const fn = () => {
      renderSlides(slidesMap, layoutsMap, processTemplate, options);
    };

    expect(fn).toThrowError(Error, 'Could not convert notAvailable');
  });

  it('should throw an exception if it fails to convert a nested slide', () => {
    const options = {
      slides: [
        {slides: ['notAvailableNested']}
      ]
    };

    const fn = () => {
      renderSlides(slidesMap, layoutsMap, processTemplate, options);
    };

    expect(fn).toThrowError(Error, 'Could not convert notAvailableNested');
  });
});
