/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains- then update the html + update the database
// 3. Create a way to retrieve trains from the Train Station database.
// 4. Create a way to calculate next arrival. Using difference between start and current time.


  var currentTime = moment();
// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyCVK8m2ys9toGeuJEtJG1s6CSrn4wGU9cg",
    authDomain: "trainstation-6444c.firebaseapp.com",
    databaseURL: "https://trainstation-6444c.firebaseio.com",
    storageBucket: "trainstation-6444c.appspot.com",
    messagingSenderId: "235355036857"
  };

  firebase.initializeApp(config);

var currentTime = moment();
var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();           
  var firstStart = moment($("#first-train-input").val().trim(), "HH:mm").subtract(1,"days").format("X");
  console.log(firstStart);
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstStart: firstStart,
    frequency: frequency
  };

  // Uploads employee data to the database
  //database.ref().set({..creates children
  database.ref("/Trains").push(newTrain); 

  // Logs everything to console
  console.log("CURRENT TIME: " + moment().format("hh:mm:ss"));
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstStart);//sent to database as ms since midnight Jan 1 1970 ('X')format
  console.log(newTrain.frequency);

  // Alert
  console.log(newTrain.name +" train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstStart-input").val("");
  $("#frequency-input").val("");

  // Prevents moving to new page
  return false;
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref("/Trains").on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val()); //Object {}

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstStart = childSnapshot.val().firstStart;//still in ms format (1358053200)
  var frequency = childSnapshot.val().frequency;

  // Employee Info
  console.log("CURRENT TIME: " + moment().format("hh:mm:ss"));
  console.log(trainName);
  console.log(destination);
  console.log(firstStart +", typeof firstStart: "+typeof firstStart);//1358053200 (format = "X"), typeof = string
  console.log(frequency);//3, typeof=string
  
  

  // Calculate time until next train:

  // convert firstStart from format = "X" to object format:
  var firstStart = moment.unix(firstStart); 

  // call fxn here to do calculations and display results to html (send firstStart as parameter)
 
  //calculate difference in time :
  var diffTime = moment().diff(moment(firstStart), "minutes"); //nh: using .diff you tell it what format u want by ..., "format") as opposed .format("format")
  console.log(diffTime);

  //calculate time remaining (remainder from current time and frequency)
  var tRemainder = diffTime % frequency;
  console.log("tRemainder: " +tRemainder);
  console.log("CURRENT TIME: " + moment().format("hh:mm:ss"));

  // Calculate minutes until next train
  var minsAway = frequency - tRemainder;
  console.log("minsAway: "+ minsAway);


  //next arrival:
  var nextArrival = moment().add(minsAway, "minutes").format("hh:mm a");
  console.log("nextArrival: " + nextArrival);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");

    //Call fxn here to update all of above calculations and update html every minute
});


// -----------------------------------------------------------------------------

