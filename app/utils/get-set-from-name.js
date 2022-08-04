const { ARTIFACT_SETS } = require("../data/artifact-data.js");

// takes in the name of an artifact and returns the set that it belongs to
const getSetFromName = (name, slot) => {
  // search the master list of artifact sets by slot until a matching name
  // is found, and return the matching set. if no matching set was found,
  // return false.
  const matchingSet = ARTIFACT_SETS.filter(set => {
    return (set[slot] === name);
  })[0];

  return (matchingSet ? matchingSet.name : false);
}

module.exports = { getSetFromName };