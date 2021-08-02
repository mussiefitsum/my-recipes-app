const ExpressError = require('./utilities/ExpressError');
const { recipeSchema, reviewSchema } = require('./schemas');
const Recipe = require('./models/recipe')
const Review = require('./models/review')

module.exports.validateRecipeSchema = (req, res, next) => {
    const { error } = recipeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(x => x.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReviewSchema = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(x => x.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Need to be logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.verifyAuthor = async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id)
    if (!recipe.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/recipes/${id}`);
    }
    next();
}

module.exports.verifyReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/recipes/${id}`);
    }
    next();
}
