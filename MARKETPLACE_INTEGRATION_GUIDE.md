# คู่มือการเชื่อมต่อ Marketplace Platforms กับ CRM

## ภาพรวม

การนำข้อมูล order จาก e-commerce platforms เช่น Lazada, Shopee, TikTok Shop มาเชื่อมกับระบบ CRM จะช่วยให้คุณ:
- มองเห็นภาพรวมของลูกค้าทุกช่องทาง (Omnichannel)
- ติดตามประวัติการสั่งซื้อทั้งหมด
- วิเคราะห์พฤติกรรมการซื้อ
- ทำ Upsell/Cross-sell ได้อย่างมีประสิทธิภาพ
- รวมข้อมูลลูกค้าจากหลายแหล่ง

---

## 1. Lazada Open Platform API

### มี API หรือไม่?
✅ **มี** - Lazada มี **Lazada Open Platform (LOP)** API ให้ใช้งาน

### ขั้นตอนการเชื่อมต่อ:

#### 1.1 สมัครเป็น Lazada Developer
```
URL: https://open.lazada.com/
- สมัครบัญชี Developer
- สร้าง Application
- ได้รับ App Key และ App Secret
```

#### 1.2 OAuth Authentication
```php
// Lazada ใช้ OAuth 2.0
// ต้องทำ Authorization ผ่าน Seller Center
// จะได้ Access Token สำหรับเรียก API
```

#### 1.3 API Endpoints ที่สำคัญ

**Orders API:**
```
GET /orders/get - ดึงข้อมูล order
GET /order/items/get - ดึงข้อมูล items ใน order
GET /orders/search - ค้นหา orders
```

**Products API:**
```
GET /products/get - ดึงข้อมูลสินค้า
POST /product/create - สร้างสินค้า
```

**Seller API:**
```
GET /seller/get - ดึงข้อมูล seller
```

### ข้อมูลที่ได้จาก Orders API:

```json
{
  "order_id": "123456789",
  "customer_first_name": "John",
  "customer_last_name": "Doe",
  "phone": "0812345678",
  "address": "123 Main St",
  "items": [
    {
      "sku": "PROD-001",
      "name": "Product Name",
      "price": 990.00,
      "quantity": 2
    }
  ],
  "order_total": 1980.00,
  "created_at": "2025-10-15 10:30:00",
  "status": "pending"
}
```

### ข้อจำกัด:
- ❌ **ไม่มีอีเมล** - Lazada ไม่ให้ข้อมูลอีเมลของลูกค้า (เพื่อความเป็นส่วนตัว)
- ⏱️ **Rate Limit** - จำกัดจำนวนการเรียก API (ขึ้นกับแพ็กเกจ)
- 🔐 **Token Expiry** - Access token หมดอายุ ต้อง refresh

### เอกสาร API:
- https://open.lazada.com/apps/doc/api
- https://open.lazada.com/doc/doc.htm

---

## 2. Shopee Open Platform API

### มี API หรือไม่?
✅ **มี** - Shopee มี **Shopee Open Platform** API ให้ใช้งาน

### ขั้นตอนการเชื่อมต่อ:

#### 2.1 สมัครเป็น Shopee Partner
```
URL: https://open.shopee.com/
- สมัครบัญชี Partner
- ขอ Partner ID และ Partner Key
- ผ่านการอนุมัติจาก Shopee
```

#### 2.2 Shop Authorization
```php
// Shopee ใช้ Partner-based Authentication
// Seller ต้อง authorize ร้านค้าของตน
// จะได้ Shop ID และ Access Token
```

#### 2.3 API Endpoints ที่สำคัญ

**Order API:**
```
GET /api/v2/order/get_order_list - ดึงรายการ orders
GET /api/v2/order/get_order_detail - ดึงรายละเอียด order
```

**Product API:**
```
GET /api/v2/product/get_item_list - ดึงรายการสินค้า
GET /api/v2/product/get_item_base_info - ดึงข้อมูลสินค้า
```

**Shop API:**
```
GET /api/v2/shop/get_shop_info - ดึงข้อมูลร้าน
```

### ข้อมูลที่ได้จาก Order API:

```json
{
  "order_sn": "210101ABCDE",
  "buyer_username": "user123",
  "recipient_address": {
    "name": "John Doe",
    "phone": "0812345678",
    "full_address": "123 Main St, Bangkok"
  },
  "item_list": [
    {
      "item_name": "Product Name",
      "model_name": "Size M",
      "item_price": 990.00,
      "quantity": 2
    }
  ],
  "total_amount": 1980.00,
  "create_time": 1697356800,
  "order_status": "READY_TO_SHIP"
}
```

### ข้อจำกัด:
- ❌ **ไม่มีอีเมล** - Shopee ไม่ให้ข้อมูลอีเมลของลูกค้า
- ❌ **ข้อมูลลูกค้าจำกัด** - ได้เฉพาะ username และข้อมูลจัดส่ง
- ⏱️ **Rate Limit** - 1000 requests/day (ขั้นพื้นฐาน)
- 🔐 **Token Expiry** - Token หมดอายุใน 4 ชั่วโมง

### เอกสาร API:
- https://open.shopee.com/documents
- https://open.shopee.com/developer-guide/

---

## 3. TikTok Shop API (โบนัส)

### มี API หรือไม่?
✅ **มี** - TikTok Shop มี **TikTok Shop Seller API**

### ขั้นตอนการเชื่อมต่อ:

```
URL: https://partner.tiktokshop.com/
- สมัครเป็น TikTok Shop Partner
- ขอ App Key และ App Secret
- ผ่านการอนุมัติ
```

### API ที่สำคัญ:
```
GET /api/orders/search - ค้นหา orders
GET /api/orders/detail/query - ดึงรายละเอียด order
GET /api/products/search - ค้นหาสินค้า
```

### เอกสาร API:
- https://partner.tiktokshop.com/docv2/page/

---

## 4. สถาปัตยกรรมการเชื่อมต่อกับ CRM

### 4.1 ภาพรวมระบบ

```
┌─────────────────┐
│    Lazada       │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │    ┌──────────────────┐    ┌──────────────┐
│    Shopee       │──┼───→│  Laravel API     │───→│  CRM System  │
└─────────────────┘  │    │  (Integration    │    │  (Filament)  │
                     │    │   Service)       │    └──────────────┘
┌─────────────────┐  │    └──────────────────┘
│  TikTok Shop    │──┘            ↓
└─────────────────┘         ┌──────────────┐
                           │   Database   │
                           │   (MySQL)    │
                           └──────────────┘
```

### 4.2 Database Schema เพิ่มเติม

#### ตาราง `marketplace_orders`
```sql
CREATE TABLE marketplace_orders (
    id BIGINT PRIMARY KEY,
    lead_id BIGINT,  -- เชื่อมกับ leads table
    platform VARCHAR(50),  -- 'lazada', 'shopee', 'tiktok'
    order_number VARCHAR(100),  -- Order ID จาก platform
    customer_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    total_amount DECIMAL(10,2),
    order_status VARCHAR(50),
    order_date DATETIME,
    raw_data JSON,  -- เก็บข้อมูล raw ทั้งหมด
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (lead_id) REFERENCES leads(id),
    INDEX idx_platform (platform),
    INDEX idx_order_number (order_number),
    INDEX idx_phone (phone)
);
```

#### ตาราง `marketplace_order_items`
```sql
CREATE TABLE marketplace_order_items (
    id BIGINT PRIMARY KEY,
    marketplace_order_id BIGINT,
    product_name VARCHAR(255),
    sku VARCHAR(100),
    quantity INT,
    price DECIMAL(10,2),
    created_at TIMESTAMP,

    FOREIGN KEY (marketplace_order_id) REFERENCES marketplace_orders(id)
);
```

#### ตาราง `marketplace_credentials`
```sql
CREATE TABLE marketplace_credentials (
    id BIGINT PRIMARY KEY,
    platform VARCHAR(50),
    shop_name VARCHAR(255),
    app_key VARCHAR(255),
    app_secret VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at DATETIME,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 4.3 Laravel Implementation

#### 4.3.1 สร้าง Service Classes

**LazadaService.php**
```php
<?php

namespace App\Services\Marketplace;

use Illuminate\Support\Facades\Http;

class LazadaService
{
    protected $appKey;
    protected $appSecret;
    protected $accessToken;
    protected $apiUrl = 'https://api.lazada.co.th/rest';

    public function __construct($credentials)
    {
        $this->appKey = $credentials->app_key;
        $this->appSecret = $credentials->app_secret;
        $this->accessToken = $credentials->access_token;
    }

    /**
     * Get orders from Lazada
     */
    public function getOrders($createdAfter = null, $createdBefore = null)
    {
        $params = [
            'created_after' => $createdAfter ?? now()->subDays(7)->toIso8601String(),
            'created_before' => $createdBefore ?? now()->toIso8601String(),
        ];

        return $this->call('GET', '/orders/get', $params);
    }

    /**
     * Get order details
     */
    public function getOrderDetails($orderId)
    {
        return $this->call('GET', '/order/get', ['order_id' => $orderId]);
    }

    /**
     * Make API call to Lazada
     */
    protected function call($method, $endpoint, $params = [])
    {
        $timestamp = now()->timestamp * 1000;

        $params = array_merge($params, [
            'app_key' => $this->appKey,
            'timestamp' => $timestamp,
            'sign_method' => 'sha256',
            'access_token' => $this->accessToken,
        ]);

        // Generate signature
        $params['sign'] = $this->generateSignature($endpoint, $params);

        $response = Http::get($this->apiUrl . $endpoint, $params);

        return $response->json();
    }

    /**
     * Generate API signature
     */
    protected function generateSignature($endpoint, $params)
    {
        ksort($params);

        $stringToBeSigned = $endpoint;
        foreach ($params as $key => $value) {
            $stringToBeSigned .= $key . $value;
        }

        return hash_hmac('sha256', $stringToBeSigned, $this->appSecret);
    }
}
```

**ShopeeService.php**
```php
<?php

namespace App\Services\Marketplace;

use Illuminate\Support\Facades\Http;

class ShopeeService
{
    protected $partnerId;
    protected $partnerKey;
    protected $shopId;
    protected $accessToken;
    protected $apiUrl = 'https://partner.shopeemobile.com';

    public function __construct($credentials)
    {
        $this->partnerId = $credentials->app_key; // Partner ID
        $this->partnerKey = $credentials->app_secret; // Partner Key
        $this->shopId = $credentials->shop_id;
        $this->accessToken = $credentials->access_token;
    }

    /**
     * Get order list from Shopee
     */
    public function getOrderList($timeFrom = null, $timeTo = null)
    {
        $params = [
            'time_from' => $timeFrom ?? now()->subDays(7)->timestamp,
            'time_to' => $timeTo ?? now()->timestamp,
            'time_range_field' => 'create_time',
            'page_size' => 100,
        ];

        return $this->call('/api/v2/order/get_order_list', $params);
    }

    /**
     * Get order details
     */
    public function getOrderDetail($orderSnList)
    {
        $params = [
            'order_sn_list' => is_array($orderSnList) ? $orderSnList : [$orderSnList],
        ];

        return $this->call('/api/v2/order/get_order_detail', $params);
    }

    /**
     * Make API call to Shopee
     */
    protected function call($endpoint, $params = [])
    {
        $timestamp = now()->timestamp;

        // Generate signature
        $sign = $this->generateSignature($endpoint, $timestamp);

        $url = $this->apiUrl . $endpoint;
        $url .= '?partner_id=' . $this->partnerId;
        $url .= '&timestamp=' . $timestamp;
        $url .= '&sign=' . $sign;
        $url .= '&shop_id=' . $this->shopId;
        $url .= '&access_token=' . $this->accessToken;

        $response = Http::post($url, $params);

        return $response->json();
    }

    /**
     * Generate API signature
     */
    protected function generateSignature($path, $timestamp)
    {
        $baseString = $this->partnerId . $path . $timestamp . $this->accessToken . $this->shopId;

        return hash_hmac('sha256', $baseString, $this->partnerKey);
    }
}
```

#### 4.3.2 Service สำหรับ Sync Orders

**MarketplaceOrderSyncService.php**
```php
<?php

namespace App\Services;

use App\Models\MarketplaceOrder;
use App\Models\Lead;
use App\Services\Marketplace\LazadaService;
use App\Services\Marketplace\ShopeeService;

class MarketplaceOrderSyncService
{
    /**
     * Sync orders from all platforms
     */
    public function syncAll()
    {
        $this->syncLazadaOrders();
        $this->syncShopeeOrders();
        // Add more platforms as needed
    }

    /**
     * Sync Lazada orders
     */
    public function syncLazadaOrders()
    {
        $credentials = $this->getCredentials('lazada');

        if (!$credentials || !$credentials->is_active) {
            return;
        }

        $lazada = new LazadaService($credentials);
        $response = $lazada->getOrders();

        if (isset($response['data']['orders'])) {
            foreach ($response['data']['orders'] as $orderData) {
                $this->processOrder('lazada', $orderData);
            }
        }
    }

    /**
     * Sync Shopee orders
     */
    public function syncShopeeOrders()
    {
        $credentials = $this->getCredentials('shopee');

        if (!$credentials || !$credentials->is_active) {
            return;
        }

        $shopee = new ShopeeService($credentials);
        $response = $shopee->getOrderList();

        if (isset($response['response']['order_list'])) {
            $orderSnList = collect($response['response']['order_list'])
                ->pluck('order_sn')
                ->toArray();

            $detailResponse = $shopee->getOrderDetail($orderSnList);

            if (isset($detailResponse['response']['order_list'])) {
                foreach ($detailResponse['response']['order_list'] as $orderData) {
                    $this->processOrder('shopee', $orderData);
                }
            }
        }
    }

    /**
     * Process and save order data
     */
    protected function processOrder($platform, $orderData)
    {
        // Normalize data based on platform
        $normalizedData = $this->normalizeOrderData($platform, $orderData);

        // Find or create lead based on phone number
        $lead = $this->findOrCreateLead($normalizedData);

        // Create or update marketplace order
        MarketplaceOrder::updateOrCreate(
            [
                'platform' => $platform,
                'order_number' => $normalizedData['order_number'],
            ],
            [
                'lead_id' => $lead->id,
                'customer_name' => $normalizedData['customer_name'],
                'phone' => $normalizedData['phone'],
                'address' => $normalizedData['address'],
                'total_amount' => $normalizedData['total_amount'],
                'order_status' => $normalizedData['status'],
                'order_date' => $normalizedData['order_date'],
                'raw_data' => $orderData,
            ]
        );

        // Create activity log
        $this->logActivity($lead, $platform, $normalizedData);
    }

    /**
     * Normalize order data from different platforms
     */
    protected function normalizeOrderData($platform, $orderData)
    {
        switch ($platform) {
            case 'lazada':
                return [
                    'order_number' => $orderData['order_id'],
                    'customer_name' => ($orderData['customer_first_name'] ?? '') . ' ' . ($orderData['customer_last_name'] ?? ''),
                    'phone' => $orderData['phone'] ?? null,
                    'address' => $orderData['address'] ?? null,
                    'total_amount' => $orderData['price'] ?? 0,
                    'status' => $orderData['status'] ?? 'unknown',
                    'order_date' => $orderData['created_at'] ?? now(),
                ];

            case 'shopee':
                return [
                    'order_number' => $orderData['order_sn'],
                    'customer_name' => $orderData['recipient_address']['name'] ?? 'Unknown',
                    'phone' => $orderData['recipient_address']['phone'] ?? null,
                    'address' => $orderData['recipient_address']['full_address'] ?? null,
                    'total_amount' => $orderData['total_amount'] ?? 0,
                    'status' => $orderData['order_status'] ?? 'unknown',
                    'order_date' => isset($orderData['create_time'])
                        ? date('Y-m-d H:i:s', $orderData['create_time'])
                        : now(),
                ];

            default:
                return [];
        }
    }

    /**
     * Find or create lead from order data
     */
    protected function findOrCreateLead($data)
    {
        // Try to find existing lead by phone
        $lead = Lead::where('phone', $data['phone'])->first();

        if (!$lead) {
            // Create new lead
            $lead = Lead::create([
                'name' => $data['customer_name'],
                'phone' => $data['phone'],
                'source' => 'marketplace',
                'status_id' => 1, // Default status
            ]);
        }

        return $lead;
    }

    /**
     * Log activity
     */
    protected function logActivity($lead, $platform, $data)
    {
        $lead->activities()->create([
            'type' => 'marketplace_order',
            'description' => "New order from {$platform}: {$data['order_number']} (฿{$data['total_amount']})",
            'activity_date' => now(),
        ]);
    }

    /**
     * Get credentials for platform
     */
    protected function getCredentials($platform)
    {
        return \App\Models\MarketplaceCredential::where('platform', $platform)
            ->where('is_active', true)
            ->first();
    }
}
```

#### 4.3.3 Schedule Job สำหรับ Auto Sync

**app/Console/Kernel.php**
```php
<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        // Sync marketplace orders every hour
        $schedule->call(function () {
            app(\App\Services\MarketplaceOrderSyncService::class)->syncAll();
        })->hourly();

        // Or create a dedicated command
        // $schedule->command('marketplace:sync')->hourly();
    }
}
```

#### 4.3.4 Artisan Command

**SyncMarketplaceOrdersCommand.php**
```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\MarketplaceOrderSyncService;

class SyncMarketplaceOrdersCommand extends Command
{
    protected $signature = 'marketplace:sync {--platform= : Specific platform to sync}';
    protected $description = 'Sync orders from marketplace platforms';

    public function handle(MarketplaceOrderSyncService $service)
    {
        $this->info('Starting marketplace order sync...');

        $platform = $this->option('platform');

        if ($platform) {
            match($platform) {
                'lazada' => $service->syncLazadaOrders(),
                'shopee' => $service->syncShopeeOrders(),
                default => $this->error('Invalid platform'),
            };
        } else {
            $service->syncAll();
        }

        $this->info('Sync completed!');
    }
}
```

### 4.4 Filament Resources สำหรับ Marketplace Orders

**MarketplaceOrderResource.php**
```php
<?php

namespace App\Filament\Resources;

use App\Models\MarketplaceOrder;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class MarketplaceOrderResource extends Resource
{
    protected static ?string $model = MarketplaceOrder::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationLabel = 'Marketplace Orders';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label('Order Number')
                    ->searchable(),

                Tables\Columns\BadgeColumn::make('platform')
                    ->colors([
                        'primary' => 'lazada',
                        'success' => 'shopee',
                        'warning' => 'tiktok',
                    ]),

                Tables\Columns\TextColumn::make('customer_name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_amount')
                    ->money('thb'),

                Tables\Columns\BadgeColumn::make('order_status')
                    ->colors([
                        'warning' => 'pending',
                        'primary' => 'processing',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ]),

                Tables\Columns\TextColumn::make('order_date')
                    ->dateTime(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('platform')
                    ->options([
                        'lazada' => 'Lazada',
                        'shopee' => 'Shopee',
                        'tiktok' => 'TikTok Shop',
                    ]),

                Tables\Filters\Filter::make('order_date')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('until'),
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ]);
    }
}
```

---

## 5. กระบวนการ Matching ลูกค้า

### 5.1 วิธีเชื่อมโยงข้อมูล

เนื่องจาก Marketplace ไม่ให้ email เราจะใช้วิธีนี้:

**1. Match ด้วยเบอร์โทรศัพท์ (Primary)**
```php
$lead = Lead::where('phone', $orderPhone)->first();
```

**2. Match ด้วยชื่อ + เบอร์บางส่วน (Secondary)**
```php
$lead = Lead::where('name', 'like', "%{$customerName}%")
    ->where('phone', 'like', "%{$lastFourDigits}")
    ->first();
```

**3. สร้าง Lead ใหม่ถ้าไม่เจอ**
```php
if (!$lead) {
    $lead = Lead::create([
        'name' => $customerName,
        'phone' => $phone,
        'source' => 'marketplace_' . $platform,
    ]);
}
```

### 5.2 Merge Duplicate Leads

สร้างฟีเจอร์รวม leads ที่ซ้ำกัน:

```php
public function mergeDuplicates($mainLeadId, $duplicateLeadIds)
{
    $mainLead = Lead::find($mainLeadId);

    foreach ($duplicateLeadIds as $duplicateId) {
        $duplicate = Lead::find($duplicateId);

        // Move all marketplace orders
        $duplicate->marketplaceOrders()->update(['lead_id' => $mainLeadId]);

        // Move all activities
        $duplicate->activities()->update(['lead_id' => $mainLeadId]);

        // Move all tasks
        $duplicate->tasks()->update(['lead_id' => $mainLeadId]);

        // Delete duplicate
        $duplicate->delete();
    }
}
```

---

## 6. Dashboard & Analytics

### 6.1 Widget แสดง Marketplace Performance

**MarketplaceStatsWidget.php**
```php
protected function getStats(): array
{
    return [
        Stat::make('Total Marketplace Orders', MarketplaceOrder::count()),
        Stat::make('Lazada Orders', MarketplaceOrder::where('platform', 'lazada')->count())
            ->color('primary'),
        Stat::make('Shopee Orders', MarketplaceOrder::where('platform', 'shopee')->count())
            ->color('success'),
        Stat::make('Total Revenue', '฿' . number_format(MarketplaceOrder::sum('total_amount'), 2)),
    ];
}
```

### 6.2 Chart แสดงยอดขายแยกตาม Platform

```php
protected function getData(): array
{
    $data = MarketplaceOrder::selectRaw('platform, SUM(total_amount) as total')
        ->groupBy('platform')
        ->get();

    return [
        'datasets' => [
            [
                'label' => 'Revenue by Platform',
                'data' => $data->pluck('total'),
            ],
        ],
        'labels' => $data->pluck('platform'),
    ];
}
```

---

## 7. ข้อควรระวังและ Best Practices

### 7.1 ข้อควรระวัง

❗ **API Rate Limits**
- ตั้ง queue สำหรับ sync ข้อมูล
- ใช้ cache เพื่อลด API calls
- ตรวจสอบ rate limit ก่อนเรียก

❗ **Token Expiration**
- ตั้งระบบ refresh token อัตโนมัติ
- แจ้งเตือนเมื่อ token ใกล้หมดอายุ
- มี fallback mechanism

❗ **Data Privacy**
- เข้ารหัสข้อมูลลูกค้า
- ปฏิบัติตาม PDPA
- ระวังการเก็บข้อมูลส่วนบุคคล

❗ **Error Handling**
- Log errors ทุกครั้ง
- มี retry mechanism
- แจ้งเตือนเมื่อ sync fail

### 7.2 Best Practices

✅ **Incremental Sync**
```php
// เก็บ last_sync_at
// Sync เฉพาะ orders ใหม่
$lastSync = $credential->last_sync_at;
$orders = $service->getOrders($lastSync, now());
```

✅ **Queue Jobs**
```php
// ใช้ queue สำหรับ sync
dispatch(new SyncMarketplaceOrdersJob('lazada'));
```

✅ **Webhook Integration (ถ้ามี)**
```php
// บาง platform มี webhook
// รับ notification เมื่อมี order ใหม่
Route::post('/webhook/lazada', [WebhookController::class, 'lazada']);
```

✅ **Monitoring**
```php
// ติดตาม sync status
// แจ้งเตือนเมื่อมีปัญหา
if ($failedSyncs > 3) {
    Notification::send($admin, new SyncFailedNotification());
}
```

---

## 8. ราคาและค่าใช้จ่าย

### API Access Fees:

**Lazada:**
- 🆓 Free tier: จำกัด API calls
- 💰 Paid tier: เพิ่ม quota และ features

**Shopee:**
- 🆓 Free tier: 1,000 calls/day
- 💰 Paid tier: เพิ่ม quota

**TikTok Shop:**
- 🆓 Free tier: มี rate limits
- 💰 Paid tier: ขึ้นกับปริมาณ

### Development Cost:
- Integration Development: 30,000 - 80,000 บาท
- Maintenance (ต่อปี): 10,000 - 20,000 บาท

---

## 9. Timeline การพัฒนา

**Week 1:**
- ศึกษา API documentation
- ลงทะเบียนเป็น partner
- ออกแบบ database schema

**Week 2:**
- พัฒนา Service classes
- ทดสอบ API connection
- สร้าง sync service

**Week 3:**
- พัฒนา matching logic
- สร้าง Filament resources
- ทดสอบ sync

**Week 4:**
- สร้าง dashboard widgets
- เพิ่ม error handling
- Testing & deployment

**Total: 3-4 สัปดาห์**

---

## 10. สรุปและคำแนะนำ

### ✅ ควรทำ:
1. เริ่มจาก platform หลักที่มียอดขายมากที่สุด
2. ใช้ queue สำหรับ sync เพื่อไม่ให้กระทบ performance
3. มีระบบ monitoring และ alert
4. ทดสอบ matching logic ให้ดี
5. เตรียม manual merge tool สำหรับ duplicate leads

### ❌ ไม่ควรทำ:
1. Sync ทุกนาที (ใช้ queue hourly/daily)
2. เก็บข้อมูลที่ไม่จำเป็น
3. ละเลยการจัดการ token expiration
4. ไม่มี error handling

### 🎯 ROI:
- เห็นภาพรวมลูกค้าทุกช่องทาง (360° view)
- ทำ cross-sell/upsell ได้อย่างมีประสิทธิภาพ
- ประหยัดเวลาในการรวบรวมข้อมูล
- เพิ่มความแม่นยำในการวิเคราะห์

---

**หมายเหตุ:**
- API อาจมีการเปลี่ยนแปลง ควรตรวจสอบเอกสารล่าสุด
- ต้องผ่านการอนุมัติจาก platform ก่อนใช้งาน
- บาง features อาจต้องมีค่าใช้จ่ายเพิ่มเติม

---

**Created:** 2025-10-16
**Version:** 1.0
