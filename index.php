<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypt tool</title>
    <link rel="icon" href="/assets/shield-halved-solid.svg">
    <link rel="stylesheet" href="/assets/bootstrap.min.css">
    <link rel="stylesheet" href="global.css">
    <link rel="stylesheet" href="pattern.css">
    <link rel="stylesheet" href="font.css">
    <script src="assets/bootstrap.bundle.min.js"></script>
    <!-- <script src="https://kit.fontawesome.com/2a6c7edf30.js" crossorigin="anonymous"></script> -->
    <style>
        textarea::placeholder {
            color: red;
            opacity: 1;
        }

        #option {
            border: 1px solid #f0f0f0;
        }
    </style>
</head>

<body>
    <div class="header mt-4 " style="">
        <p class="h3 fw-bold" style="">TEAM<span style="color: var(--blue);">FOUR</span></p>
    </div>

    <div class="main mt-5">
        <div class="top d-flex flex-column text-center fw-bold " style="">
            <p class="bold" style="font-size: 5rem; margin: -20px 0;">SECURITY FIRST</p>
            <p class="bold" style="font-size: 5rem; margin: -20px 0;  color: var(--blue);">ENCRYPT <span class="bold">NOW</span></p>
        </div>
        <div class="mid d-flex mt-5 ">
            <div class="col-4 px-1 text-center" style="">
                <p class="bold mb-0" style=" font-size: 4rem; color: var(--blue);">64<span class="fw-normal " style="color: var(--blue);">%</span></p>
                <p class="" style="color: var(--fade);">Approximately 64% of American adults have been victims of a data
                    breach. Encryption helps prevent unauthorized access to sensitive data.</p>
            </div>

            <div class="col-4 px-1 text-center" style="">
                <p class="bold mb-0" style=" font-size: 4rem; color: var(--blue);">90<span class="fw-normal " style="color: var(--blue);">%</span></p>
                <p class="" style="color: var(--fade);">over 90% of internet traffic is encrypted. Encryption helps
                    protect communications over the internet from interception and data theft.</p>
            </div>

            <div class="col-4 px-1 text-center" style="">
                <p class="bold mb-0" style=" font-size: 4rem; color: var(--blue);">83<span class="fw-normal " style="color: var(--blue);">%</span></p>
                <p class="" style="color: var(--fade);">83% of consumers are more likely to use services from companies
                    that protect their data with encryption.</p>
            </div>
        </div>
        <div class="content" style="background-color: rgb(0, 0, 0); padding: 0 20%;">
            <div class="d-flex flex-column">
                <span class="fw-bold h5 align-self-center ">Start Encrypt</span>

                <form action="" method="post">
                    <div class="form-group p-2 ">
                        <textarea type="text" class="form-control mb-2 text-light" style="background-color: black;" rows="3" name="plaintext" placeholder="Input plaintext"></textarea>

                        <input class="form-control mb-2 text-light" style="background-color: black;" rows="1" name="key" placeholder="Key"></input>
                    </div>

                    <div class="d-flex justify-content-center">

                        <select class="btn text-light form-select w-auto  " id="option" aria-label="Default select example">
                            <option class="bg-dark " selected>Mode</option>
                            <option class="bg-dark " value="1">Encrypt</option>
                            <option class="bg-dark " value="2">Decrypt</option>
                        </select>

                        <input class="btn text-light mx-2 " type="submit" style="background-color: var(--blue);" value="Encrypt">
                    </div>

                    <div class="form-group p-2 ">
                        <textarea class="form-control mb-2 text-light" style="background-color: black;" rows="3" name="output" placeholder="Output"><?php echo isset($output) ? htmlspecialchars($output) : ''; ?></textarea>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="footer text-center d-flex align-items-center justify-content-center " style="height:50px ; background-color: black;">
        <span class="" style="font-size: small;">Kriptografi dan Keamanan Informasi | copyright by Kelompok 4</span>
    </div>
    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        require_once "salsa2.php";

    //     $plaintext = isset($_POST['plaintext']) ? $_POST['plaintext'] : '';
    //     $key = isset($_POST['key']) ? $_POST['key'] : '';
    //     $mode = isset($_POST['mode']) ? $_POST['mode'] : '';

    //     if ($mode == 1) {
    //         $output = salsa20_encrypt($plaintext, $key, "your_nonce_here");
    //     } elseif ($mode == 2) {
    //         $output = salsa20_decrypt($plaintext, $key, "your_nonce_here");
    //     }
    // }
    ?>
</body>

</html>