// per https://genshin-impact.fandom.com/wiki/Artifacts/Distribution, we can
// infer the following weights for substat frequency:
//
//  - flat Atk, flat Def, flat HP: each has a weight of 6
//  - Atk%, Def%, HP%, ER, EM: each has a weight of 4
//  - critRate, critDmg: each has a weight of 3
//
// an artifact cannot roll its main stat as its substat. so, for a flower (which
// is guaranteed to have a flat HP main stat), the weights will be as follows:
//
//    - flat Atk  (6)
//    - flat Def  (6)
//    - flat HP   (0) <- excluded due to being the main stat
//    - Atk%      (4)
//    - Def%      (4)
//    - HP%       (4)
//    - ER        (4)
//    - EM        (4)
//    - critRate  (3)
//    - critDmg   (3)
//    ---------------
//      TOTAL     38
//
// for this artifact, the chance to have crit rate as a substat is 3/38
// (~7.89%); the chance to have flat Def as a substat is 6/38 (~15.79%), etc. 
// the odds of having any specific substat can be calculated similarly. this
// gives us a comparatively smooth way of determining the probability of an
// artifact having any combination of substats.
//
// (note that the above is only about WHICH substats an artifact has, and *NOT*
// about the rolls or how good the rolls are. once an artifact has 4 substats,
// each one has an even 25% chance of being upgraded on every roll.)

const SUBSTAT_WEIGHTS = {
  "Atk": 6,
  "Def": 6,
  "HP": 6,
  "Atk%": 4,
  "Def%": 4,
  "HP%": 4,
  "ER": 4,
  "EM": 4,
  "critRate": 3,
  "critDmg": 3
}

const getSubFreqDist = (artifact = null, takenSubstats = []) => {
  // first, elucidate all substat weights
  const subWeights = { ...SUBSTAT_WEIGHTS };
  // a substat can't be the same as the main stat, so remove that one
  if (artifact) { delete subWeights[artifact.mainStat]; }
  // duplicate substats aren't allowed, so remove all of those as well
  takenSubstats.forEach(sub => delete subWeights[sub]);

  // return the weight table
  return subWeights;
}

// for testing purposes
// const seed = require("./seed/seed.json");
// for (const artifact of seed) { console.log(getSubFreqDist(artifact)); }

module.exports = getSubFreqDist;