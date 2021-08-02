const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const wrapAsync = require('../utilities/wrapAsync');
const { validateReviewSchema, verifyReviewAuthor, isLoggedIn } = require('../middleware')

router.post('/', isLoggedIn, validateReviewSchema, wrapAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, verifyReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;