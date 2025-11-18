<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ชื่อ-นามสกุล
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('company')->nullable(); // ชื่อบริษัท
            $table->string('position')->nullable(); // ตำแหน่ง
            $table->string('source')->default('website_form'); // แหล่งที่มา
            $table->foreignId('status_id')->nullable()->constrained('lead_statuses')->onDelete('set null');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // ผู้รับผิดชอบ
            $table->decimal('estimated_value', 10, 2)->nullable(); // มูลค่าโอกาสการขาย
            $table->json('form_data')->nullable(); // เก็บข้อมูลอื่นๆ จากฟอร์ม
            $table->timestamps();
            $table->softDeletes(); // soft delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
