const Recipe = require('../models/recipe')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    const review = new Review(req.body.review);
    recipe.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await recipe.save();
    req.flash('success', 'Successfully posted your review!');
    res.redirect(`/recipes/${recipe._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Recipe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review!');
    res.redirect(`/recipes/${id}`)
};