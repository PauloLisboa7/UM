#!/bin/bash
# Simple test script for Supabase registration/login

API_URL="http://localhost:5000/api"
USERNAME="testuser_$(date +%s)"
EMAIL="test_$(date +%s)@example.com"
PASSWORD="senha123"

echo "=============================="
echo "TESTE DE CADASTRO"
echo "=============================="
echo ""
echo "📝 Cadastrando usuário: $USERNAME"
echo ""

# Test registration
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "✅ Resposta do cadastro:"
echo "$REGISTER_RESPONSE" | jq . 2>/dev/null || echo "$REGISTER_RESPONSE"

echo ""
echo "=============================="
echo "TESTE DE LOGIN"
echo "=============================="
echo ""
echo "🔑 Fazendo login com: $USERNAME"
echo ""

# Test login
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "✅ Resposta do login:"
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"

echo ""
echo "=============================="
echo "Teste concluído!"
echo "=============================="
