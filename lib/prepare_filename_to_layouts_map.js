const path = require('path');

function prepareFilenameToLayoutsMap(fileReader, layouts) {
  const layoutsMap = layouts
      .map((layoutPath) => {
        return {
          name: path.basename(layoutPath, path.extname(layoutPath)),
          content: fileReader.read(layoutPath)
        };
      }).reduce((map, current) => {
        map.set(current.name, current.content);
        return map;
      }, new Map());

  return layoutsMap;
}

module.exports = prepareFilenameToLayoutsMap;
