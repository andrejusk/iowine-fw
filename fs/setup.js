/* Get current config */
$.ajax({
  url: '/rpc/Config.Get',
  success: function(data) {
    $('#ssid').val(data.wifi.sta.ssid);
    $('#pass').val(data.wifi.sta.pass);
  },
});

/* On submit */
$('#save').on('click', function() {

  /* Set config */
  $.ajax({
    url: '/rpc/Config.Set',
    data: JSON.stringify({
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
    }),
    type: 'POST',

    /* On set */
    success: function(data) {

      /* Save config */
      $.ajax({
        url: '/rpc/Config.Save', 
        type: 'POST', 
        data: JSON.stringify({
          "reboot": true
        }),

        /* On save */
        success: function(data) {

          /* Redirect */
          window.location.href = "https://iowine-cloud.firebaseapp.com/";

        }
      });
    },
  })
});