/**
 * Update fields from Config.Get.
 * @param {*} data Config values.
 */
let setFields = function(data) {
  $('#ssid').val(data.wifi.sta.ssid);
  $('#pass').val(data.wifi.sta.pass);
  $('#user').val(data.wifi.sta.user);
  $('#device').val(data.device.id);
};

/**
 * Set and save input config values.
 */
let setConfig = function() {

  /* Setup object */
  let wifiSettings = {
    config: {
      wifi: {
        ap: {
          enable: false
        },
        sta: {
          enable: true, 
          ssid: $('#ssid').val(), 
          pass: $('#pass').val()
        } 
      }
    }
  };

  /* Get optional input */
  let user = $('#user').val();
  if (user != null) {
    wifiSettings.config.wifi.sta.user = user;
  }

  /* Execute config and save */
  $.ajax({
    url: '/rpc/Config.Set',
    data: JSON.stringify(wifiSettings),
    type: 'POST',
    success: saveConfig,
  })

};

/**
 * Save config values
 */
let saveConfig = function(_) {
  $.ajax({
    url: '/rpc/Config.Save', 
    type: 'POST', 
    data: JSON.stringify({
      "reboot": true
    }),
    success: redirect
  });
};

/**
 * Redirect 
 */
let redirect = function(_) {
  window.location.href = "https://iowine-cloud.firebaseapp.com/";
}


/*
  Entry point.
*/

/* Get current config */
$.ajax({ url: '/rpc/Config.Get', success: setFields });

/* On submit */
$('#save').on('click', setConfig);