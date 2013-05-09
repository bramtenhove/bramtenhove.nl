<?php
/**
 * Form submit function
 */

// Define constants.
define("SITE_EMAIL", "info@bramtenhove.nl");
define("OWNER_EMAIL", "bram@bramtenhove.nl");

// Form was submitted.
if (!empty($_POST['submit'])) {
  // Check for errors.
  $errors = validateFormInput($_POST);

  // If we encountered errors reconstruct the form with the error messages.
  if (!empty($errors)) {
    constructForm($errors, $_POST);
  }
  else { // Else we'll send the e-mail.
    sendEmail($_POST);
  }
}
else { // Form has to build for the first time.
  constructForm();
}

/**
 * This function validates the users input for empty required fields and an incorrect e-mailaddress.
 * 
 * @return array().
 *   Array is empty if there were no errors found.
 *   Array contains named errors if errors were found.
 */
function validateFormInput($input) {
  $errors = array();

  // Check for empty name.
  if (empty($_POST['name'])) {
    $errors['name'] = 'Vult u alstublieft uw naam in.';
  }

  // Check for empty e-mailaddress.
  if (empty($_POST['email'])) {
    $errors['email'] = 'Vult u alstublieft uw e-mailadres in.';
  }
  else { // If the e-mailaddress was not empty we still want to check an invalid e-mailaddress.
    if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) === FALSE) {
      $errors['email'] = 'Uw e-mailadres is niet correct.';
    }
  }

  return $errors;
}

/**
 * On successful user submission of the form we will send the site owner an e-mail.
 */
function sendEmail($input) {
  // Build the variables we need for sending the e-mail.
  $subject = 'Contactformulier bramtenhove.nl';

  $message = '<html><body>';
  $message .= '<h3>Bericht ontvangen via het contactformulier op bramtenhove.nl</h3>';
  $message .= '<table><tr><td style="font-weight: bold; vertical-align: top;">Naam</td><td class="content">'.htmlspecialchars($input['name']).'</td></tr>';
  $message .= '<tr><td style="font-weight: bold; vertical-align: top;">E-mailadres</td><td class="content">'.$input['email'].'</td></tr>';
  $message .= '<tr><td style="font-weight: bold; vertical-align: top;">Bericht</td><td class="content">'.nl2br(htmlspecialchars($input['message'])).'</td></tr></table>';
  $message .= '<p>Dit is een automatisch verzonden bericht.</p>';
  $message .= '</body></html>';
  
  $headers = 'From: '.htmlspecialchars($input['name']).' <'.SITE_MAIL.'>'."\r\n" .
             'Reply-To: '.$input['email']."\r\n" .
             'X-Mailer: bramtenhove.nl'."\r\n" .
             'MIME-Version: 1.0'."\r\n" .
             'Content-Type: text/html; charset=ISO-8859-1'."\r\n";

  // Send mail to the owner.
  mail(OWNER_EMAIL, $subject, $message, $headers);
?>
  <p>Hartelijk dank voor uw bericht. Ik neem zo spoedig mogelijk contact met u op.</p>
<?php
}

/**
 * Constructs the form.
 * 
 * 
 */
function constructForm($errors = NULL, $input = NULL) {
  ?>
        <form name="contact" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
          <div class="input-item">
            <?php echo (!empty($input['name']) ? '' : '<label for="name">Uw naam</label>'); ?>
            <input id="name" type="text" name="name" required placeholder="Uw naam" <?php echo (!empty($input['name']) ? 'value="'.$input['name'].'"' : ''); ?> />
            <?php echo (!empty($errors['name']) ? '<span class="error">'. $errors['name'] .'</span>' : ''); ?>
          </div>

          <div class="input-item">
            <?php echo (!empty($input['email']) ? '' : '<label for="email">Uw e-mailadres</label>'); ?>
            <input id="email" type="email" name="email" required placeholder="Uw e-mailadres" <?php echo (!empty($input['email']) ? 'value="'.$input['email'].'"' : ''); ?> />
            <?php echo (!empty($errors['email']) ? '<span class="error">'. $errors['email'] .'</span>' : ''); ?>
          </div>

          <div class="input-item">
            <?php echo (!empty($input['message']) ? '' : '<label for="message">Uw bericht</label>'); ?>
            <textarea id="message" name="message" placeholder="Uw bericht"><?php echo (!empty($input['message']) ? $input['message'] : ''); ?></textarea>
          </div>

          <input type="submit" value="Neem contact op" name="submit" />
        </form>
  <?php
}

?>