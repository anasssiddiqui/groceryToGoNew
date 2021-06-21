/*
|----------------------------------------------------------------------------------------------------------------
|   Router File
|----------------------------------------------------------------------------------------------------------------
|   All routers called in this file.
|
*/
    // const adminRouter = require('./admin.routes');
    const adminRouter = require('./admin.routes');
    const apiRouter = require('./api.routes');

/*
|----------------------------------------------------------------------------------------------------------------
|   Middlewares
|----------------------------------------------------------------------------------------------------------------
*/
    // const old_master_adminAuthentication = require('../middlewares/old_master_adminAuthentication');
    const adminAuthentication = require('../middlewares/adminAuthentication');

/*
|----------------------------------------------------------------------------------------------------------------
|   Route Files called with middlewares
|----------------------------------------------------------------------------------------------------------------
*/
module.exports = (app) => {

    // app.use('/admin/', old_master_adminAuthentication, adminRouter);
    app.use('/admin/', adminAuthentication, adminRouter);
    app.use('/api/', apiRouter);

}