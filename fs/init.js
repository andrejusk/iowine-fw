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
let failCount = 0;

/* MOS HTTP Firebase API */
let sendData = function() {
	print("Sending query...");
	HTTP.query({
		/* Firebase function endpoint */
		url: 'https://us-central1-iowine-cloud.cloudfunctions.net/pushData',
		/* Set JSON content header */
		headers: {
			'Content-Type': 'application/json'
		},
		/* POST Request body */
		data: getData(),
		/* Handler functions */
		success: onSuccess,
		error: onError
	});
};

let getData = function() {
	return {
		time: Timer.now(),
		device: device,
		temperature: tempGet(),
		humidity: humGet()
	};
};

let onSuccess = function(body, http) { 
	print("Success: ", body, http);
	/* Sleep for 15 minutes */
	shutdown(900);
};

let onError = function(err) {
	/* Increment error count */
	print("Error: ", err);
	failCount = failCount + 1;

	/* Retry or reset config AP if failed enough */
	if (failCount >= 3) {
		print("Resetting...");
		resetAP();
	} else {
		print("Retrying...");
		sendData();
	}
};

let resetAP = function () {
	/* Re-enable setup Wi-Fi */
	Cfg.set({ 
		wifi: { 
			ap: { enable: true }, 
			sta: { enable: false }, 
			sta1: { enable: false }, 
			sta2: { enable: false } 
		} 
	});
	/* Restart */
	shutdown(1);
};

/* Entry point */
print("Starting device ", device);

/* Send data if STA mode, wait if AP */
let apMode = Cfg.get('wifi.ap.enable');
if (apMode === true) {
	print("Starting in AP mode. Restarting in 3 minutes.");
	Timer.set(3 * 60 * 1000, 0, function() {
		shutdown(1);
	}, null)
} else {
	sendData();
}
