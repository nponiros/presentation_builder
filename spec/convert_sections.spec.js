'use strict';

const convertSections = require('../lib/convert_sections');
const c = require('../lib/constants');

describe('convertSections()', () => {
  it('should get an object with keys representing sections and convert that to HTML', () => {
    const sections = {
      section1: 'This is section 1',
      section2: 'This is section 2'
    };

    const result = convertSections(sections);

    expect(result.section1).toBe('<p>' + sections.section1 + '</p>' + c.lf);
    expect(result.section2).toBe('<p>' + sections.section2 + '</p>' + c.lf);
  });

  it('should not convert the section with name "code_editor"', () => {
    const sections = {
      section1: 'This is section 1',
      [c.codeEditorSection]: 'This is the code editor section'
    };

    const result = convertSections(sections);

    expect(result.section1).toBe('<p>' + sections.section1 + '</p>\n');
    expect(result[c.codeEditorSection]).toBe(sections[c.codeEditorSection]);
  });

  it('should strip a leading newline from the code_editor section', () => {
    const contents = 'This is the code editor section';
    const sections = {
      [c.codeEditorSection]: c.lf + contents
    };

    let result = convertSections(sections);

    expect(result[c.codeEditorSection]).toBe(contents);

    sections[c.codeEditorSection] = c.crlf + contents;

    result = convertSections(sections);

    expect(result[c.codeEditorSection]).toBe(contents);
  });
});
