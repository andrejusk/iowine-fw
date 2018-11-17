/* Imports */
load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_http.js');

/* Configs */
let led = Cfg.get('pins.led');
let button = Cfg.get('pins.button');
let device = Cfg.get('device.id');

/* mJS C functions */
print("tempInit: ", ffi('bool si7021_init()')());
let tempGet = ffi('float si7021_temp_get()');
let humGet = ffi('float si7021_hum_get()');
let shutdown = ffi('void cc_power_shutdown(int)');

let getData = function() {
	return {
		time: Timer.now(),
		device: device,
		temperature: tempGet(),
		humidity: humGet()
	};
};

let sendData = function() {
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
		success: function(body, http) { 
			print("Success: ", body, http);
			/* Sleep */
			shutdown(30);
		},
		error: function(err) {
			print("Error: ", err);
			/* Try again shortly */
			shutdown(5);
		}
	});
};

/* Entry point */
print("Starting device ", device);
sendData();
