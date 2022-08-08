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

  const usefulSubs = substats.filter(sub => sub.weight);
  const usefulSubCount = substats.reduce((n, sub) => (n + sub.weight), 0);
  const usefulRollCount = substats.reduce((n, sub) => (n + sub.rollCount * sub.weight), 0);

  // part 1: number of useful rolls. weight the percentile calculations based
  // on MAX_SUBSTAT_CHANCE (there's a MAX_SUBSTAT_CHANCE of having MAX_ROLLS
  // in total, and a (1 - MAX_SUBSTAT_CHANCE) of having MAX_ROLLS - 1).
  const usefulRollsPercentile = prob.binomCumBelowInc(MAX_ROLLS, usefulRollCount, (1 / NUMBER_OF_SUBSTATS) * usefulSubCount) * MAX_SUBSTAT_CHANCE + prob.binomCumBelowInc(MAX_ROLLS - 1, usefulRollCount, (1 / NUMBER_OF_SUBSTATS) * usefulSubCount) * (1 - MAX_SUBSTAT_CHANCE);

  // part 2: quality of rolls. this was somewhat tricky to pin down because each
  // roll has 4 discrete options and there can be up to 6 of them per artifact!
  // our strategy here is to take the final entry in the .subRolls array -- due
  // to the DFS strategy we employed to create it, the final entry is guaranteed
  // to be the shortest one, which will be the worst-case scenario for roll
  // quality. we then map each roll to its index in POSSIBLE_SUBSTAT_ROLLS, so
  // the worst roll will be 0, the second worst will be 1, then 2, then finally
  // 3 for the best possible roll. we'll add up all these scores to obtain an
  // overall measurement of, compared to having all the worst possible rolls,
  // how many "tiers" of rolls better our artifact is. finally, we can perform
  // the necessary probability calculations to figure out how likely it is to
  // reach that overall level of power.
  usefulSubs.forEach(thisSub => {
    const possibleRolls = POSSIBLE_SUBSTAT_ROLLS[thisSub.stat];

    thisSub.subRollQuality = thisSub.subRolls[thisSub.subRolls.length - 1]
      .map(roll => possibleRolls.indexOf(roll));
    thisSub.totalRollQuality = thisSub.subRollQuality.reduce((sum, sub) => (
      sum + sub
    ), 0);
  });

  const totalQuality = usefulSubs.reduce((sum, sub) => (sum + sub.totalRollQuality), 0);
  // + 1 here because the "base" substat roll does matter this time
  const totalRolls = usefulSubs.reduce((sum, sub) => (sum + sub.rollCount + 1), 0); 
  const NUM_POSSIBLE_ROLLS = 4;

  const rollQualityPercentile = prob.rollSumBelowInc(totalRolls, totalQuality, NUM_POSSIBLE_ROLLS);

  // part 3: number of useful substats. the part that's going to make me
  // implement a hypergeometric calculator >:(


  // part 4: finally, aggregate all the percentiles of these various areas in
  // a sensible way to arrive at a final value for the artifact's relative
  // scarcity given its power.
}

// for testing purposes
const seed = require("../seed/seed.json");
for (const artifact of seed) { console.log(ratePercentile(artifact)); }

module.exports = ratePercentile;