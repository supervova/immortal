<?php

/**
 * Главный файл приложения
 *
 * Этот файл является точкой входа в приложение. Он загружает все необходимые
 * зависимости, настраивает окружение и запускает приложение.
 *
 * PHP version 8.1
 *
 * @category Application
 * @package  EchoImmortal
 * @author   Vladimir Nikishin <vladimir@nikishin.dev>
 * @license  MIT License
 * @link     https://echo.im
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
// Загрузка переменных окружения из .env.
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . DIRECTORY_SEPARATOR . '..');
$dotenv->load();

// Настройка Twig
$loader = new FilesystemLoader(__DIR__ . DIRECTORY_SEPARATOR . '../src/templates');
$twig   = new Environment(
    $loader,
    [
        'cache' => __DIR__ . DIRECTORY_SEPARATOR . '../cache',
        'debug' => $_ENV['APP_DEBUG'] === 'true',
    ]
);

// Рендеринг главной страницы
echo $twig->render(
    'index.twig',
    [
        'title'   => 'Home Page',
        'content' => 'Welcome to the homepage!',
    ]
);
