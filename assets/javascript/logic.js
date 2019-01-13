var config = {
  apiKey: "AIzaSyD1Pr4eKT3Pdl7M_cNxMK1tlncaHU8EzjQ",
  authDomain: "train-scheduler-df27a.firebaseapp.com",
  databaseURL: "https://train-scheduler-df27a.firebaseio.com",
  projectId: "train-scheduler-df27a",
  storageBucket: "train-scheduler-df27a.appspot.com",
  messagingSenderId: "272540619991"
};
firebase.initializeApp(config);
let database = firebase.database();


// ON BUTTON CLICK
$("#add-data").on("click", function (event) {
  event.preventDefault();

  console.log("button clicked")

  // Grabs user input
  let trainName = $("#train-name-input").val().trim();
  let destination = $("#destination-input").val().trim();
  let trainButton = $("#first-train-input").val().trim();
  let firstTrain = moment(trainButton, "HH:mm").format("x");
  let frequency = $("#frequency-input").val().trim();

  // First train time converted
  let trainTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(trainTimeConverted);

  // Current time
  let currentTime = moment();

  // Difference betwen times
  let timeDifference = moment().diff(moment(trainTimeConverted), "minutes");


  // Time remainder
  let timeRemainder = timeDifference % frequency;
  console.log(timeRemainder);

  // Minutes till train
  let minutesTillTrain = frequency - timeRemainder;


  // Next train
  let nextTrain = moment().add(minutesTillTrain, "minutes").format("HH:mm A");

  // Creates local "temporary" object for holding employee data
  let trainData = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    nextTrain: nextTrain,
    minutesTillTrain: minutesTillTrain,
    currentTime: currentTime.format("HH:mm A")
  };

  // Uploads employee data to the database
  database.ref().push(trainData);

  alert("Train data successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  console.log("train name in database: " + trainData.name);
  console.log("destination in database: " + trainData.destination);
  console.log("first train time in database: " + trainData.firstTrain);
  console.log("train frequency in database: " + trainData.frequency);
  console.log("next train in database: " + trainData.nextTrain);
  console.log("minutes away in database: " + trainData.minutesTillTrain);
  console.log("current time in database: " + trainData.currentTime);

});

// ON CHILD ADDED
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a letiable
  let trainName = childSnapshot.val().name;
  let destination = childSnapshot.val().destination;
  let frequency = childSnapshot.val().frequency;
  let nextTrain = childSnapshot.val().nextTrain;
  let minutesTillTrain = childSnapshot.val().minutesTillTrain;


  // Create the new row
  let newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(minutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table").append(newRow);


});