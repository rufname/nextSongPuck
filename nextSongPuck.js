let controls = require("ble_hid_controls");
NRF.setServices(undefined, { hid: controls.report });

let next, playpause, previous;
let counter = 0;
let connected = false;


// flash the led for an amount of time
function flash(led, time) {
  if (typeof time !== "number") {
      time = 500;
  }
  digitalWrite(led, true);
  setTimeout(function () {
    digitalWrite(led, false);
  }, time);
}
function flashAndCall(cb) {
  if (connected) {
    // blue when it is connected
    flash(LED3);
    cb();
  } else {
    // red when it's not connected
    flash(LED1);
  }
}

NRF.on('connect', function(addr) {
  connected = true;
  flash(LED2);
});

NRF.on('disconnect', function(reason) {
  connected = false; //reset everything on disconnect
  digitalWrite(LED1, false); //r
  digitalWrite(LED2, false); //g
  digitalWrite(LED3, false); //b
});

// define next, playpause, previous functions
next = function() {
  flashAndCall(controls.next);
};

playpause = function() {
  flashAndCall(controls.playpause);
};

previous = function() {
  flashAndCall(controls.prev);
};

// bind them
let binds = {
  single: next,
  double: playpause,
  triple: previous,
};


//trigger buttonEvaluation whenever the button is pressed
let watchID = setWatch(function buttonEvaluation() {
  let evalDuration = 600; //wait for 2nd or 3rd button press before evaluating counter
  counter++;
  setTimeout(() => {
    switch (counter) {
      case 3:
        binds.triple();
      break;
      case 2:
        binds.double();
      break;
      case 1:
        binds.single();
      break;
    }
    // Reset the counter once we're done.
    counter = 0;

  }, evalDuration);
}, BTN, { edge: "rising", debounce: 5, repeat: true });
