<?php

class FormHandler {
  protected $mailFrom = 'no-reply@bramtenhove.nl';
  protected $mailTo = 'bram@bramtenhove.nl';
  protected $mailToName = 'Bram ten Hove';
  protected $mandrillApiTestKey = '6U1sNcxgVK_YqkvvGGjPUw';
  protected $mandrillApiProdKey = 'XPK4eWOo1E2rwaNx1A7DmQ';
  protected $sendResult;
  protected $errors = array();
  protected $formValues = array();

  public function setFormValues($formValues) {
    $this->formValues = $formValues;
  }

  public function getErrors() {
    return $this->errors;
  }

  public function getSendResult() {
    return $this->sendResult;
  }

  public function validateForm() {
    if (empty($this->formValues)) {
      throw new Exception('No form values to validate.');
    }

    $this->validateFullName($this->formValues['fullname']);
    $this->validateEmailAddress($this->formValues['emailaddress']);
    $this->validateMessage($this->formValues['message']);
  }

  private function validateFullName($value) {
    if (!isset($value) || empty($value)) {
      $this->errors['fullname'] = 'Please fill in your name, so I know who to contact.';
    }
  }

  private function validateEmailAddress($value) {
    if (!isset($value) || empty($value) || !filter_var($value, FILTER_VALIDATE_EMAIL)) {
      $this->errors['emailaddress'] = 'A valid email address is required.';
    }
  }

  private function validateMessage($value) {
    if (!isset($value) || empty($value)) {
      $this->errors['message'] = 'You need to atleast write a nice message.';
    }
  }

  public function sendMail() {
    date_default_timezone_set('Europe/Amsterdam');

    $this->sendMandrillRequest('prod');
  }

  private function sendMandrillRequest($environment = 'test') {
    // Message in HTML.
    $text = '<p>Dear Bram,</p>
    <p>A message was send through your contact form. You can read all about it down here.</p>
    <p><strong>Message:</strong><br />
    ' . nl2br($this->formValues['message']) . '</p>
    <p><strong>More details:</strong><br />
    IP address: ' . $_SERVER['REMOTE_ADDR'] . '<br />
    Date and time: ' . date('j F Y - H:i') .'</p>';

    // Check which Mandrill API key we should use.
    if ($environment == 'prod') {
      $mandrillKey = $this->mandrillApiProdKey;
    }
    else {
      $mandrillKey = $this->mandrillApiTestKey;
    }

    $formatted_request = array(
      'key' => $mandrillKey,
      'message' => array(
        'html' => $text,
        'subject' => 'Bramtenhove.nl: ' . $this->formValues['fullname'] . ' contacted you',
        'from_email' => $this->mailFrom,
        'from_name' => $this->formValues['fullname'],
        'to' => array(
          array(
            'email' => $this->mailTo,
            'name' => $this->mailToName,
            'type' => 'to',
          ),
        ),
        'headers' => array(
          'Reply-To' => $this->formValues['emailaddress'],
        ),
      ),
    );

    // Encode it to JSON.
    $json_request = json_encode($formatted_request);

    // Make the API request.
    $ch = curl_init('https://mandrillapp.com/api/1.0/messages/send.json');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_request);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($json_request))
    );

    // The result from Mandrill.
    $result = json_decode(curl_exec($ch));

    if (isset($result->status) && $result->status == 'error') {
      throw new Exception('Something went wrong, your message could not be send');
    }
    elseif (isset($result[0]->status) && $result[0]->status == 'sent') {
      $this->sendResult = 'It was sent successfully, I will reply asap';
    }
    elseif (isset($result[0]->status) && $result[0]->status == 'queued') {
      $this->sendResult = 'It is queued for sending, I will reply asap';
    }
    elseif (isset($result[0]->status) && $result[0]->status == 'scheduled') {
      $this->sendResult = 'It is scheduled to be send soon, I will reply asap';
    }
    else {
      throw new Exception('Something went wrong, your message could not be send');
    }
  }
}
?>
