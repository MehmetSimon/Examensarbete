var clicks = 0;
var testing = true;

// $('#endTestLogout').hide();
$(document).on('mouseup',document,function(){
  if(testing === true){
      clicks++;
      console.log("Click registered ("+clicks+")");
  }
});

$(document).on('click','#endTest',function(){
  var r = confirm("Are you sure you want to end this test session?");
  if (r == true) {
      $.ajax({
        method: "POST",
        url: "../Testing/register.php",
        data: { end:clicks},
        success: function(){
          var currentTime = new Date().toLocaleTimeString('sv-SE', { hour12: false,
                                                       hour: "numeric",
                                                       minute: "numeric",
                                                       second: "numeric"});
          $('#testingStrings .end').text(currentTime);
          alert("The test has ended.");
          console.log("The test has ended.");
          testing = false;
          $('#endTest').hide();
          $('#endTestLogout').show();
          var form = 'https://goo.gl/forms/4KYpDWuZkoEL11Ku2';
          var win = window.open(form, '_blank');
          if (win) {
              //Browser has allowed it to be opened
              win.focus();
          } else {
              //Browser has blocked it
              alert('Please allow popups for this website.');
              console.log("Google form url: " + form);
          }
        }
      });
  } else {
      alert("The test is still active.");
  }
});
