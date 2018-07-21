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

let connected = false;
print("Starting device ", device);

let getInfo = function() {
	return JSON.stringify({
		total_ram: Sys.total_ram(),
		free_ram: Sys.free_ram()
	});
};

/* Send data on button press */
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 20, function() {
	let message = getInfo();
	if (!connected) {
		print("Not connected, deferring.");
		return;
	}
	HTTP.query({
		url: 'https://us-central1-iowine-cloud.cloudfunctions.net/pushData',
		body: message,
		success: function(x, y) {
			print("Success: ", x, y);
		},
		error: function(error) {
			print("Error: ", error);
		}
	});
	print('Request sent.');
	
}, null);

/* Monitor network connectivity. */
Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
	print('Connection ev: ', ev)
	print('Connection evdata: ', evdata)
	print('Connection arg: ', arg)
	if (ev === Net.STATUS_DISCONNECTED) {
		connected = false;
	} else if (ev === Net.STATUS_CONNECTED) {
		connected = true;
	}
}, null);
