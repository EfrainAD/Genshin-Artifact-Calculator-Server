// various probability and combinatorics functionality

// memoization is definitely not necessary for an application on this scale,
// and likely doesn't even work properly with how I structured the files, but I
// wanted to practice and see if I could implement it!
const factorialMemoization = {};

const factorial = (n) => {
  if (n <= 1) { return 1; }

  if (factorialMemoization[n]) { return factorialMemoization[n]; }

  factorialMemoization[n] = n * factorial(n - 1);
  return factorialMemoization[n];
}

// returns the result of (n choose k)
const choose = (n, k) => {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

// returns num if it's between 0 and 1, or one of those boundaries otherwise.
// mostly a final sanity check on the probability returned.
const rerange = (num) => {
  return Math.min(Math.max(num, 0), 1);
}

// for the binomial scenario with n trials, k desired successes, and probability
// of trial success p, returns the probability of exactly k successes
const binom = (n, k, p) => {
  if (k > n) { return 0; } // sanity check

  return rerange(choose(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k));
}

// for the binomial scenario with n trials, k desired successes, and probability
// of trial success p, returns the cumulative probability of any number of
// successes less than k
const binomCumBelow = (n, k, p) => {
  let cumSum = 0;
  for (let k_i = 0; k_i < k; k_i++) {
    cumSum += binom(n, k_i, p);
  }

  return rerange(cumSum);
}

// similar to the previous, but for greater than k instead of less than k
const binomCumAbove = (n, k, p) => {
  let cumSum = 0;
  for (let k_i = k + 1; k_i <= n; k_i++) {
    cumSum += binom(n, k_i, p);
  }

  return rerange(cumSum);
}

// binomCumBelow, but inclusive of k
const binomCumBelowInc = (n, k, p) => {
  return rerange(binomCumBelow(n, k, p) + binom(n, k, p));
}

// binomCumAbove, but inclusive of k
const binomCumAboveInc = (n, k, p) => {
  return rerange(binomCumAbove(n, k, p) + binom(n, k, p));
}

const rollSumRecursive = (possibleRolls, targetSum, n, count, rolls = []) => {
  // check the success condition and halt once we're at the correct number of
  // rolls, updating the count if successful
  if (rolls.length >= n) { 
    const sum = rolls.reduce((sum, roll) => (sum + roll), 0);
    if (sum <= targetSum) { count.count++; }
    return;
   }

  for (const roll of possibleRolls) {
    rollSumRecursive(possibleRolls, targetSum, n, count, [...rolls, roll]);
  }
}

// to put it plainly, this function calculates the chance that n rolls of a
// numOutcomes-sided die labeled from 0 to (numOutcomes - 1) will sum be to less 
// than or equal to targetSum.
const rollSumBelowInc = (n, targetSum, numOutcomes) => {
  // a lot of clever solutions were considered here, but at the end of the day
  // I'm just going to go with a brute force method -- the number of possible
  // outcomes will (usually) be something reasonable, and this is much faster
  // to implement than something efficient but clever, which is exactly what we
  // need for this very limited amount of project time
  const possibleRolls = (Array(numOutcomes)).fill(null).map((el, i) => i);
  const count = {count: 0};
  rollSumRecursive(possibleRolls, targetSum, n, count);
  
  // count will now contain the number of combinations that lead to rolls that
  // are worse than or equivalent to ours; we can convert this into a probability
  // by simply dividing by the number of possible outcomes
  return count.count / Math.pow(numOutcomes, n);
}

const weightedCategoriesRecursive = (desiredOutcomes, targetCount, finalDepth, weightTable, results, currentPicks = []) => {
  // halt and evaluate if maximum depth has been reached
  if (currentPicks.length >= finalDepth) {
    // we do want to do some postprocessing here for our own sanity. first,
    // figure out how many of our desiredOutcomes ended up in currentPicks.
    let matches = 0;
    currentPicks.forEach(entry => {
      if (desiredOutcomes.includes(entry.entry)) { matches++; }
    });

    
    // discard our currentPicks if we've exceeded targetCount, since this
    // recursion is for a cumulative-below distribution
    if (matches > targetCount) { return; }
    
    // now, sort the entries in currentPicks by lex order...
    currentPicks.sort((e1, e2) => (e1.entry.localeCompare(e2.entry)));
    // ... so that we can aggregate them in the results hashmap.
    const currentResultNames = currentPicks.map(entry => entry.entry);
    const currentResultProb = currentPicks.reduce((p, entry) => (p * entry.prob), 1);
    
    // aggregate the probabilities and halt
    results[currentResultNames] === undefined ?
      results[currentResultNames] = currentResultProb :
      results[currentResultNames] += currentResultProb;

    return;
  }

  // otherwise, continue to search recursively through whatever's left of the
  // weight table
  const weightProbabilities = {};
  const totalWeight = Object.values(weightTable).reduce((sum, w) => (sum + w), 0);
  Object.keys(weightTable).forEach(entry => {
    weightProbabilities[entry] = weightTable[entry] / totalWeight;
  })

  for (const entry in weightTable) {
    // remove the selected substat from the next weight table
    const nextWeightTable = { ...weightTable };
    delete nextWeightTable[entry];

    weightedCategoriesRecursive(desiredOutcomes, targetCount, finalDepth, nextWeightTable, results, [
      ...currentPicks,
      {
        entry: entry,
        prob: weightProbabilities[entry]
      }
    ]);
  }
}

// I initially thought the calculations for this would be tricky but doable, but
// after attempting to sketch them out, I realized that the varying weights for
// all of the different components made a simple, closed-form solution beyond my
// grasp in a reasonable time frame. it's time for brute force again, yay!!!
const weightedCategoriesBelowInc = (desiredOutcomes, targetCount, finalDepth, initialWeightTable) => {

  const results = [];
  weightedCategoriesRecursive(desiredOutcomes, targetCount, finalDepth, initialWeightTable, results);

  // console.log(results)
  const sum = Object.values(results).reduce((sum, p) => (sum + p), 0);
  console.log("probability sum:", sum)
}

// exports
module.exports = {
  binom,
  binomCumBelow,
  binomCumAbove,
  binomCumBelowInc,
  binomCumAboveInc,
  rollSumBelowInc,
  weightedCategoriesBelowInc
};