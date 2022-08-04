const { POSSIBLE_SUBSTAT_ROLLS, SUBSTAT_WEIGHTING } = require("../../data/artifact-data");

const TEST_ARTIFACT = {
  "name": "Viridescent Venerer's Vessel",
  "slot": "goblet",
  "level": "20",
  "mainStat": "Atk%",
  "mainStatAmount": "46.6",
  "substats": [
    {
      "stat": "critRate",
      "amount": "12.8"
    },
    {
      "stat": "critDmg",
      "amount": "14.0"
    },
    {
      "stat": "Def%",
      "amount": "5.8"
    },
    {
      "stat": "Def",
      "amount": "21"
    }
  ]
};

// given an artifact, calculates its percentile rating -- that is, how good it
// is compared to all other possible artifacts with the given main stat.
const ratePercentile = (artifact) => {
  // this is gonna be a pain to write, isn't it
}

module.exports = ratePercentile;