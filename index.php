<?php

//pulling the IP data
$protocol = $_SERVER['SERVER_PROTOCOL'];
$ip = $_SERVER['REMOTE_ADDR'];
$port = $_SERVER['REMOTE_PORT'];
$agent = $_SERVER['HTTP_USER_AGENT'];
$ref = $_SERVER['HTTP_REFERER'];
$hostname = gethostbyaddr($_SERVER['REMOTE_ADDR']);
 
//opening the log file
$fh = fopen('userlog.txt', 'a');

//printing the IP data
fwrite($fh, 'IP Address: '."".$ip ."    ");
fwrite($fh, 'Hostname: '."".$hostname ."    ");
fwrite($fh, 'Port Number: '."".$port ."    ");
fwrite($fh, 'User Agent: '."".$agent ."    ");
fwrite($fh, 'HTTP Referer: '."".$ref ."    ");
fwrite($fh, 'Date (dd/mm/yyyy): '."".date(d/m/Y) ."    ");
fwrite($fh, 'Time: '."".date(H:i:s) ."      Geolocation Data:   ")

//now the NSA type stuff--------------------------------------------------------------------------------
$ipdat = @json_decode(file_get_contents(
    "http://www.geoplugin.net/json.gp?ip=" . $ip));

//printing all the geolocation data
fwrite($fh, 'Country: '."".$ipdat->geoplugin_countryName."  ");
fwrite($fh, 'City Name: '."".$ipdat->geoplugin_city."   ");
fwrite($fh, 'Latitude: '."".$ipdat->geoplugin_latitude."    ");
fwrite($fh, 'Longitude: '."".$ipdat->geoplugin_longitude."\n");

//closing the log file
fclose($fh);

?>

<!DOCTYPE html>
<html>
<title>Christian Strommen</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/styles/w3.css">
<link rel="stylesheet" href="/styles/w3-colors-ios.css">
<link rel="stylesheet" href="/styles/w3-colors-flat.css">

<body class="w3-content" style="max-width:1920px">

<!-- First Grid: Logo & About -->
<div class="w3-row">
  <div class="w3-half w3-flat-midnight-blue w3-container w3-center" style="height:1080px">
    <div class="w3-padding-64">
      <h1>Christian Strommen</h1>
      <p>Design Mechanical Engineer in the Minneapolis/St Paul Area</p>
    </div>
    <div class="w3-padding-64">
      <a href="#" class="w3-button w3-flat-midnight-blue w3-block w3-hover-blue-grey w3-padding-16">Home</a>
      <a href="/assets/resume.pdf" class="w3-button w3-flat-midnight-blue w3-block w3-hover-orange w3-padding-16" target="_blank" rel="noopener noreferrer">Resume (pdf)</a>
      <a href="/assets/work.pdf" class="w3-button w3-flat-midnight-blue w3-block w3-hover-grey w3-padding-16" target="_blank" rel="noopener noreferrer">Project Portfolio (pdf)</a>
      <a href="https://www.linkedin.com/in/christianstrommen/" class="w3-button w3-flat-midnight-blue w3-block w3-hover-blue w3-padding-16" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="https://umn.joinhandshake.com/users/24314153" class="w3-button w3-flat-midnight-blue w3-block w3-hover-red w3-padding-16" target="_blank" rel="noopener noreferrer">Handshake</a>
      <a href="/work/work.html" class="w3-button w3-flat-midnight-blue w3-block w3-hover-teal w3-padding-16">CAD Portfolio</a>
      <a href="/vision-systems/sierra-page.html" class="w3-button w3-flat-midnight-blue w3-block w3-hover-green w3-padding-16">Side Projects</a>
      <a href="https://github.com/Cpstrommen" class="w3-button w3-flat-midnight-blue w3-block w3-hover-purple w3-padding-16" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://www.discogs.com/user/cpstrommen/collection" class="w3-button w3-flat-midnight-blue w3-block w3-hover-black w3-padding-16" target="_blank" rel="noopener noreferrer">Vinyl Record Collection</a>
    </div>
  </div>
  <div class="w3-half w3-ios-dark-blue w3-container" style="height:1080px">
    <div class="w3-padding-64 w3-center">
      <h1>About Me</h1>
      <img src="/assets/profile_photo.png" class="w3-margin w3-circle" alt="Christian Photo" style="width:50%">
      <div class="w3-left-align w3-padding-large">
        <p>I am a robotics, microprocessor, small engine, and aviation enthusiast that explores various projects including 3D additive and subtractive manufacturing systems, 3D gantry and robotics systems, embedded Arduino projects, racing drones, and mechanical design. I am well-versed in Arduino and CAD/CAM software, and have built many 3D printers from scratch, and am always excited to develop skills in new facets of the engineering world. I am a hard-working maker with experience, curiosity, and determination.</p>
        <p>Feel free to explore the links on the left for examples of my work and links to relevent sites.</p>
        <p>Email: cpstrommen@gmail.com</p>
        <p>Cell: 651-263-6193</p>
      </div>
    </div>
  </div>
</div>

<!-- Footer -->
<footer class="w3-container w3-black w3-padding-16">
  <p><b>Powered by Christian's Raspberry Pi Server</b></p>
</footer>

</body>
</html>