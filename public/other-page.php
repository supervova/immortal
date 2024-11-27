<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . '../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . DIRECTORY_SEPARATOR . '..');
$dotenv->load();

$loader = new FilesystemLoader(__DIR__ . DIRECTORY_SEPARATOR . '../src/templates');
$twig = new Environment($loader, [
    'cache' => __DIR__ . DIRECTORY_SEPARATOR . '../cache',
    'debug' => $_ENV['APP_DEBUG'] === 'true'
]);

echo $twig->render('other-page.twig', [
    'title' => 'Other Page',
    'content' => 'This is another page in our site!'
]);
