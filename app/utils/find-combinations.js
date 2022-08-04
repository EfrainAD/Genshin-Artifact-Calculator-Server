// given the values in possibleRolls, find every combination of them (repeats
// are allowed) that could have resulted in the target
const { DECIMAL_STATS } = require("../data/artifact-data");

// rounds a number to one decimal place
const round1 = (n) => {
  return Math.round(n * 10) / 10;
}

// recursively finds combinations of numbers in possibleRolls that add up to
// the target value
const subsetSum = (possibleRolls, target, found, oneDecimal, partials = []) => {
  // genshin unpredictably rounds in some places and truncates in others, so
  // we regrettably need to check both possibilities; if there's any rhyme or
  // reason to when it does one or the other, I haven't been able to find it.
  // the values that are decimals do seem to be reliably rounded to a tenth,
  // however, which makes our lives just a bit nicer.
  const rawSum = partials.reduce((acc, n) => (acc + n), 0);
  const sum = oneDecimal ? round1(rawSum) : Math.floor(rawSum);
  const sumAlt = oneDecimal ? sum : Math.round(rawSum);

  // if the partial sum equals our (rounded) target, we're looking good!
  if (sum === target || sumAlt === target) { found.push(partials); }
  // halt the current branch if we're at or above the target
  if (sum >= target) { return; }
  // for safety, halt the current branch if we've gone above six rolls, which
  // is not numerically possible in genshin
  if (partials.length > 6) { return; }

  // recursively push numbers from possibleRolls into our partial sum, and then
  // recalculate
  for (const roll of possibleRolls) {
    subsetSum(possibleRolls, target, found, oneDecimal, [...partials, roll]);
  }
}

// mostly a wrapper for subsetSum, with some pre- and post-processing
const findCombos = (possibleRolls, target, stat) => {
  // to avoid data typing voodoo because javascript is the worst!!!
  target = Number(target);

  // some stats are rounded to one decimal place and some are rounded to a
  // whole number instead
  const oneDecimal = DECIMAL_STATS.includes(stat);

  // find the combinations!
  const combinationsFoundRaw = [];
  subsetSum(possibleRolls, target, combinationsFoundRaw, oneDecimal);

  // these results will include tons of duplicates, which we shall remove here
  combinationsFoundRaw.forEach(combo => combo.sort((n1, n2) => (n1 - n2)));
  const combinationsFound = {};
  combinationsFoundRaw.forEach((combo, i) => (combinationsFound[combo] = i));

  return (Object.values(combinationsFound).map(i => combinationsFoundRaw[i]));
}

module.exports = findCombos;
