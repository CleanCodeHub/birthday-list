<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// GET - Fetch all RSVPs
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM rsvps ORDER BY created_at DESC');
    $rsvps = $stmt->fetchAll();
    echo json_encode($rsvps);
    exit();
}

// POST - Create new RSVP
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name = $data['name'] ?? '';
    $adults = $data['adults'] ?? 0;
    $kids = $data['kids'] ?? 0;
    $comment = $data['comment'] ?? null;

    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name is required']);
        exit();
    }

    $id = generateUUID();

    $stmt = $pdo->prepare('INSERT INTO rsvps (id, name, adults, kids, comment) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$id, $name, $adults, $kids, $comment]);

    echo json_encode(['success' => true, 'id' => $id]);
    exit();
}

// PUT - Update RSVP (Admin only)
if ($method === 'PUT') {
    verifyAdmin();

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    $name = $data['name'] ?? '';
    $adults = $data['adults'] ?? 0;
    $kids = $data['kids'] ?? 0;
    $comment = $data['comment'] ?? null;

    if (empty($id) || empty($name)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID and name are required']);
        exit();
    }

    $stmt = $pdo->prepare('UPDATE rsvps SET name = ?, adults = ?, kids = ?, comment = ? WHERE id = ?');
    $stmt->execute([$name, $adults, $kids, $comment, $id]);

    echo json_encode(['success' => true]);
    exit();
}

// DELETE - Delete RSVP (Admin only)
if ($method === 'DELETE') {
    verifyAdmin();

    $id = $_GET['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit();
    }

    // Special case: delete all
    if ($id === 'all') {
        $pdo->exec('DELETE FROM rsvps');
        echo json_encode(['success' => true]);
        exit();
    }

    $stmt = $pdo->prepare('DELETE FROM rsvps WHERE id = ?');
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
