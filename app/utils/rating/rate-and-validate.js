// largely a wrapper for the rating functionality, but also contains some useful
// error/sanity-checking functionalities

const ratePercentile = require("./percentile");
const ratePower = require("./power");
const findCombos = require("../find-combinations.js");
const { POSSIBLE_SUBSTAT_ROLLS } = require("../../data/artifact-data.js");

const rateAndValidate = (artifact) => {
  const error = {error: true};

  // only rate level 20 artifacts, for computational simplicity (read: for my
  // own sanity)
  if (artifact.level !== 20) {
    error.messageName = "rateLevelFailure";
    return error;
  }

  // fail if any substat is impossible (ie. no combination of rolls could result
  // in that value)
  for (const sub of artifact.substats) {
    const subRolls = findCombos(POSSIBLE_SUBSTAT_ROLLS[sub.stat], sub.amount, sub.stat);

    if (!subRolls.length) {
      error.messageName = "rateSubstatAmountFailure";
      return error;
    }
  }

  const ratings = ratePercentile(artifact);
  ratings.push(ratePower(artifact));
  
  return ratings;
}

module.exports = rateAndValidate;