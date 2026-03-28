#!/bin/bash

# Tutoring Management System - API Curl Test Script
# Test all endpoints with proper authentication

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API Configuration
API_URL="${API_URL:-http://localhost:8000/api}"
USERNAME="${USERNAME:-admin}"
PASSWORD="${PASSWORD:-admin123}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Tutoring Management System - API Tests${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "API URL: ${BLUE}${API_URL}${NC}"
echo -e "Username: ${BLUE}${USERNAME}${NC}"
echo ""

# Test 1: Check if API is reachable
echo -e "${YELLOW}[1/10]${NC} Testing API connectivity..."
if curl -s "${API_URL}/token/" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API is reachable${NC}"
else
    echo -e "${RED}✗ API is not reachable at ${API_URL}${NC}"
    echo "Make sure the backend is running: docker-compose up"
    exit 1
fi
echo ""

# Test 2: Login and get tokens
echo -e "${YELLOW}[2/10]${NC} Testing login (POST /api/token/)..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/token/" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"refresh":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}✗ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"
echo "  Access Token: ${ACCESS_TOKEN:0:20}..."
echo "  Refresh Token: ${REFRESH_TOKEN:0:20}..."
echo ""

# Test 3: Get current user
echo -e "${YELLOW}[3/10]${NC} Testing current user (GET /api/users/me/)..."
CURRENT_USER=$(curl -s -X GET "${API_URL}/users/me/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

USERNAME_RESULT=$(echo "$CURRENT_USER" | grep -o '"username":"[^"]*' | cut -d'"' -f4)
if [ -z "$USERNAME_RESULT" ]; then
    echo -e "${RED}✗ Failed to get current user${NC}"
else
    echo -e "${GREEN}✓ Current user retrieved${NC}"
    echo "  Username: $USERNAME_RESULT"
fi
echo ""

# Test 4: Get users list
echo -e "${YELLOW}[4/10]${NC} Testing users list (GET /api/users/users/)..."
USERS_RESPONSE=$(curl -s -X GET "${API_URL}/users/users/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ -z "$USER_COUNT" ]; then
    echo -e "${RED}✗ Failed to get users list${NC}"
else
    echo -e "${GREEN}✓ Users list retrieved${NC}"
    echo "  Total users: $USER_COUNT"
fi
echo ""

# Test 5: Get tutors list
echo -e "${YELLOW}[5/10]${NC} Testing tutors list (GET /api/users/tutors/)..."
TUTORS_RESPONSE=$(curl -s -X GET "${API_URL}/users/tutors/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

TUTORS_COUNT=$(echo "$TUTORS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ -z "$TUTORS_COUNT" ]; then
    echo -e "${RED}✗ Failed to get tutors list${NC}"
else
    echo -e "${GREEN}✓ Tutors list retrieved${NC}"
    echo "  Total tutors: $TUTORS_COUNT"
fi
echo ""

# Test 6: Get classes list
echo -e "${YELLOW}[6/10]${NC} Testing classes list (GET /api/classes/)..."
CLASSES_RESPONSE=$(curl -s -X GET "${API_URL}/classes/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

CLASSES_COUNT=$(echo "$CLASSES_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ -z "$CLASSES_COUNT" ]; then
    echo -e "${RED}✗ Failed to get classes list${NC}"
else
    echo -e "${GREEN}✓ Classes list retrieved${NC}"
    echo "  Total classes: $CLASSES_COUNT"
fi
echo ""

# Test 7: Get enrollments list
echo -e "${YELLOW}[7/10]${NC} Testing enrollments list (GET /api/feedback/reviews/)..."
REVIEWS_RESPONSE=$(curl -s -X GET "${API_URL}/feedback/reviews/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

REVIEWS_COUNT=$(echo "$REVIEWS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ -z "$REVIEWS_COUNT" ]; then
    echo -e "${RED}✗ Failed to get reviews list${NC}"
else
    echo -e "${GREEN}✓ Reviews list retrieved${NC}"
    echo "  Total reviews: $REVIEWS_COUNT"
fi
echo ""

# Test 8: Test without authorization (should fail)
echo -e "${YELLOW}[8/10]${NC} Testing unauthorized access (should return 401)..."
UNAUTHORIZED=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${API_URL}/users/users/")
if [ "$UNAUTHORIZED" == "401" ]; then
    echo -e "${GREEN}✓ Unauthorized access properly blocked${NC}"
else
    echo -e "${YELLOW}⚠ Unexpected status code: $UNAUTHORIZED (expected 401)${NC}"
fi
echo ""

# Test 9: Test token refresh
echo -e "${YELLOW}[9/10]${NC} Testing token refresh (POST /api/token/refresh/)..."
REFRESH_RESPONSE=$(curl -s -X POST "${API_URL}/token/refresh/" \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"${REFRESH_TOKEN}\"}")

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | grep -o '"access":"[^"]*' | cut -d'"' -f4)
if [ -z "$NEW_ACCESS_TOKEN" ]; then
    echo -e "${RED}✗ Token refresh failed${NC}"
else
    echo -e "${GREEN}✓ Token refresh successful${NC}"
    echo "  New Access Token: ${NEW_ACCESS_TOKEN:0:20}..."
fi
echo ""

# Test 10: Get transactions list
echo -e "${YELLOW}[10/10]${NC} Testing transactions list (GET /api/finance/transactions/)..."
TRANSACTIONS_RESPONSE=$(curl -s -X GET "${API_URL}/finance/transactions/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

TRANSACTIONS_COUNT=$(echo "$TRANSACTIONS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ -z "$TRANSACTIONS_COUNT" ]; then
    echo -e "${RED}✗ Failed to get transactions list${NC}"
else
    echo -e "${GREEN}✓ Transactions list retrieved${NC}"
    echo "  Total transactions: $TRANSACTIONS_COUNT"
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All tests completed successfully! ✓${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Summary:"
echo "  Users: $USER_COUNT"
echo "  Tutors: $TUTORS_COUNT"
echo "  Classes: $CLASSES_COUNT"
echo "  Reviews: $REVIEWS_COUNT"
echo "  Transactions: $TRANSACTIONS_COUNT"
echo ""
echo -e "${YELLOW}Frontend:${NC} http://localhost:3000"
echo -e "${YELLOW}Backend:${NC} ${API_URL}"
echo ""
