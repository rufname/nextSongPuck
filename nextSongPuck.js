let counter = 0;
let connected = false;
let controls = require("ble_hid_controls");

NRF.setServices(undefined, { hid: controls.report });

function single() {
  if (connected) {
    digitalWrite(LED3, true);
    setTimeout(function() { //Confirm with green blink
      digitalWrite(LED3, false);
    }, 500);
    controls.next(); // Skip to next song
  } else {
    digitalWrite(LED1, true);
    setTimeout(function() { //Red blink as error message when not connected
      digitalWrite(LED1, false);
    }, 500);
  }
}

function double() {
  if (connected) {
    digitalWrite(LED3, true);
    setTimeout(function() {
      digitalWrite(LED3, false);
    }, 500);
    controls.playpause(); // Play/stop music
  } else {
    digitalWrite(LED1, true);
    setTimeout(function() {
      digitalWrite(LED1, false);
    }, 500);
  }
}

function triple() {
  if (connected) {
    digitalWrite(LED3, true);
    setTimeout(function() {
      digitalWrite(LED3, false);
    }, 500);
    controls.prev(); // Go to previous song
  } else {
    digitalWrite(LED1, true);
    setTimeout(function() {
      digitalWrite(LED1, false);
    }, 500);
  }
}

NRF.on('connect', function(addr) {
  connected = true;
  digitalWrite(LED2, true); //confirm successfull connection with green blink
  setTimeout(function() {
    digitalWrite(LED2, false);
  }, 500);
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
    if (counter === 3) {
      triple();
      counter = 0;
    } else if (counter === 2) {
      double();
      counter = 0;
    } else if (counter === 1) {
      single();
      counter = 0;
    } else {
      counter = 0;
    }
  }, evalDuration);
}, BTN, { edge: "rising", debounce: 5, repeat: true });
