# Admin Management Features - Implementation Guide

## Overview

Implemented a complete admin management system that allows administrators to manage all user-facing features from a centralized admin panel.

## New Components Created

### 1. **AdminGerenciarAvisos.jsx** 
- **Location**: `frontend/src/components/AdminGerenciarAvisos.jsx`
- **Purpose**: Manage city alerts and warnings
- **Features**:
  - Create new alerts with title, description, type, and status
  - Edit existing alerts
  - Delete alerts
  - View all alerts in card format
  - Alert types: Trânsito, Energia, Coleta, Manutenção
  - Alert status: Urgente, Alerta, Aviso, Informação

### 2. **AdminHistoricoUsuarios.jsx**
- **Location**: `frontend/src/components/AdminHistoricoUsuarios.jsx`
- **Purpose**: View and filter all user submissions
- **Features**:
  - List all user complaints with expandable details
  - Filter by status (Pendentes, Em Andamento, Resolvidas, Rejeitadas)
  - Filter by neighborhood
  - Search by user name or email
  - Statistics dashboard showing totals by status
  - Display days elapsed since submission
  - View attached photos

### 3. **AdminConfiguracoes.jsx**
- **Location**: `frontend/src/components/AdminConfiguracoes.jsx`
- **Purpose**: Manage user notification settings
- **Features**:
  - View all user notification preferences
  - Edit notification types each user receives
  - Toggle neighborhood-only alerts
  - Adjust notification radius (100m-1000m)
  - Statistics showing user coverage
  - Search users by name or email
  - Delete user notification settings

### 4. **AdminBairros.jsx**
- **Location**: `frontend/src/components/AdminBairros.jsx`
- **Purpose**: Manage neighborhood-specific alerts
- **Features**:
  - Create alerts for specific neighborhoods
  - Specify alert type and location details
  - Edit neighborhood alerts
  - Delete alerts
  - Filter alerts by neighborhood
  - Statistics showing alert count by neighborhood

## Backend API Endpoints

### Avisos (Alerts)
- `GET /api/admin/avisos` - List all alerts
- `POST /api/admin/avisos` - Create new alert
- `PUT /api/admin/avisos/:id` - Update alert
- `DELETE /api/admin/avisos/:id` - Delete alert

### Configurações (Notification Settings)
- `GET /api/admin/configuracoes-notificacao` - List all user settings
- `PUT /api/admin/configuracoes-notificacao/:usuarioId` - Update user settings
- `DELETE /api/admin/configuracoes-notificacao/:usuarioId` - Delete user settings

### Alertas por Bairro (Neighborhood Alerts)
- `GET /api/admin/alertas-bairro` - List all neighborhood alerts
- `POST /api/admin/alertas-bairro` - Create neighborhood alert
- `PUT /api/admin/alertas-bairro/:id` - Update neighborhood alert
- `DELETE /api/admin/alertas-bairro/:id` - Delete neighborhood alert

## Database Tables

### 1. `avisos`
```sql
CREATE TABLE avisos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'trânsito',
  status VARCHAR(50) DEFAULT 'aviso',
  localidade VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `configuracoes_notificacao`
```sql
CREATE TABLE configuracoes_notificacao (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipos_alerta JSONB DEFAULT '[]',
  apenas_bairro BOOLEAN DEFAULT FALSE,
  bairro VARCHAR(255),
  raio INTEGER DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(usuario_id)
);
```

### 3. `alertas_bairro`
```sql
CREATE TABLE alertas_bairro (
  id SERIAL PRIMARY KEY,
  bairro VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'trânsito',
  localidade_especifica VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Admin Panel Integration

The admin panel now has 6 tabs:
1. **📋 Solicitações** - Manage complaint submissions
2. **📊 Acompanhamento em Tempo Real** - Real-time analytics
3. **🚨 Gerenciar Avisos** - Manage city alerts (NEW)
4. **📜 Histórico de Usuários** - View user history (NEW)
5. **⚙️ Configurações** - Manage notification settings (NEW)
6. **📍 Alertas por Bairro** - Manage neighborhood alerts (NEW)

## Setup Instructions

### 1. Create Database Tables
Run the setup script:
```bash
cd backend
node setup-admin-tables.js
```

Or execute the SQL directly:
```bash
psql -d your_database -f create-admin-tables.sql
```

### 2. Verify Backend Routes
The backend server now includes:
- New route: `POST /api/admin/*` routes in `backend/src/routes/adminRoutes.js`
- Route imported in `backend/src/server.js`
- Admin middleware applied to all admin endpoints

### 3. Verify Frontend Components
All admin components are imported in `AdminPanel.jsx` and rendered in their respective tabs.

## Security Notes

- All admin endpoints require authentication (`authMiddleware`)
- All admin endpoints require admin role (`adminMiddleware`)
- The admin role check uses `role === 'admin'`
- User can only access with valid JWT token

## Testing Credentials

- **Admin Account**: email: `clean7`, password: `cleanwork7`
- **Regular User**: email: `user`, password: `user1`

## Usage Flow

1. **Admin Login**: Login with admin credentials
2. **Navigate to Admin Panel**: Click on admin panel link
3. **Select Management Tab**: Choose which feature to manage
4. **Perform CRUD Operations**: Create, read, update, or delete items
5. **Changes saved to database**: All changes are persisted to PostgreSQL

## Styling

All components use consistent styling:
- Orange accent color: `#FF8C00`
- Green for success: `#4CAF50`
- Blue for info: `#2196F3`
- Red for danger: `#f44336`
- Responsive grid layouts
- Hover effects on interactive elements

## Features Summary

✅ Complete CRUD operations for all features
✅ Advanced filtering and search
✅ Real-time statistics
✅ Admin-only access control
✅ User-friendly interface
✅ Expandable/collapsible sections
✅ Form validation
✅ Success/error messages
✅ Responsive design
✅ Database persistence

## Files Modified

- `frontend/src/components/AdminPanel.jsx` - Added new tabs and imports
- `backend/src/server.js` - Added admin routes import
- `backend/src/middleware/authMiddleware.js` - Added adminMiddleware export
- `backend/src/routes/adminRoutes.js` - NEW - All admin API endpoints

## Files Created

- `frontend/src/components/AdminGerenciarAvisos.jsx` - NEW
- `frontend/src/components/AdminHistoricoUsuarios.jsx` - NEW
- `frontend/src/components/AdminConfiguracoes.jsx` - NEW
- `frontend/src/components/AdminBairros.jsx` - NEW
- `backend/setup-admin-tables.js` - NEW - Database setup script
- `backend/create-admin-tables.sql` - NEW - SQL migration file

## Next Steps

1. Run the database setup script
2. Start the backend server
3. Start the frontend development server
4. Login with admin credentials
5. Navigate to the admin panel
6. Test CRUD operations in each management section
