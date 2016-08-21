# presentation-builder

> Utility methods to create HTML presentations from multiple slide files

The module is not meant to be used on its own but rather in combination with some task runner providing the file reading and template rendering functionality.
You can have a look at [grunt-presentation-builder](https://github.com/nponiros/grunt_presentation_builder) for an example usage as part of a task runner.

## Features

* Support for nested slides (Framework dependant)
* Writing slides using markdown (uses [markdown-it](https://www.npmjs.com/package/markdown-it))
* Sections in markdown files which can be positioned in different parts of a layout
* Slide files with front matter (uses [front-matter](https://www.npmjs.com/package/front-matter))
* Usage of layout files to avoid writing the layout as part of the markdown
* Special markdown section meant to be used with code editors

## Install

With npm do:

```bash
npm install presentation-builder
```

## API

```js
const pbuilder = require('presentation-builder');
```

You can have a look at the unit tests for more information.

### OptionsObject

Options used to configure the builder. Currently needs/supports the following properties:

* sectionSplitter: `RegExp?` Optional parameter used to split the contents of a slide into sections. Default is `/---(.*)---/g`
* layoutAttributes: `Object?` Optional attributes which can later be used in the templates. For example you can specify a footer text for all slides
* nestedSlidePrefix: `string?` Optional parameter used as a prefix when nested slides are defined. Default is `<section>` (reveal.js)
* nestedSlideSuffix: `string?` Optional parameter used as a suffix when nested slides are defined. Default is `</section>` (reveal.js)
* slides: `Array<string> | Array<Object>` An array of slide names without the extension used to define the order in which the slides are to be rendered. If an object is used then a `slides` property is expected which defines nested slides
* markdownRendererOptions: `Object?` Optional attributes which can be used to configure the markdown renderer. See [markdown-it](https://github.com/markdown-it/markdown-it#init-with-presets-and-options) for possible options. Currently the default preset is used and this cannot be changed 
* slideResolutionFullPath: `boolean?` Optional parameter used to change the way pbuilder matches slide names during rendering. See [Slide resolution](#slide-resolution)

If a slide's front matter contains a layoutAttribute property with the same name, then that takes precedence when rendering the slide

### prepareFilenameToLayoutsMap(layouts, readFile)

* layouts: `Array<string>` containing paths to the layout files
* readFile: `function(path: string): string` reads the contents of the file synchronously and returns the contents as string

Returns a new Map with file names without extension as keys and the content of each file as values.

```js
function readFile(filePath) {
  return readFileFromDisc(filePath);
}
const layouts = ['path/to/layout.html'];
const result = pbuilder.prepareFilenameToLayoutsMap(layouts, readFile);
/*
 * result = Map {'layout' => 'contents'}
 */
```

### prepareFilenameToContentMap(filepaths, readFile, options)

* filepaths: `Array<string>` containing paths to the slide files
* readFile: `function(path: string): string` reads the contents of the file synchronously and returns the contents as string
* options: `OptionsObject?` the only used options are `layoutAttributes` and `sectionSplitter`

Returns a new Map with file names without extension as keys and an object with the contents of the file.

```js
function readFile(filePath) {
  return readFileFromDisc(filePath);
}
const options = {
  layoutAttributes: {
    title: 'This is the title for all slides!'
  }
};
const filepaths = ['path/to/slide1.md'];
const result = pbuilder.prepareFilenameToContentsMap(filepaths, readFile, options);
/*
 * result = Map {'slide1' => {
 *      attributes: front-matter attributes,
        data: {
          contains: front-matter attributes, OptionsObject.layoutAttributes
          sections: Object with all the sections of the document, if no sections are found then it contains a content property (not markdown processed yet)
        }
 *    }
 * }
 */
```

### renderSlides(nameToContentMap, layouts, processTemplate, options)

* nameToContentMap: `Map` the result from `prepareFilenameToContentMap(...)`
* layouts: `Map` the result from `prepareFilenameToLayoutsMap(...)`
* processTemplate: `function(template: string, data: Object)` which processes a given template. It is expected to by synchronous
  * The passed data is an object containing all the sections of a slide, layoutAttributes passed to the builder and front matter attributes for the slide
  * The sections are in a property called `sections`
* options: `OptionsObject` used options are: `nestedSlidePrefix`, `nestedSlideSuffix`, `markdownRendererOptions` and `slides`. The `slides` property is mandatory

If a document contains no sections, then you can get its contents using the `content` attribute of the data.sections object.
There is also a special section called **code_editor** which will be returned without markdown processing. This section is meant to be used for code which will be passed to a code editor in the slide. For this special section the first newline at the beginning of the section's contents will be stripped.

Returns an HTML string containing all the slides. This string can later be added to some index.html in order to display it.

### splitBody(body[, splitter])

* body: `string`
* splitter: `RegExp?`

Gets a string `body` and a regular expression `splitter` and returns an object with the sections and their respective content. It is used internally but might also be useful for consumers of this module.
The `splitter` parameter is optional. If none is given `/---(.*)---/g` will be used.

```js
const body = `
---section1---
This is the first section

---section2---
This is the second section
`;
const splitter = /---(.*)---/g;
const result = pbuilder.splitBody(body, splitter);
/*
 * result = {
 *   section1: '\nThis is the first section\n\n',
 *   section2: '\nThis is the second section'
 * };
 */
```

If no match is found for the regular expression then an object will be returned with a `content` property containing the whole body.

```js
const body = 'No sections here!';
const splitter = /---(.*)---/g;
const result = pbuilder.splitBody(body, splitter);
/*
 * result = {
 *   content: 'No sections here!'
 * };
 */
```

## Slide resolution

The tool has two ways of matching the slides given in the `slides` option and the slides read from the disk in `prepareFilenameToContentMap`. The default is to strip all path information and the extension so we can just give the file name in the `slides` option. This makes it easy to define the slides to use as we don't have to type much but this way is also not very flexible. For example if multiple slides with the same name are used, then the last slide read from disk will overwrite the previous ones. With `slideResolutionFullPath` only the extension is stripped and we must give the full path to match a slide. This way we have to type more but it is also more flexible. Nested slides support the `pwd` attribute so that we don't have to give the full path for each slide (assumes that the slides are in a common folder). A slash (/) is automatically added at the end of the `pwd` path.

Example for default resolution:
```js
// Paths for prepareFilenameToContentMap
const filePaths = ['path/to/slide1.md', 'path/to/slide2.md', 'path/to/nested/slide3.md'];

// slides option
const slides = [
    'slide1',
    'slide2', {
      slides: ['slide3']
    }
];
```

Example for full path resolution:
```js
// Paths for prepareFilenameToContentMap
const filePaths = ['path/to/slide1.md', 'path/to/slide2.md', 'path/to/nested/slide3.md'];

// slides option
const slides = [
    'path/to/slide1',
    'path/to/slide2', {
      pwd: 'path/to/nested',
      slides: ['slide3']
    }
];
```

## License

[MIT License](./LICENSE)
