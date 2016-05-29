'use strict';

const convertSlides = require('../lib/convert_slides');

describe('convertSlides()', () => {
  const layoutsMap = new Map();
  layoutsMap.set('layout1', '<layout1>');
  layoutsMap.set('default', '<default>');

  function processTemplate(template, data) {
    return template + JSON.stringify(data.sections);
  }

  it('should return the given slide as string and as part of the given layout', () => {
    const slide = {
      attributes: {
        layout: 'layout1'
      },
      data: {
        sections: {
          section1: 'Data for section 1'
        }
      }
    };

    const result = convertSlides(slide, layoutsMap, processTemplate);

    expect(typeof result).toBe('string');
    expect(result.indexOf('layout1')).not.toBe(-1);
    expect(result.indexOf('<p>Data for section 1</p>')).not.toBe(-1);
  });

  it('should use the default layout if no layout is specified', () => {
    const slide = {
      attributes: {},
      data: {
        sections: {
          section1: 'Data for section 1'
        }
      }
    };

    const result = convertSlides(slide, layoutsMap, processTemplate);

    expect(result.indexOf('default')).not.toBe(-1);
  });
});
