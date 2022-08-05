const { POSSIBLE_SUBSTAT_ROLLS, SUBSTAT_WEIGHTING } = require("../../data/artifact-data");

// given an artifact, calculates its percentile rating -- that is, how good it
// is compared to all other possible artifacts with the given main stat.
const ratePercentile = (artifact) => {
  // this is gonna be a pain to write, isn't it
}

// for testing purposes
const seed = require("../seed/seed.json");
for (const artifact of seed) { console.log(ratePercentile(artifact)); }

module.exports = ratePercentile;