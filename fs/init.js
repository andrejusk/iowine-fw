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

/* mJS C functions */
ffi('void tempInit()')();
let tempGet = ffi('void tempGet()');

print("Starting device ", device);

let getData = function() {
	tempGet();
	return {
		device: device,
		foo: "bar"
	};
};

/* Send data on button press */
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 20, function() {
	/* MOS HTTP API */
	HTTP.query({
		/* Firebase function endpoint */
		url: 'https://us-central1-iowine-cloud.cloudfunctions.net/pushData',
		/* Set appropriate content header */
		headers: {
			'Content-Type': 'application/json'
		},
		/* POST Request body */
		data: getData(),
		/* Handler functions */
		success: function(body, http) { print("Success: ", body, http); },
		error: function(err) { print("Error: ", err); }
	});
	print('Request sent...');
}, null);