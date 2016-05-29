'use strict';

const NESTED_SLIDE_PREFIX = '<section>';
const NESTED_SLIDE_SUFFIX = '</section>';

const CODE_EDITOR_SECTION = 'code_editor';

const LF = '\n';
const CRLF = '\r\n';

const DEFAULT_LAYOUT = 'default';

const SECTION_REGEXP = /---(.*)---/g;

module.exports = {
  nestedSlidePrefix: NESTED_SLIDE_PREFIX,
  nestedSlideSuffix: NESTED_SLIDE_SUFFIX,
  codeEditorSection: CODE_EDITOR_SECTION,
  lf: LF,
  crlf: CRLF,
  defaultLayout: DEFAULT_LAYOUT,
  sectionRegExp: SECTION_REGEXP
};
