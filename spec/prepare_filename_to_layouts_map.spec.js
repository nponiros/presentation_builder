const prepareFilenameToLayoutsMap = require('../lib/prepare_filename_to_layouts_map');

describe('prepareFilenameToLayout()', () => {
  it('should return a map with file name to file contents', () => {
    const filepaths = ['./path1/file1.html', './path2/file2.html'];
    const fileToContents = {
      './path1/file1.html': 'File 1 contents',
      './path2/file2.html': 'File 2 contents'
    };

    const reader = {
      read(path) {
        return fileToContents[path];
      }
    };

    const result = prepareFilenameToLayoutsMap(reader, filepaths);

    expect(result.get('file1')).toBe(fileToContents[filepaths[0]]);
    expect(result.get('file2')).toBe(fileToContents[filepaths[1]]);
  });
});
