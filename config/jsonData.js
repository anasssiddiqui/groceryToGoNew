module.exports = {
    true_status: function(res, body, msg) {
        console.log({
            'success': 1,
            'code': 200,
            'message': msg,
            'body': body,
        }, '========>response body');
        
        res.status(200).json({
            'success': 1,
            'code': 200,
            'message': msg,
            'body': body,
        });
        return false;
    },

    false_status: function(res, msg) {
        console.log(msg, '=========>msg');
        res.status(400).json({
            'success': 0,
            'code': 400,
            'message': msg,
            'body': [],
        });
        return false;
    },
    wrong_status: function(res, msg) {
        console.log(msg, '=========>msg');
        res.status(400).json({
            'success': 0,
            'code': 400,
            'message': msg,
            'body': {},
        });
        return false;
    },
    invalid_status: function(res, msg) {
        console.log(msg, '=========>msg');
        res.status(401).json({
            'success': 0,
            'code': 401,
            'message': msg,
            'body': [],
        });
        return false;
    },
    unauth_status: function(res, msg) {
        console.log(msg, '=========>msg');
        res.status(401).json({
            'success': 0,
            'code': 401,
            'message': msg,
            'body': {},
        });
        return false;
    }

}