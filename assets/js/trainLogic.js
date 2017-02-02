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
      $("#first-train-input").val("");
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
      
  
      var tableBody = $("#tableBod");
      var tableRow = $("<tr>").attr('id', 'row'+ childSnapshot.key);
      var nameCol=$("<td>");
      var destinationCol=$("<td>");
      var freqCol=$("<td>");
      var arrivalCol=$("<td>");
      var minsAwayCol=$("<td>");
      var delBtnCol=$("<td>");

      //Create Delete button
      var delBtn = $("<button>").text("Del");
      delBtn.addClass("delte-button");
      delBtnCol.append(delBtn);
    
      //Event listener for delete button:
      delBtn.on('click', function(){

        database.ref("/Trains").child(childSnapshot.key).remove();
      });



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

    //Add text to columns:
    nameCol.text(trainName);
    destinationCol.text(destination);
    freqCol.text(frequency);
    arrivalCol.text(nextArrival);
    minsAwayCol.text(minsAway);

    // Add each train's data into the table
    tableRow.append(nameCol);
    tableRow.append(destinationCol);
    tableRow.append(freqCol);
    tableRow.append(arrivalCol);
    tableRow.append(minsAwayCol);
    tableRow.append(delBtnCol);
    tableBody.append(tableRow);

      //Call fxn here to update all of above calculations and update html every minute
      function updateTime(){
        minsAway--;
        minsAwayCol.textContent=minsAway;
        if(minsAway <=0){
            minsAway = frequency;
            nextArrival = moment().add(frequency,'minutes').toISOString;
            console.log(nextArrival);
            // used .toISOString above and converting to format("hh:mm a") due to deprecating warning...even though had no issues above before adding the update every minute...not sure why
            arrivalCol.textContent = moment(nextArrival).format('hh:mm a');

        }
      }
      var countDown = setInterval(updateTime, 1000*60);

      
    });
      // parentNode.removeChild context borrowed from StackOverflow
      database.ref("/Trains").on("child_removed", function(childSnapshot) {
        var delRow = $('#row' + childSnapshot.key);
        console.log(delRow);

        delRow.parentNode.removeChild(delRow);
        console.log("get error: Cannot read property 'removeChild' of undefined; however, row is deleted after refreshing page ");

      // delRow.parent().remove(); //This removes everything
  });
  

  
  // $(document).on("click", "button.delete", function() {
  //   $(this).parent().remove();


  //  });

// -----------------------------------------------------------------------------

