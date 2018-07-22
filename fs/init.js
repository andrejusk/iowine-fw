/* Imports */
load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_http.js');

let led = Cfg.get('pins.led');
let button = Cfg.get('pins.button');
let device = Cfg.get('device.id');

print("Starting device ", device);

let getData = function() {
	return JSON.stringify({
		foo: "bar"
	});
};

/* Send data on button press */
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 20, function() {
	let data = getData();
	HTTP.query({
		url: 'https://us-central1-iowine-cloud.cloudfunctions.net/pushData',
		body: data,
		method: 'POST',
		headers: {
			device: device
		},
		success: function(body, http) {
			print("Success: ", body, http);
		},
		error: function(err) {
			print("Error: ", err);
		}
	});
	print('Request sent.');
}, null);