/**
 * @param {string} searchStr
 * @param {string} str
 */
function searchStringOccurences(searchStr, str) {
  const chMap = createCharacterMap(searchStr);
  const searchStrLength = searchStr.length;
  if (searchStrLength > str.length) {
    return [];
  }
  let startIndex = 0;
  let compareOffset = 0;
  let occurences = [];
  while (startIndex + searchStrLength <= str.length) {
    let strEndIndex = startIndex + searchStrLength - 1 - compareOffset;
    let searchStrEndIndex = searchStrLength - 1 - compareOffset;
    // compare the last character of the pattern and search string
    if (str[strEndIndex] !== searchStr[searchStrEndIndex]) {
      // move the pattern to the common character between string and search string
      startIndex =
        strEndIndex - chMap.firstIndexOf(searchStr[searchStrEndIndex]);
      compareOffset = 0;
      continue;
    }
    // the search string is match
    if (++compareOffset === searchStrLength.length) {
      occurences.push(startIndex);
      startIndex += searchStrLength;
      compareOffset = 0;
    }
  }

  return occurences;
}

function createCharacterMap(str) {
  const chMap = {
    map: {},
    /**
     * @param {string} ch
     * @returns {number}
     */
    firstIndexOf(ch) {
      return this.map[ch][0];
    },
    /**
     * @param {string} ch
     * @returns {number}
     */
    lastIndexOf(ch) {
      return this.map[ch][this.map[ch].length - 1];
    },
    addCh(ch, index) {
      if (!this.map[ch]) this.map[ch] = [];
      this.map[ch].push(index);
    },
  };

  for (let index = 0; index < str.length; index++) {
    chMap.addCh(str[index], index);
  }
  return chMap;
}
