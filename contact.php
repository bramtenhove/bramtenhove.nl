<?php
$errors = array();

// If the form was submitted, let's validate and send stuff.
if (isset($_POST['submit'])) {
  require_once 'app/contactform.php';

  $form_handler = new FormHandler();
  $form_handler->setFormValues($_POST);

  // Try to validate the form.
  try {
    $form_handler->validateForm();
  } catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
  }

  // Get any errors.
  $errors = $form_handler->getErrors();

  // If there are no errors, try sending the e-mail.
  if (empty($errors)) {
    try {
      $form_handler->sendMail();

      $send_result = $form_handler->getSendResult();

      // Clear the form values.
      $_POST = array();
    } catch (Exception $e) {
      $send_error = 'Your message could not be send, please try again later';
    }
  }
}
?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Contact me | Bram ten Hove</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-26432716-1', 'bramtenhove.nl');
      ga('require', 'displayfeatures');
      ga('send', 'pageview');
    </script>
  </head>
  <body>
    <!--[if lt IE 7]>
      <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
    <![endif]-->

    <div id="page">

      <header id="header" role="header">
        <div class="wrapper clearfix">
          <div id="logo">
            <a href="/"></a>
          </div>

          <div class="navigation">
            <nav id="main-menu" role="navigation">
              <div id="pull-menu"></div>
              <ul class="menu clearfix">
                <li><a href="/">Blog</a></li>
                <li><a href="/contact" class="active">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <?php if (isset($send_result) && !empty($send_result)): ?>
      <div id="expose" role="banner" class="success">
        <div class="wrapper">
          <h3 class="expose-title">Thanks for your message!</h3>
          <h3 class="expose-subtitle"><?php echo $send_result; ?></h3>
        </div>
      </div>
      <?php elseif (isset($send_error) && !empty($send_error)): ?>
      <div id="expose" role="banner" class="error">
        <div class="wrapper">
          <h3 class="expose-title">An error occured!</h3>
          <h3 class="expose-subtitle"><?php echo $send_error; ?></h3>
        </div>
      </div>
      <?php elseif (isset($errors) && !empty($errors)): ?>
      <div id="expose" role="banner" class="error">
        <div class="wrapper">
          <h3 class="expose-title">Couldn't send your message</h3>
          <h3 class="expose-subtitle">Please check what you typed in the form!</h3>
        </div>
      </div>
      <?php else: ?>
      <div id="expose" role="banner">
        <div class="wrapper">
          <h3 class="expose-title">Send me a message</h3>
          <h3 class="expose-subtitle">Let's come in contact with each other</h3>
        </div>
      </div>
      <?php endif;?>

      <div id="main" class="column wrapper">

        <div id="main-content" role="main">
          <div class="container">
            <h1 class="content-title">Contact me</h1>
            <p>Feel free to drop me a line using the form below.</p>

            <p>You can also take a look at my <a href="http://linkedin.com/in/bramth" rel="nofollow">LinkedIn</a> or find me on <a href="http://twitter.com/bramtenhove" rel="nofollow">Twitter</a>.</p>

            <form class="inline" action="/contact" method="post">
              <label for="fullname">Name</label>
              <input type="text" name="fullname" <?php echo isset($errors['fullname']) ? 'class="error"' : '' ?> placeholder="Let me know your name" value="<?php echo isset($_POST['fullname']) ? $_POST['fullname'] : '' ?>" />

              <label for="emailaddress">E-mail address</label>
              <input type="text" name="emailaddress" <?php echo isset($errors['emailaddress']) ? 'class="error"' : '' ?> placeholder="So I can respond to your message" value="<?php echo isset($_POST['emailaddress']) ? $_POST['emailaddress'] : '' ?>" />

              <label for="message">Message</label>
              <textarea name="message" <?php echo isset($errors['message']) ? 'class="error"' : '' ?> placeholder="Type in your message"><?php echo isset($_POST['message']) ? $_POST['message'] : '' ?></textarea>

              <input type="submit" name="submit" value="Send!" />
            </form>
            </ul>
          </div>
        </div>

        <div class="separator"></div>

        <aside id="sidebar-right" role="complementary">
          <div class="block container">
            <h2 class="block-title">Who are you contacting?</h2>
            <img class="full-width" src="/public/images/me.jpg" />
            <p>My name is Bram ten Hove. I am a passionate webdeveloper that tries to stay curious and learn new things. Drupal, JavaScript, privacy, security, performance.</p>

            <p>I have quite a lot of experience using PHP, jQuery and the opensource CMS <a href="http://drupal.org">Drupal</a>.</p>
          </div>
        </aside>

      </div>

      <div id="footer" role="footer">
        <div class="wrapper">
          <img class="copyright" src="/public/images/assets/copyright.png" />
        </div>
      </div>

    </div>

    <link href="/public/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
    <link href="http://fonts.googleapis.com/css?family=Exo+2:500,100italic,700italic" rel="stylesheet" type="text/css" />

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="/public/javascripts/vendor/jquery-1.11.1.min.js"><\/script>')</script>
    <script src="/public/javascripts/main.js"></script>
  </body>
</html>
