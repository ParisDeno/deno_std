// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.

var assert = require('assert');
var path   = require('path');
var fs     = require('fs');
var Mark   = require('../../lib/js-yaml/mark');


test('Mark', function () {
  var filepath = path.join(__dirname, 'mark.txt'),
      filedata = fs.readFileSync(filepath, 'utf8');

  filedata.split('---\n').slice(1).forEach(function (input) {
    var index = 0, line = 0, column = 0,
        mark, snippet, data, pointer, temp;

    assert(input.indexOf('*') >= 0);

    while (input[index] !== '*') {
      if (input[index] === '\n') {
        line += 1;
        column = 0;
      } else {
        column += 1;
      }
      index += 1;
    }

    mark = new Mark(filepath, input, index, line, column);
    snippet = mark.getSnippet(2, 79);

    assert(typeof snippet, 'string');

    temp = snippet.split('\n');
    assert.strictEqual(temp.length, 2);

    data = temp[0];
    pointer = temp[1];

    assert(data.length < 82);
    assert.strictEqual(data[pointer.length - 1], '*');
  });
});