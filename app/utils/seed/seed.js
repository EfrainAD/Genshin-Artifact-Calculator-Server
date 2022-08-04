const Artifact = require("../../models/artifact.js");
const seedData = require("./seed.json");

const seed = async () => {
  // first, purge all artifacts from the database
  await Artifact.deleteMany();

  // then, seed the database using our seed data
  await Artifact.create(seedData);
}

module.exports = seed;