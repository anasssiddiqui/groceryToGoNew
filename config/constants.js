/*
|-------------------------------------------------------------------------------------------------------
| Constants File
|-------------------------------------------------------------------------------------------------------
| In this file all the constants set to globals for using them through out the project.
|
*/

  global.appPort = 9110;

  global.securityKey = 'Grocery@123';

  global.appName = 'Grocery To Go';

  global.log_old = function (value, key = '') {
  
    console.log(JSON.stringify(value, null, 2), `:=======================================================>${key}`);
  }

  global.appShortName = 'RN';

  global.appFavUrl = '/assets/img/logo/fav.jpg';

  global.appLogoUrl = '/assets/img/logo/logo.jpg';

  global.appVersion = '0.0.1';

  global.companyName = 'CqlSys';

  global.companyUrl = 'https://www.cqlsys.com/';

  global.copyrightYear = '2021';

  global.jwtSecretKey = 'asafdadfa1231asdfaakf123124o1i24bcd123';

  global.model = '';

  global.modelTitle = '';

  global.currentModule = '';

  global.currentSubModule = '';

  global.currentSubModuleSidebar = '';

  global.moduleRoles = {
    0: 'admin',
    3: 'sellerAdmin'
  }

/*
|-------------------------------------------------------------------------------------------------------
| Global Functions
|-------------------------------------------------------------------------------------------------------
| 
|
*/
  global.log = function() {
    const key = Object.keys(this)[0];
    const value = this[key];
    console.log(value, `:=======================================================>${key}`);
  }
/*
|-------------------------------------------------------------------------------------------------------
| Mail Auth Configuration
|-------------------------------------------------------------------------------------------------------
| In this section mail auth configuration object is set.
|
*/

  global.mailAuth = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      service: 'gmail',
      auth: {
        user: 'test978056@gmail.com',
        pass: 'cqlsystesting123'
      }
  };


/*
|-------------------------------------------------------------------------------------------------------
| Color Classes
|-------------------------------------------------------------------------------------------------------
| In this section color classes suffixes for bg-color & text-color, for example bg-orange & text-orange.
|
*/

  global.colorClasses = [
    'orange',
    'yellow',
    'indigo',
    'blue',
    'green',
    'red',
    'purple',
    'cyan',
    'gray',
    'teal',
    'pink',
    'gray-dark',
  ];

  global.ROLE_TYPES = {
    0: 'Admin',
    1: 'User',
    2: 'Business',
  }

  global.USER_ROLE_MODELS = {
    0: 'admindetail',
    1: 'userdetail',
    2: 'driverdetail',
    3: 'vendordetail',
  }

/*
|-------------------------------------------------------------------------------------------------------
| NPM modules set to globals
|-------------------------------------------------------------------------------------------------------
| In this section NPM modules set to globals
|
*/

  global.moment = require('moment');
  global.pluralize = require('pluralize');

  global.stripe = () => {
    const keys = {
      pk: 'pk_test_qUaxUCX1HDxke7qXR7lSYPQ4',
      sk: 'sk_test_HNEogxZVRXsC4cAEMOHn3CQy00dbzsINrv',
    }

    return require('stripe')(keys.sk);
  }

  module.exports = global;
 
