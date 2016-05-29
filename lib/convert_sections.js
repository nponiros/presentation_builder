'use strict';

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const c = require('./constants');

function convertCodeEditorSection(contents) {
  if (contents.indexOf(c.lf) === 0) {
    return contents.substring(1);
  } else if (contents.indexOf(c.crlf) === 0) {
    return contents.substring(2);
  } else {
    return contents;
  }
}

function convertSections(sections) {
  const sectionNames = Object.keys(sections);
  const convertedSections = {};
  sectionNames.forEach((sectionName) => {
    if (sectionName !== c.codeEditorSection) {
      convertedSections[sectionName] = md.render(sections[sectionName]);
    } else {
      convertedSections[sectionName] = convertCodeEditorSection(sections[sectionName]);
    }
  });
  return convertedSections;
}

module.exports = convertSections;
