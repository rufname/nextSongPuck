let counter = 0;
let connected = false;
let controls = require("ble_hid_controls");
let config = {
  single: next,
  double: playpause,
  triple: previous,
};

NRF.setServices(undefined, { hid: controls.report });

function flash(led) {
  digitalWrite(led, true);
  setTimeout(function () {
    digitalWrite(led, false);
  }, 500);
}
function flashAndCall(cb) {
  if (connected) {
    flash(LED3);
    cb();
  } else {
    flash(LED1);
  }
}

function next() {
  flashAndCall(controls.next);
}

function playpause() {
  flashAndCall(controls.playpause);
}

function previous() {
  flashAndCall(controls.prev);
}

NRF.on('connect', function(addr) {
  connected = true;
  flash(LED2);
});

NRF.on('disconnect', function(reason) {
  connected = false; //reset everything on disconnect
  digitalWrite(LED1, false);
  digitalWrite(LED2, false);
  digitalWrite(LED3, false);
});

//trigger buttonEvaluation whenever the button is pressed
let watchID = setWatch(function buttonEvaluation() {
  let evalDuration = 600; //wait for 2nd or 3rd button press before evaluating counter
  counter++;
  setTimeout(() => {
    switch (counter) {
      case 3:
        config.triple();
      break;
      case 2:
        config.double();
      break;
      case 1:
        config.single();
      break;
    }
    // Reset the counter once we're done.
    counter = 0;

  }, evalDuration);
}, BTN, { edge: "rising", debounce: 5, repeat: true });
