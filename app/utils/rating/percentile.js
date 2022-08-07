const { POSSIBLE_SUBSTAT_ROLLS, SUBSTAT_WEIGHTING } = require("../../data/artifact-data");
const getSubFreqDist = require("../substat-frequency");
const findCombos = require("../find-combinations");
const prob = require("../probability");

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

  // 4 substats per artifact, then a maximum of 5 extra rolls on top of that
  const NUMBER_OF_SUBSTATS = 4;
  const MAX_ROLLS = 5;
  // 20% chance of starting with 4 substats, otherwise start with 3 (and
  // waste a roll)
  const MAX_SUBSTAT_CHANCE = 0.2;

  const usefulSubs = substats.reduce((n, sub) => (n + sub.weight), 0);
  const usefulRolls = substats.reduce((n, sub) => (n + sub.rollCount * sub.weight), 0);

  // part 1: number of useful rolls. weight the percentile calculations based
  // on MAX_SUBSTAT_CHANCE (there's a MAX_SUBSTAT_CHANCE of having MAX_ROLLS
  // in total, and a (1 - MAX_SUBSTAT_CHANCE) of having MAX_ROLLS - 1).
  const usefulRollsPercentile = prob.binomCumBelowInc(MAX_ROLLS, usefulRolls, (1 / NUMBER_OF_SUBSTATS) * usefulSubs) * MAX_SUBSTAT_CHANCE + prob.binomCumBelowInc(MAX_ROLLS - 1, usefulRolls, (1 / NUMBER_OF_SUBSTATS) * usefulSubs) * (1 - MAX_SUBSTAT_CHANCE);

  // part 2: quality of rolls.


  // part 3: number of useful substats. the part that's going to make me
  // implement a hypergeometric calculator >:(

}

// for testing purposes
const seed = require("../seed/seed.json");
for (const artifact of seed) { console.log(ratePercentile(artifact)); }

module.exports = ratePercentile;