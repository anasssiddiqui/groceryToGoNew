const api = require('../controllers/api/api_controller.js');
const pageController = require('../controllers/api/pageController');

module.exports = function(app) {
    /*------------------------apis------------------------*/
    // app.route('/api/signUp').post(api.signUp);
    app.route('/api/logout').post(api.logout);
    app.route('/api/forgot_password').post(api.forgot_password);
    app.route('/api/url_id/:id').get(api.url_id);
    app.route('/api/resetPassword').post(api.resetPassword);
    app.route('/api/socialLogin').post(api.socialLogin);
    app.route('/api/Fav_unFav').post(api.Fav_unFav);
    app.route('/api/history_orders').post(api.history_orders);
    app.route('/api/ongoingdetails').post(api.ongoingdetails);
    app.route('/api/pastdetails').post(api.pastdetails);
    app.route('/api/my_favourites').post(api.my_favourites);
    app.route('/api/add_card').post(api.add_card);
    app.route('/api/make_defaultcard').post(api.make_defaultcard);
    app.route('/api/get_cards').post(api.get_cards);
    app.route('/api/delete_card').post(api.delete_card);
    app.route('/api/ChangePassword').post(api.ChangePassword);
    app.route('/api/category_api').post(api.category_api);
    app.route('/api/revive_api').post(api.revive_api);
    app.route('/api/Recipies').post(api.Recipies);
    app.route('/api/Retail').post(api.Retail);
    app.route('/api/read').post(api.read);
    app.route('/api/reset').post(api.reset);
    app.route('/api/enable_notification').post(api.enable_notification);

    // app.route('/api/about_Us').post(pageController.getPage('aboutUs'));
    // app.route('/api/Policy').post(pageController.getPage('privacyPolicy'));
    // app.route('/api/terms_condition').post(pageController.getPage('termsAndConditions'));

    app.route('/api/recomended').post(api.recomended);
    app.route('/api/get_notification').post(api.get_notification);
    app.route('/api/viewproduct').post(api.viewproduct);
















}