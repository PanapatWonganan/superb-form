<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LeadStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'New',
                'color' => '#3b82f6', // Blue
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Contacted',
                'color' => '#8b5cf6', // Purple
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Qualified',
                'color' => '#f59e0b', // Orange
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Negotiation',
                'color' => '#eab308', // Yellow
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Won',
                'color' => '#10b981', // Green
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Lost',
                'color' => '#ef4444', // Red
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($statuses as $status) {
            \App\Models\LeadStatus::create($status);
        }
    }
}
