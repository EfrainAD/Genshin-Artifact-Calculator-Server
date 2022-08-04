const { POSSIBLE_SUBSTAT_ROLLS, SUBSTAT_WEIGHTING } = require("../../data/artifact-data");
const findCombos = require("../find-combinations");

// given an artifact, calculates its power rating -- that is, how strong it is
// compared to the theoretically best artifact with the given substat types.
const ratePower = (artifact) => {
  // pull more detailed information about each substat -- most importantly, how
  // many rolls went into it
  const substats = artifact.substats.map(thisSub => {
    thisSub.amount = Number(thisSub.amount);
    thisSub.weight = SUBSTAT_WEIGHTING[thisSub.stat];
    const subRolls = findCombos(POSSIBLE_SUBSTAT_ROLLS[thisSub.stat], thisSub.amount, thisSub.stat);
    thisSub.subRolls = subRolls;
    thisSub.rollCount = Math.min(...subRolls.map(dist => dist.length));

    return thisSub;
  });

  // calculate the hypothetical maximum values of the substats that do matter,
  // thereby calculating the number of "effective" rolls (compared to the
  // hypothetical of every roll being its maximum possible value)
  substats.forEach(sub => {
    // use un-rounded values for a more accurate assessment
    sub.actualAmount = sub.subRolls[0].reduce((sum, roll) => (sum + roll), 0);
    sub.maxAmount = POSSIBLE_SUBSTAT_ROLLS[sub.stat][3] * sub.rollCount;
    sub.effectiveRolls = sub.actualAmount / sub.maxAmount * sub.rollCount;
  });

  // now, multiply the effective substats by their weightings and divide by
  // the maximum number of useful rolls to get the overall substat utilization.
  // this is a bit of an oversimplification because in some cases (ex. our
  // default weighting parameters) there aren't even four useful substats, but
  // it will do for now.
  const HYPOTHETICAL_MAX_SUBSTATS = 9;

  const substatUtilization = substats.reduce((sum, sub) => {
    return sum + sub.effectiveRolls * sub.weight;
  }, 0) / HYPOTHETICAL_MAX_SUBSTATS;

  // we can format this as a nicer number later
  return substatUtilization;
}

// for testing purposes
const seed = require("../seed/seed.json");
for (const artifact of seed) { console.log(ratePower(artifact)); }

module.exports = ratePower;