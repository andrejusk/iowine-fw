$.ajax({
    url: '/rpc/Config.Get',
    success: function(data) {
      $('#ssid').val(data.wifi.sta.ssid);
      $('#pass').val(data.wifi.sta.pass);
    },
  });

  $('#save').on('click', function() {
    $.ajax({
      url: '/rpc/Config.Set',
      data: JSON.stringify({config: {wifi: {sta: {enable: true, ssid: $('#ssid').val(), pass: $('#pass').val()}}}}),
      type: 'POST',
      success: function(data) {
        $.ajax({url: '/rpc/Config.Save', type: 'POST', data: JSON.stringify({"reboot": true})});
        window.location.href = "https://iowine-cloud.firebaseapp.com/";
      },
    })
  });