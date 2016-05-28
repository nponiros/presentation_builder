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

## API

```js
const pbuilder = require('presentation-builder');
```

You can have a look at the unit tests for more information.

### OptionsObject

Options used to configure the builder. Currently needs/supports the following properties:

* sectionSplitter: `RegExp` Optional parameter used to split the contents of a slide into sections. Default is `/---(.*)---/g`
* layoutAttributes: `Object` Optional attributes which can later be used in the templates. For example you can specify a footer text for all slides
* nestedSlidePrefix: `String` Optional parameter used as a prefix when nested slides are defined. Default is `<section>` (reveal.js)
* nestedSlideSuffix: `String` Optional parameter used as a suffix when nested slides are defined. Default is `</section>` (reveal.js)
* slides: `Array<String> | Array<Object>` An array of slide names without the extension used to define the order in which the slides are to be rendered. If an object is used then a `slides` property is expected which defines nested slides

If a slide's front matter contains a layoutAttribute property with the same name, then that takes precedence when rendering the slide

### prepareFilenameToLayoutsMap(fileReader, layouts)

* fileReader: `Object` with a `read` method which gets the a file path and returns the contents of the file as string. The `read` method should be synchronous
* layouts: `Array<String>` containing paths to the layout files

Returns a new Map with file names without extension as keys and the content of each file as values.

```js
const fileReader = {
  read(filePath) {
    return readFileFromDisc(filePath);
  }
};
const layouts = ['path/to/layout.html'];
const result = pbuilder.prepareFilenameToLayoutsMap(fileReader, layouts);
/*
 * result = Map {'layout' => 'contents'}
 */
```

### prepareFilenameToContentMap(filepaths, fileReader, options)

* filepaths: `Array<String>` containing paths to the slide files
* fileReader: `Object` with a `read` method which gets the a file path and returns the contents of the file as string. The `read` method should be synchronous
* options: `OptionsObject`

Returns a new Map with file names without extension as keys and an object with the contents of the file.

```js
const fileReader = {
  read(filePath) {
    return readFileFromDisc(filePath);
  }
};
const filepaths = ['path/to/slide1.md'];
const options = {
  slides: ['slide1']
};
const result = pbuilder.prepareFilenameToContentsMap(filepaths, fileReader, options);
/*
 * result = Map {'slide' => {
 *      attributes: front-matter attributes,
        data: contains: front-matter attributes, OptionsObject.layoutAttributes, the sections of the markdown file (not processed by markdown yet)
 *    }
 * }
 */
```

### renderSlides(options, nameToContentMap, layouts, processTemplate)

* options: `OptionsObject`
* nameToContentMap: `Map` the result from `prepareFilenameToContentMap(...)`
* layouts: `Map` the result from `prepareFilenameToLayoutsMap(...)`
* processTemplate: `function(template: String, data: Object)` which processes a given template. It is expected to by synchronous
  * The passed data is an object with a `data` property pointing to an object containing all the sections of a slide, layoutAttributes passed to the builder and front matter attributes for the slide

If a document contains no sections, then you can get its contents using the `content` attribute of the data object.
There is also a special section called **code_editor** which will be returned without markdown processing. This section is meant to be used for code which will be passed to a code editor in the slide. For this special section any newlines at the beginning of the section's contents will be stripped.

Returns an HTML string containing all the slides. This string can later be added to some index.html in order to display it.

### splitBody(body[, splitter])

* body: `String`
* splitter: `RegExp | undefined`

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

## TODO

* Externalize functions in render_slides.js
* tests
  * prepare_filename_to_content_map
  * render_slides
  * convertToMarkdown internal function
  * renderSlides internal function

## License

[MIT License](./LICENSE)
