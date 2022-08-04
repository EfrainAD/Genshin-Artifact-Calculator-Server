// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for artifacts
const Artifact = require('../models/artifact')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /artifacts
router.get('/artifacts', /* requireToken, */ (req, res, next) => {
	Artifact.find()
		.then((artifacts) => {
			// `artifacts` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return artifacts.map((artifact) => artifact.toObject())
		})
		// respond with status 200 and JSON of the artifacts
		.then((artifacts) => {
			console.log(artifacts)
			res.status(200).json({ artifacts })
		})
		// if an error occurs, pass it to the handler
		.catch(next);
})

// SHOW
// GET /artifacts/5a7db6c74d55bc51bdf39793
router.get('/artifacts/:id', /* requireToken, */	 (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Artifact.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "artifact" JSON
		.then((artifact) => res.status(200).json({ artifact: artifact.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /artifacts
router.post('/artifacts', /* requireToken, */ (req, res, next) => {
	// set owner of new artifact to be current user
	req.body.artifact.owner = req.user.id

	Artifact.create(req.body.artifact)
		// respond to succesful `create` with status 201 and JSON of new "artifact"
		.then((artifact) => {
			res.status(201).json({ artifact: artifact.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /artifacts/5a7db6c74d55bc51bdf39793
router.patch('/artifacts/:id', /* requireToken, */ removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.artifact.owner

	Artifact.findById(req.params.id)
		.then(handle404)
		.then((artifact) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, artifact)

			// pass the result of Mongoose's `.update` to the next `.then`
			return artifact.updateOne(req.body.artifact)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /artifacts/5a7db6c74d55bc51bdf39793
router.delete('/artifacts/:id', /* requireToken, */ (req, res, next) => {
	Artifact.findById(req.params.id)
		.then(handle404)
		.then((artifact) => {
			// throw an error if current user doesn't own `artifact`
			requireOwnership(req, artifact)
			// delete the artifact ONLY IF the above didn't throw
			artifact.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
