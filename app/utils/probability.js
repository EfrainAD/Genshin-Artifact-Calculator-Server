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
  if (rolls.length === n) { 
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

// exports
module.exports = {
  binom,
  binomCumBelow,
  binomCumAbove,
  binomCumBelowInc,
  binomCumAboveInc,
  rollSumBelowInc
}