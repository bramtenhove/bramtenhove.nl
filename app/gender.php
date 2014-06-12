<?php

class GenderGuess {
  /**
   * Function that tries to guess the gender by full name.
   *
   * @param string $fullname
   *   The full name we want to detect the gender of.
   * @param string $ipaddress
   *   Optional IP address we can use for better detection.
   *
   * @return string
   *   Either female, male or unknown.
   */
  public function guessGender($fullname, $ipaddress = null) {
    // Throw new exception if full name is not given or empty.
    if (empty($fullname) && !is_string($fullname)) {
      throw new Exception('No name given.');
    }

    // Get first name from full name.
    try {
      $firstname = $this->getFirstName($fullname);
    } catch (Exception $e) {
      throw new Exception('Invalid first name.');
    }

    // Send the request.
    try {
      $gender = $this->sendRequest($firstname, $ipaddress);

      // Return the gender.
      return $gender;
    } catch (Exception $e) {
      return 'unknown';
    }
  }

  /**
   * Function to get the first name from a full name.
   *
   * @param string $fullname
   *   The full name we have to get the first name from.
   *
   * @return string
   *   The first name.
   */
  public function getFirstName($fullname) {
    // Remove any dots (e.g. J. Doe become J Doe).
    $fullname = str_replace('.', '', $fullname);

    // Explode into first name and the rest.
    $pieces = explode(' ', $fullname);

    // Check if we're dealing with a name we cannot use.
    if (strlen($pieces[0]) < 2) {
      throw new Exception('Invalid first name.');
    }
    else {
      // Return the first name.
      return $pieces[0];
    }
  }

  /**
   * Function that makes a request to the Gender API.
   *
   * @param string $firstname
   *   The first name we will try to detect the gender of.
   * @param string $ipaddress
   *   Optional IP address we can use for better detection.
   *
   * @return string
   *   Either female, male or unknown.
   */
  private function sendRequest($firstname, $ipaddress = null) {
    $request_path = 'https://gender-api.com/get?name=' . urlencode($firstname);

    if (filter_var($ipaddress, FILTER_VALIDATE_IP)) {
      $request_path .= '&ip=' . $ipaddress;
    }

    // Make the API request.
    $ch = curl_init($request_path);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // The result from Gender API.
    $result = json_decode(curl_exec($ch));

    // Close curl request.
    curl_close($ch);

    // Detect proper result.
    if (!isset($result->errno)) {
      // Return the detected gender.
      return $result->gender;
    }
    else {
      throw new Exception('Error in inquiry result.');
    }
  }
}
?>
