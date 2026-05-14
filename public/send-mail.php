<?php

declare(strict_types=1);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => 'Method not allowed.',
    ]);
    exit;
}

$apiBase = trim((string)(getenv('JOTFORM_API_BASE') ?: ''));
$apiKey = trim((string)(getenv('JOTFORM_API_KEY') ?: ''));
$formId = trim((string)(getenv('JOTFORM_FORM_ID') ?: ''));
$fullNameQuestionId = trim((string)(getenv('JOTFORM_FULL_NAME_QID') ?: ''));
$emailQuestionId = trim((string)(getenv('JOTFORM_EMAIL_QID') ?: ''));
$messageQuestionId = trim((string)(getenv('JOTFORM_MESSAGE_QID') ?: ''));

$requiredConfig = [
    'JOTFORM_API_BASE' => $apiBase,
    'JOTFORM_API_KEY' => $apiKey,
    'JOTFORM_FORM_ID' => $formId,
    'JOTFORM_FULL_NAME_QID' => $fullNameQuestionId,
    'JOTFORM_EMAIL_QID' => $emailQuestionId,
    'JOTFORM_MESSAGE_QID' => $messageQuestionId,
];

$missingConfig = array_keys(array_filter(
    $requiredConfig,
    static fn(string $value): bool => $value === ''
));

if ($missingConfig !== []) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Required Jotform configuration is missing: ' . implode(', ', $missingConfig) . '.',
    ]);
    exit;
}

$apiBase = rtrim($apiBase, '/');

$fullName = trim((string)($_POST['fullName'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($fullName === '' || $email === '') {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Full name and email are required.',
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Please enter a valid email address.',
    ]);
    exit;
}

$payload = [
    sprintf('submission[%s]', $fullNameQuestionId) => $fullName,
    sprintf('submission[%s]', $emailQuestionId) => $email,
    sprintf('submission[%s]', $messageQuestionId) => $message,
];

$endpoint = sprintf('%s/form/%s/submissions?apiKey=%s', $apiBase, rawurlencode($formId), rawurlencode($apiKey));

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_TIMEOUT => 20,
]);

$responseBody = curl_exec($ch);
$curlError = curl_error($ch);
$httpStatus = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($responseBody === false) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => $curlError !== '' ? $curlError : 'Unable to reach Jotform.',
    ]);
    exit;
}

$decoded = json_decode($responseBody, true);
$isSuccess =
    $httpStatus >= 200 &&
    $httpStatus < 300 &&
    is_array($decoded) &&
    (($decoded['responseCode'] ?? null) === 200);

if (!$isSuccess) {
    http_response_code($httpStatus >= 400 ? $httpStatus : 502);
    $messageText = null;

    if (is_array($decoded)) {
        $messageText = $decoded['message'] ?? null;
        if (is_array($messageText)) {
            $messageText = implode(' ', array_map('strval', $messageText));
        }
    }

    echo json_encode([
        'ok' => false,
        'error' => $messageText ?: 'Unable to send your message. Please try again later.',
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'message' => 'Message sent successfully.',
]);
