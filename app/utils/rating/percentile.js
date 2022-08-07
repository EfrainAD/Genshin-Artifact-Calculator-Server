const { POSSIBLE_SUBSTAT_ROLLS, SUBSTAT_WEIGHTING } = require("../../data/artifact-data");
const getSubFreqDist = require("../substat-frequency");
const findCombos = require("../find-combinations");

// given an artifact, calculates its percentile rating -- that is, how good it
// is compared to all other possible artifacts with the given main stat.
const ratePercentile = (artifact) => {
  // pull more detailed information about each substat -- most importantly, how
  // many rolls went into it and the probability of its existence
  const subFreqDist = getSubFreqDist(artifact);
  const substats = artifact.substats.map(thisSub => {
    thisSub.amount = Number(thisSub.amount);
    thisSub.weight = SUBSTAT_WEIGHTING[thisSub.stat];

    const subRolls = findCombos(POSSIBLE_SUBSTAT_ROLLS[thisSub.stat], thisSub.amount, thisSub.stat);
    thisSub.subRolls = subRolls;
    // this is calculated slightly differently here than it is in power.js;
    // the probability calculation here takes different values into account
    thisSub.rollCount = Math.min(...subRolls.map(dist => dist.length)) - 1;

    thisSub.prob = subFreqDist[thisSub.stat];

    return thisSub;
  });

  const usefulRolls = substats.reduce((n, sub) => (n + sub.rollCount * sub.weight), 0);

  // DO NOT use the number of rolls -- that will always be 5, so the combinatorics
  // and probability calculation on that will be straightforward.
  // instead, the question should be "how many useful substats are there,
  // considering the weights and the main stats?"

  console.log(usefulRolls)
}

// for testing purposes
const seed = require("../seed/seed.json");
for (const artifact of seed) { console.log(ratePercentile(artifact)); }

module.exports = ratePercentile;