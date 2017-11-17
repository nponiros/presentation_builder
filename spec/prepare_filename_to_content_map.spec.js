'use strict';

const commonTags = require('common-tags');

const prepareFilenameToContentMap = require('../lib/prepare_filename_to_content_map');

describe('prepareFilenameToContentMap()', () => {
  it('should return a map with file name to file contents', () => {
    const filepaths = ['./path1/slide1.md', './path2/slide2.md'];
    const fileToContents = {
      './path1/slide1.md': 'Slide 1 contents',
      './path2/slide2.md': 'Slide 2 contents'
    };

    function read(path) {
      return fileToContents[path];
    }

    const result = prepareFilenameToContentMap(filepaths, read);

    expect(result.get('slide1')).not.toBeUndefined();
    expect(result.get('slide2')).not.toBeUndefined();
  });

  it('should keep the given path in case slideResolutionFullPath is given as option', () => {
    const filepaths = ['./path1/slide1.md', './path2/slide2.md'];
    const fileToContents = {
      './path1/slide1.md': 'Slide 1 contents',
      './path2/slide2.md': 'Slide 2 contents'
    };
    const options = {
      slideResolutionFullPath: true
    };

    function read(path) {
      return fileToContents[path];
    }

    const result = prepareFilenameToContentMap(filepaths, read, options);

    expect(result.get('./path1/slide1')).not.toBeUndefined();
    expect(result.get('./path2/slide2')).not.toBeUndefined();
  });

  it('should return an object with a data and an attribute property as contents', () => {
    const filepaths = ['./path1/slide1.md', './path2/slide2.md'];
    const fileToContents = {
      './path1/slide1.md': 'Slide 1 contents',
      './path2/slide2.md': 'Slide 2 contents'
    };

    function read(path) {
      return fileToContents[path];
    }

    const result = prepareFilenameToContentMap(filepaths, read);

    // We have no sections, front matter or options.layoutAttributes -> data only has a section with content
    expect(result.get('slide1').data).toEqual({filename: 'slide1', sections: {content: 'Slide 1 contents'}});
    // We have no front matter -> empty attributes
    expect(result.get('slide1').attributes).toEqual({});
    expect(result.get('slide2').data).toEqual({filename: 'slide2', sections: {content: 'Slide 2 contents'}});
    expect(result.get('slide2').attributes).toEqual({});
  });

  it('should contain front matter attributes in the data and attributes properties', () => {
    const filepaths = ['./path1/slide1.md', './path2/slide2.md'];
    const slide1Contents = commonTags.stripIndents`---
        title: Slide 1
        ---

        Contents of slide 1`;

    const slide2Contents = commonTags.stripIndents`---
        title: Slide 2
        ---

        Contents of slide 2`;

    const fileToContents = {
      './path1/slide1.md': slide1Contents,
      './path2/slide2.md': slide2Contents
    };

    function read(path) {
      return fileToContents[path];
    }

    const result = prepareFilenameToContentMap(filepaths, read);

    expect(result.get('slide1').data.title).toEqual('Slide 1');
    expect(result.get('slide1').attributes).toEqual({title: 'Slide 1'});
    expect(result.get('slide2').data.title).toEqual('Slide 2');
    expect(result.get('slide2').attributes).toEqual({title: 'Slide 2'});
  });

  it('should override attributes in options.layoutAttributes which have the same name as attributes in the front matter (only in the data property)', () => {
    const filepaths = ['./path1/slide1.md', './path2/slide2.md'];
    const slide1Contents = commonTags.stripIndents`---
        slideTitle: Slide 1
        ---

        Contents of slide 1`;

    const slide2Contents = commonTags.stripIndents`---
        title: Slide 2
        ---

        Contents of slide 2`;

    const fileToContents = {
      './path1/slide1.md': slide1Contents,
      './path2/slide2.md': slide2Contents
    };
    const options = {
      layoutAttributes: {
        title: 'Title for all slides'
      }
    };

    function read(path) {
      return fileToContents[path];
    }

    const result = prepareFilenameToContentMap(filepaths, read, options);

    expect(result.get('slide1').data.title).toEqual('Title for all slides');
    expect(result.get('slide1').data.slideTitle).toEqual('Slide 1');
    expect(result.get('slide1').attributes).toEqual({slideTitle: 'Slide 1'});
    expect(result.get('slide2').data.title).toEqual('Slide 2');
    expect(result.get('slide2').attributes).toEqual({title: 'Slide 2'});
  });

  it('should have a sections property in the data with all slide sections', () => {
    const filepaths = ['./path1/slide1.md'];
    const slide1Contents = commonTags.stripIndents`---
        title: Slide 1
        ---

        ---section1---
        Contents of slide 1 section 1
        
        ---section2---
        Contents of slide 1 section 2
        
        `;

    const fileToContents = {
      './path1/slide1.md': slide1Contents
    };

    function read(path) {
      return fileToContents[path];
    }

    const result = prepareFilenameToContentMap(filepaths, read);

    expect(result.get('slide1').data.sections.section1).toBe('\nContents of slide 1 section 1\n\n');
    expect(result.get('slide1').data.sections.section2).toBe('\nContents of slide 1 section 2');
  });
});
