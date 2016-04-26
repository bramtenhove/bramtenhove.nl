<?php

require("app/vendor/sendgrid/sendgrid-php.php");

class FormHandler {
  protected $mailFrom = 'no-reply@bramtenhove.nl';
  protected $mailTo = 'bram@bramtenhove.nl';
  protected $mailToName = 'Bram ten Hove';
  protected $sendgridApiTestKey = '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';
  protected $sendgridApiProdKey = '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';
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

    $this->sendSendGridRequest('prod');
  }

  private function sendSendGridRequest($environment = 'test') {
    // Require GenderGuess class.
    require_once 'gender.php';

    $ip = $_SERVER['REMOTE_ADDR'];

    // Instantiate new GenderGuess object.
    $genderGuesser = new GenderGuess();
    // Give me the gender!
    try {
      $gender = $genderGuesser->guessGender($this->formValues['fullname'], $ip);
    } catch (Exception $e) {
      $gender = 'Error occured, no detection possible.';
    }

    // Message in HTML.
    $text = '<p>Dear Bram,</p>
    <p>A message was send through your contact form. You can read all about it down here.</p>
    <p><strong>Message:</strong><br />
    ' . nl2br($this->formValues['message']) . '</p>
    <p><strong>More details:</strong><br />
    Gender: ' . $gender . '<br />
    IP address: ' . $ip . '<br />
    Date and time: ' . date('j F Y - H:i') .'</p>';

    // Check which Mandrill API key we should use.
    if ($environment == 'prod') {
      $sendgrid = new SendGrid($this->sendgridApiProdKey);
    }
    else {
      $sendgrid = new SendGrid($this->sendgridApiTestKey);
    }

    $email = new SendGrid\Email();
    $email->addTo($this->mailTo, $this->mailToName)
      ->setFrom($this->mailFrom)
      ->setFromName($this->formValues['fullname'])
      ->setReplyTo($this->formValues['emailaddress'])
      ->setSubject('Bramtenhove.nl: ' . $this->formValues['fullname'] . ' contacted you')
      ->setHtml($text);

    try {
      $result = $sendgrid->send($email);
      $this->sendResult = 'It was sent successfully, I will reply asap';
    }
    catch(\SendGrid\Exception $e) {
      throw new Exception('Something went wrong, your message could not be send');
    }
  }
}
?>
