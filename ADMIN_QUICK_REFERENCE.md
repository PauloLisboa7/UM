# Admin Features Quick Reference

## 🎯 What's New in Admin Panel

4 new management sections have been added to allow admins to manage all user-facing features:

## 📊 Admin Panel Tabs

### 1️⃣ **🚨 Gerenciar Avisos** 
Create and manage city-wide alerts that all users see.
- **Add alerts** with title, description, type, and status
- **Edit** existing alerts
- **Delete** outdated alerts
- **View** all alerts in card format with badges

**Alert Types:** Trânsito 🚦 | Energia ⚡ | Coleta ♻️ | Manutenção 🔧
**Statuses:** Urgente (Red) | Alerta (Orange) | Aviso (Yellow) | Informação (Blue)

---

### 2️⃣ **📜 Histórico de Usuários**
View all user complaints with detailed information.
- **Search** by user name or email
- **Filter** by status (Pendente, Em Andamento, Resolvida, Rejeitada)
- **Filter** by neighborhood
- **View** detailed information by expanding each complaint
- **See** statistics: Total, Pending, In Progress, Resolved

**Data shown:** User name, email, neighborhood, status, days since submitted, attached photos

---

### 3️⃣ **⚙️ Configurações**
Manage user notification preferences globally.
- **View** all user notification settings
- **Edit** which alert types each user receives
- **Toggle** neighborhood-only alerts
- **Adjust** coverage radius (100m-1000m)
- **Delete** user settings if needed

**Coverage Modes:**
- Full city alerts
- Only neighborhood alerts (within selected radius)

**Alert Types:** Trânsito 🚦 | Climático 🌤️ | Coleta ♻️ | Manutenção 🔧

---

### 4️⃣ **📍 Alertas por Bairro**
Create and manage neighborhood-specific alerts.
- **Create** alerts for specific neighborhoods
- **Edit** neighborhood alert details
- **Delete** neighborhood alerts
- **Filter** alerts by neighborhood
- **View** statistics: Alerts per neighborhood

**Neighborhoods:** Centro | Praia Grande | Ponta da Areia | Calhau | São Francisco | Liberdade | Bacanga | Vila Passos | Cohafama | Bequimão

---

## 🔧 API Endpoints (for developers)

### Avisos
```
GET    /api/admin/avisos          # List all alerts
POST   /api/admin/avisos          # Create new alert
PUT    /api/admin/avisos/:id      # Update alert
DELETE /api/admin/avisos/:id      # Delete alert
```

### Configurações
```
GET    /api/admin/configuracoes-notificacao              # List all settings
PUT    /api/admin/configuracoes-notificacao/:usuarioId   # Update user settings
DELETE /api/admin/configuracoes-notificacao/:usuarioId   # Delete user settings
```

### Alertas por Bairro
```
GET    /api/admin/alertas-bairro      # List all neighborhood alerts
POST   /api/admin/alertas-bairro      # Create neighborhood alert
PUT    /api/admin/alertas-bairro/:id  # Update neighborhood alert
DELETE /api/admin/alertas-bairro/:id  # Delete neighborhood alert
```

---

## 🗄️ Database Tables

### avisos
- Stores all city-wide alerts
- Fields: titulo, descricao, tipo, status, localidade
- Indexed by: tipo, status

### configuracoes_notificacao
- Stores user notification preferences
- Fields: usuario_id, tipos_alerta (JSON array), apenas_bairro, bairro, raio
- Indexed by: usuario_id (unique)

### alertas_bairro
- Stores neighborhood-specific alerts
- Fields: bairro, titulo, descricao, tipo, localidade_especifica
- Indexed by: bairro, tipo

---

## ✅ Security

All admin endpoints require:
1. ✅ Valid JWT token (authentication)
2. ✅ User role = 'admin' (authorization)

Only users logged in as admin can access these features.

---

## 📝 Setup Instructions

### Step 1: Create Database Tables
```bash
cd backend
node setup-admin-tables.js
```

### Step 2: Restart Backend
```bash
# Kill existing server (Ctrl+C)
npm start
```

### Step 3: Access Admin Panel
1. Login with: `clean7` / `cleanwork7`
2. Navigate to Admin Panel
3. See new tabs in navigation

---

## 🧪 Testing Checklist

- [ ] Login as admin (clean7/cleanwork7)
- [ ] Navigate to each new tab
- [ ] Create a test alert in "Gerenciar Avisos"
- [ ] Edit the alert
- [ ] Delete the alert
- [ ] View user history in "Histórico de Usuários"
- [ ] Edit a user's notification settings in "Configurações"
- [ ] Create a neighborhood alert in "Alertas por Bairro"
- [ ] Refresh page to verify data persists
- [ ] Logout and login again to confirm persistence

---

## 🎨 UI/UX Features

✅ Consistent orange accent color (#FF8C00)
✅ Color-coded status badges
✅ Expandable/collapsible sections
✅ Search and filter functionality
✅ Real-time statistics
✅ Form validation with error messages
✅ Success notifications
✅ Hover effects on interactive elements
✅ Responsive grid layouts
✅ Mobile-friendly design

---

## 📞 Need Help?

All endpoints are protected with:
- `authMiddleware` - Validates JWT token
- `adminMiddleware` - Checks user role = 'admin'

Frontend components handle:
- Error display (red alert boxes)
- Success messages (green confirmations)
- Loading states
- Empty states (no data)

---

## 🚀 Next Steps

1. Run database setup script
2. Start backend server
3. Start frontend server
4. Login with admin credentials
5. Test each management section
6. Create sample data for testing
7. Verify changes persist in database

**Everything is ready to use!** 🎉
