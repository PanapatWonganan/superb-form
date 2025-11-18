# แผนการพัฒนาระบบ Backend + Admin Dashboard (CRM)

## ภาพรวมโปรเจค
ระบบ CRM สำหรับเก็บข้อมูลผู้กรอกฟอร์มและจัดการกระบวนการขาย โดยใช้ Laravel เป็น Backend API และ Filament เป็น Admin Dashboard UI

---

## Phase 1: การเตรียมและออกแบบระบบ

### 1. ออกแบบ Database Schema

#### ตาราง `leads` (ข้อมูลผู้กรอกฟอร์ม)
```sql
- id (primary key)
- name (ชื่อ-นามสกุล)
- email
- phone
- company (ชื่อบริษัท - optional)
- position (ตำแหน่ง - optional)
- source (แหล่งที่มา: website_form, facebook, line, etc.)
- status_id (foreign key -> lead_statuses)
- assigned_to (foreign key -> users)
- estimated_value (มูลค่าโอกาสการขาย)
- form_data (JSON - เก็บข้อมูลอื่นๆ จากฟอร์ม)
- created_at
- updated_at
- deleted_at (soft delete)
```

#### ตาราง `lead_statuses` (สถานะของ Lead)
```sql
- id (primary key)
- name (New, Contacted, Qualified, Negotiation, Won, Lost)
- color (สีแสดงสถานะ)
- order (ลำดับในขั้นตอนการขาย)
- is_active (boolean)
- created_at
- updated_at
```

#### ตาราง `activities` (บันทึกกิจกรรม)
```sql
- id (primary key)
- lead_id (foreign key -> leads)
- user_id (foreign key -> users)
- type (call, email, meeting, note, status_change)
- description (รายละเอียด)
- activity_date
- created_at
- updated_at
```

#### ตาราง `tasks` (งานที่ต้อง Follow-up)
```sql
- id (primary key)
- lead_id (foreign key -> leads)
- assigned_to (foreign key -> users)
- title
- description
- due_date
- priority (low, medium, high)
- status (pending, in_progress, completed)
- created_at
- updated_at
```

#### ตาราง `notes` (บันทึกข้อความ)
```sql
- id (primary key)
- lead_id (foreign key -> leads)
- user_id (foreign key -> users)
- content (ข้อความ)
- is_important (boolean)
- created_at
- updated_at
```

#### ตาราง `users` (ผู้ใช้งานระบบ)
```sql
- id (primary key)
- name
- email
- password
- role (admin, sales_manager, sales)
- is_active (boolean)
- created_at
- updated_at
```

---

## Phase 2: ติดตั้ง Backend (Laravel + Filament)

### 2. ตั้งค่า Laravel Project

```bash
# สร้างโปรเจค Laravel ใหม่
composer create-project laravel/laravel crm-backend

# ติดตั้ง dependencies พื้นฐาน
cd crm-backend
composer require laravel/sanctum
```

### 3. ติดตั้งและตั้งค่า Filament Admin Panel

```bash
# ติดตั้ง Filament
composer require filament/filament:"^3.0"

# ติดตั้ง Filament
php artisan filament:install --panels

# สร้าง admin user
php artisan make:filament-user

# ติดตั้ง plugins เพิ่มเติม (optional)
composer require filament/spatie-laravel-tags-plugin
composer require bezhansalleh/filament-shield  # สำหรับจัดการ permissions
```

---

## Phase 3: สร้าง Database Structure

### 4. สร้าง Migrations และ Models

```bash
# สร้าง migrations
php artisan make:migration create_lead_statuses_table
php artisan make:migration create_leads_table
php artisan make:migration create_activities_table
php artisan make:migration create_tasks_table
php artisan make:migration create_notes_table

# สร้าง models พร้อม factory และ seeder
php artisan make:model LeadStatus -fs
php artisan make:model Lead -fs
php artisan make:model Activity -fs
php artisan make:model Task -fs
php artisan make:model Note -fs

# รัน migrations
php artisan migrate

# รัน seeders
php artisan db:seed
```

#### Model Relationships
```php
// Lead Model
- belongsTo: status, assignedTo (User)
- hasMany: activities, tasks, notes

// Activity Model
- belongsTo: lead, user

// Task Model
- belongsTo: lead, assignedTo (User)

// Note Model
- belongsTo: lead, user
```

---

## Phase 4: พัฒนา API สำหรับรับข้อมูล Form

### 5. API Endpoints

#### Routes (api.php)
```php
Route::middleware('api')->prefix('v1')->group(function () {
    // Public endpoint สำหรับรับข้อมูลจาก form
    Route::post('/leads', [LeadController::class, 'store']);

    // Protected endpoints (ต้อง authenticate)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/leads', [LeadController::class, 'index']);
        Route::get('/leads/{id}', [LeadController::class, 'show']);
        Route::put('/leads/{id}', [LeadController::class, 'update']);
    });
});
```

#### Controller Methods
```php
// LeadController.php
public function store(StoreLeadRequest $request)
{
    // Validation
    // Create lead
    // Send notification
    // Return response
}
```

#### Request Validation
```php
// StoreLeadRequest.php
public function rules()
{
    return [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:leads,email',
        'phone' => 'required|string',
        'company' => 'nullable|string',
        'position' => 'nullable|string',
        'source' => 'nullable|string',
        'form_data' => 'nullable|array',
    ];
}
```

---

## Phase 5: สร้าง CRM Features ใน Filament

### 6. สร้าง Filament Resources

```bash
# สร้าง resources
php artisan make:filament-resource Lead --generate
php artisan make:filament-resource LeadStatus --generate --simple
php artisan make:filament-resource Activity --generate
php artisan make:filament-resource Task --generate
php artisan make:filament-resource Note --generate
```

#### Lead Resource Features
- Table columns: name, email, phone, status, assigned_to, estimated_value, created_at
- Filters: status, assigned_to, date_range, source
- Actions: view, edit, delete, change_status
- Bulk actions: assign, change_status, export
- Global search: name, email, phone

### 7. Lead Status Management
- Status badges with colors
- Status dropdown selector
- Auto-log status changes to activities
- Email notifications on status change

### 8. Sales Pipeline/Funnel (Kanban Board)

```bash
# ติดตั้ง Filament Kanban Board
composer require mokhosh/filament-kanban
```

Features:
- Drag & drop interface
- Group by status
- Show estimated value in each column
- Quick edit on cards
- Filter by assigned_to, date_range

### 9. Follow-up และ Task Management

Features:
- Create tasks from lead detail page
- Due date picker
- Priority levels (low, medium, high)
- Assign to team members
- Email/notification reminders
- Task status tracking
- Overdue tasks highlighting

### 10. Notes และ Activities Log

Features:
- Rich text editor for notes
- Pin important notes
- Activity timeline on lead detail page
- Auto-log all changes (status, assignments, etc.)
- Filter activities by type
- Export activity report

---

## Phase 6: Authentication & Analytics

### 11. สร้างระบบ Authentication และ Authorization

```bash
# ติดตั้ง Shield สำหรับจัดการ roles & permissions
composer require bezhansalleh/filament-shield
php artisan vendor:publish --tag="filament-shield-config"
php artisan shield:install
```

#### Roles และ Permissions
```php
// Admin
- Full access to everything
- User management
- System settings

// Sales Manager
- View all leads
- Assign leads to team
- View analytics
- Cannot delete leads

// Sales
- View assigned leads only
- Update lead information
- Create tasks and notes
- Cannot assign leads
```

### 12. พัฒนา Dashboard Analytics และ Reports

#### Dashboard Widgets
```bash
php artisan make:filament-widget LeadsStatsOverview
php artisan make:filament-widget SalesPipelineChart
php artisan make:filament-widget RecentLeadsTable
```

#### Metrics to Track
- Total leads (by status)
- Conversion rate (New -> Won)
- Total estimated value
- Won deals value
- Average time in each stage
- Lead source performance
- Sales team performance
- Monthly/weekly trends

#### Charts
- Funnel chart (sales pipeline)
- Line chart (leads over time)
- Bar chart (leads by source)
- Pie chart (leads by status)

---

## Phase 7: Integration & Security

### 13. ทดสอบการเชื่อมต่อ API

#### Frontend Integration Steps
```javascript
// Example: Submit form from Next.js
const submitForm = async (formData) => {
    try {
        const response = await fetch('http://your-api-url/api/v1/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Success handling
        }
    } catch (error) {
        // Error handling
    }
}
```

#### Testing Checklist
- [ ] Test form submission from frontend
- [ ] Verify data validation
- [ ] Test error responses
- [ ] Check database records
- [ ] Verify activity logs
- [ ] Test notifications

### 14. ตั้งค่า CORS และ API Security

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['https://your-frontend-domain.com'],
'allowed_methods' => ['POST', 'GET'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

#### Security Measures
- Rate limiting on API endpoints
- Input sanitization
- SQL injection prevention (using Eloquent)
- XSS protection
- CSRF protection for web routes
- API token authentication
- HTTPS enforcement in production
- Environment variables for sensitive data

---

## Technology Stack

### Backend
- **Framework**: Laravel 11
- **Admin Panel**: Filament 3
- **Database**: MySQL 8.0 / PostgreSQL
- **Cache**: Redis (optional)
- **Queue**: Redis/Database (for notifications)

### API
- **Type**: RESTful API
- **Authentication**: Laravel Sanctum
- **Documentation**: API documentation (Scribe/Swagger)

### Deployment
- **Server**: VPS / Cloud hosting
- **Web Server**: Nginx
- **PHP Version**: 8.2+
- **Process Manager**: Supervisor (for queues)

---

## CRM Features Summary

### Lead Management
- ✅ Capture leads from web form
- ✅ Lead detail management
- ✅ Lead assignment
- ✅ Lead source tracking
- ✅ Duplicate detection

### Sales Pipeline
- ✅ Kanban board view
- ✅ Drag & drop status changes
- ✅ Pipeline stages customization
- ✅ Deal value tracking
- ✅ Win/loss analysis

### Task Management
- ✅ Follow-up task creation
- ✅ Task assignment
- ✅ Due date reminders
- ✅ Priority management
- ✅ Task completion tracking

### Communication
- ✅ Notes and comments
- ✅ Activity timeline
- ✅ Email notifications
- ✅ Team collaboration

### Analytics & Reporting
- ✅ Dashboard overview
- ✅ Conversion metrics
- ✅ Sales performance
- ✅ Lead source ROI
- ✅ Custom reports

### User Management
- ✅ Role-based access control
- ✅ Team management
- ✅ Permission system
- ✅ User activity tracking

---

## Next Steps

1. [ ] Review and approve this plan
2. [ ] Set up development environment
3. [ ] Create Laravel project structure
4. [ ] Install and configure Filament
5. [ ] Begin database design implementation
6. [ ] Start API development
7. [ ] Build CRM features incrementally
8. [ ] Test integration with frontend form
9. [ ] Deploy to staging environment
10. [ ] User acceptance testing
11. [ ] Production deployment

---

## Timeline Estimation

- **Phase 1-2**: Setup & Database Design (2-3 days)
- **Phase 3-4**: Models & API Development (3-4 days)
- **Phase 5**: CRM Features in Filament (5-7 days)
- **Phase 6**: Auth & Analytics (3-4 days)
- **Phase 7**: Integration & Security (2-3 days)
- **Testing & Refinement**: (2-3 days)

**Total Estimated Time**: 17-24 days

---

## Notes
- แผนนี้สามารถปรับเปลี่ยนได้ตามความต้องการ
- แนะนำให้พัฒนาแบบ incremental (ทีละ feature)
- ทำการ test อย่างสม่ำเสมอในแต่ละ phase
- เก็บ backup database เป็นประจำ
- ใช้ version control (Git) ตลอดการพัฒนา

---

**สร้างโดย**: Claude Code
**วันที่**: 2025-10-16
**เวอร์ชัน**: 1.0
