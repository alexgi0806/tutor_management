#!/bin/bash

# Simple Quick Curl Test - Copy and paste each command into your terminal
# Make sure the backend is running: docker-compose up

echo \"=== Tutoring Management System - Quick Curl Tests ===\"
echo \"\"

# Get token
echo \"[1] Getting authentication token...\"
echo \"\"
echo \"curl -X POST http://localhost:8000/api/token/\"
echo \"  -H 'Content-Type: application/json'\"
echo \"  -d '{\\\"username\\\":\\\"admin\\\",\\\"password\\\":\\\"admin123\\\"}'\"
echo \"\"
echo \"Save the 'access' token from the response\"
echo \"\"

# Test endpoints
echo \"[2] Get users (replace TOKEN with your access token):\"
echo \"\"
echo \"curl -H 'Authorization: Bearer TOKEN' http://localhost:8000/api/users/users/\"
echo \"\"

echo \"[3] Get tutors:\"
echo \"\"
echo \"curl -H 'Authorization: Bearer TOKEN' http://localhost:8000/api/users/tutors/\"
echo \"\"

echo \"[4] Get classes:\"
echo \"\"
echo \"curl -H 'Authorization: Bearer TOKEN' http://localhost:8000/api/classes/\"
echo \"\"

echo \"[5] Get reviews:\"
echo \"\"
echo \"curl -H 'Authorization: Bearer TOKEN' http://localhost:8000/api/feedback/reviews/\"
echo \"\"

echo \"[6] Get transactions:\"
echo \"\"
echo \"curl -H 'Authorization: Bearer TOKEN' http://localhost:8000/api/finance/transactions/\"
echo \"\"

echo \"[7] Test unauthorized access (should return 401):\"
echo \"\"
echo \"curl http://localhost:8000/api/users/users/\"
echo \"\"

echo \"[8] Refresh token:\"
echo \"\"
echo \"curl -X POST http://localhost:8000/api/token/refresh/\"
echo \"  -H 'Content-Type: application/json'\"
echo \"  -d '{\\\"refresh\\\":\\\"<your-refresh-token>\\\"}'\"
echo \"\"
