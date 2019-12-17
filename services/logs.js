module.exports.getlogId = function(){
    let min = 1000000;
    let max = 9999999;
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  };




/**
 * @name printLogs
 * @desc Function to print logs
 */

module.exports.printLogs = function (req,logId, type, message, data) {
  var print = {};
  switch (type) {
    case 0: { //simple logs
      print = {
        'INFO': {
          'log-id': logId ? logId : 'NA',
          'API': req ? req.path : 'NA',
          'message': message ? message : 'NA'
        }
      }
      if (data) {
        print['INFO']['data'] = data;
      }
      console.info(JSON.stringify(print));
    }
    break;

  case 1: { //success logs
    print = {
      'SUCCESS': {
        'log-id': logId ? logId : 'NA',
          'API': req ? req.path : 'NA',
          'message': message ? message : 'NA'
      }
    }
    if (data) {
      print['SUCCESS']['data'] = data;
    }
    console.log(JSON.stringify(print));
  }
  break;

  case 2: { //failed logs
    print = {
      'FAILED': {
        'log-id': logId ? logId : 'NA',
        'API': req ? req.path : 'NA',
        'message': message ? message : 'NA'
      }
    };
    if (data) {
      print['FAILED']['data'] = data;
    }
    console.error(JSON.stringify(print));
  }
  break;

  case 3: { //error logs
    print = {
      'ERROR': {
        'log-id': logId ? logId : 'NA',
        'API': req ? req.path : 'NA',
        'message': message ? message : 'NA'
      }
    };
    if (data) {
      print['ERROR']['data'] = data;
    }
    console.error(JSON.stringify(print));
  }
  break;
  
  }
}

/**
 * @name printClientDataLogs
 * @desc Function to print  client desc logs
 */

module.exports.printClientDataLogs = function (req, logId) {
  var print = {};
  print = {
    'CLIENT-DATA': {
      'log-id': logId ? logId : "NA",
      'API': req ? req.path : "NA",
      // 'user-agent': req  ? req.headers['user-agent'] : "NA",
      'ip': fetchRequestIp(req)
    }
  }
  console.info(JSON.stringify(print));
}



/**
 * @name fetchRequestIp 
 * @desc Function to fetch client request IP
 */

var fetchRequestIp = module.exports.fetchRequestIp = function (req) {
  //check if x-forwarded-for present or not
  if (req.header('x-forwarded-for')) {
    if (Array.isArray(req.header('x-forwarded-for'))) { //check if x-forwarded-for is array or not 
      return req.header('x-forwarded-for')[0];
    } else {
      return req.header('x-forwarded-for');
    }
  } else {
    return req.connection.remoteAddress;
  }
}
