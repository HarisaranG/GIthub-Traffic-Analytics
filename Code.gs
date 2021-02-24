function views() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var views = ss.getSheets()[1];
  var config = ss.getSheets()[0];
  var owner = config.getRange('A2').getCell(1, 1).getValue();
  var repo = config.getRange('B2').getCell(1, 1).getValue();
  var apikey = config.getRange('C2').getCell(1, 1).getValue();
  var response = UrlFetchApp.fetch('https://api.github.com/repos/'+owner+'/'+repo+'/traffic/views?per=day',{
    'method': 'get',
    'headers': {
    'Authorization': 'token '+apikey,
    'Accept': 'application/vnd.github.v3+json',
    },
  });
  // Logger.log(response);
  if (response.getResponseCode() == 200) {
    response = JSON.parse(response.getContentText());
    var today = Utilities.formatDate(new Date(), "UTC", "dd/MM/yyyy");
    if (response["views"].length > 0) {
      var len = response["views"].length;
      var date = response["views"][len - 1]["timestamp"];
      if (Utilities.formatDate(new Date(date), "UTC", "dd/MM/yyyy") == today) {
          views.appendRow([today, response["views"][len - 1]["count"], response["views"][len - 1]["uniques"]]);
          return;
      }
    }
    views.appendRow([today, 0, 0]);
  } else {
    throw new Error("Unable to Fetch Data for Views - Status Code:  " + response.getResponseCode());
  }
}

function clones() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var clones = ss.getSheets()[1];
  var config = ss.getSheets()[0];
  var owner = config.getRange('A2').getCell(1, 1).getValue();
  var repo = config.getRange('B2').getCell(1, 1).getValue();
  var apikey = config.getRange('C2').getCell(1, 1).getValue();
  var response = UrlFetchApp.fetch('https://api.github.com/repos/'+ owner + '/' + repo + '/traffic/clones?per=day', {
    'method': 'get',
    'headers': {
      'Authorization': 'token '+ apikey,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  if(response.getResponseCode() == 200) {
    response = JSON.parse(response.getContentText());
    // Logger.log(response);
    var today = Utilities.formatDate(new Date(), "UTC", "dd/MM/yyyy");
    if (response["clones"].length > 0) {
      var len = response["clones"].length;
      var date = response["clones"][len - 1]["timestamp"];
      if (Utilities.formatDate(new Date(date), "UTC", "dd/MM/yyyy") == today) {
          clones.appendRow([today, response["clones"][len - 1]["count"], response["clones"][len - 1]["uniques"]]);
          return;
      }
    }
    clones.appendRow([today, 0, 0]);
  } else {
    throw new Error("Unable to Fetch Data for Clones - Status Code:  " + response.getResponseCode());
  }
}

function refferal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var referral = ss.getSheets()[3];
  var config = ss.getSheets()[0];
  var owner = config.getRange('A2').getCell(1, 1).getValue();
  var repo = config.getRange('B2').getCell(1, 1).getValue();
  var apikey = config.getRange('C2').getCell(1, 1).getValue();
  var response = UrlFetchApp.fetch('https://api.github.com/repos/'+ owner + '/' + repo + '/traffic/popular/referrers', {
    'method': 'get',
    'headers': {
      'Authorization': 'token '+ apikey,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  if(response.getResponseCode() == 200) {
    response = JSON.parse(response.getContentText());
    response.forEach((j) => {
      var number = referral.getMaxRows();
      var flag = false;
      for(var i = 2; i <= number; ++i) {
        var referrer = referral.getRange('A' + String(i)).getCell(1, 1).getValue();
        // Logger.log(referrer);
        if (referrer == j["referrer"]) {
          flag = true;
          referral.getRange('B' + String(i)).getCell(1, 1).setValue(j["count"]);
          referral.getRange('C' + String(i)).getCell(1, 1).setValue(j["uniques"]);
          break;
        }
      }
      if (!flag) {
        referral.appendRow([j["referrer"], j["count"], j["uniques"]]);
      }
    });
  } else {
    throw new Error("Unable to Fetch Data for Refferal Sources - Status Code: " + response.getResponseCode());
  }
}
