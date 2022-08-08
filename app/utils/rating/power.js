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

  // the "perfect" artifact has nine different substat rolls -- four of them
  // go into generating the initial substats, and the other five add on to the
  // existing substats. in general, characters do not have four different
  // substats that are all useful, so we'll have to account for that when doing
  // our assessment. we'll use the substat weighting to figure out how many
  // useful substats there are, so that the final calculation will have
  // (4 - useful substats) rolls of leeway for the inaccessible rolls.
  const HYPOTHETICAL_MAX_ROLLS = 9;
  const NUMBER_OF_SUBSTATS = 4;
  const usefulSubstats = substats.reduce((sum, sub) => (sum + sub.weight), 0);

  const inaccessibleRolls = NUMBER_OF_SUBSTATS - usefulSubstats;
  const totalEffRolls = substats.reduce((sum, sub) => {
    // multiply by sub.weight to remove substats that are not considered useful
    return sum + sub.effectiveRolls * sub.weight;
  }, 0);

  const substatUtilization = totalEffRolls / (HYPOTHETICAL_MAX_ROLLS - inaccessibleRolls);

  // we can format this as a nicer number later
  return substatUtilization;
}

// for testing purposes
const seed = require("../seed/seed.json");
for (const artifact of seed) { console.log(ratePower(artifact)); }

module.exports = ratePower;