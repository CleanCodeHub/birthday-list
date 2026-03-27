<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// POST - Login
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit();
    }

    $stmt = $pdo->prepare('SELECT * FROM admin_users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit();
    }

    // Create session
    session_start();
    $token = bin2hex(random_bytes(32));
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['token'] = $token;

    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email']
        ]
    ]);
    exit();
}

// DELETE - Logout
if ($method === 'DELETE') {
    session_start();
    session_destroy();
    echo json_encode(['success' => true]);
    exit();
}

// GET - Check session
if ($method === 'GET') {
    session_start();
    if (isset($_SESSION['admin_id'])) {
        echo json_encode([
            'authenticated' => true,
            'token' => $_SESSION['token']
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
