<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Super Admin role with all permissions
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Create Sales Manager role
        $salesManager = Role::firstOrCreate(['name' => 'sales_manager']);
        $salesManagerPermissions = [
            // Lead permissions (view all, create, update, no delete)
            'view_lead',
            'view_any_lead',
            'create_lead',
            'update_lead',

            // Activity permissions
            'view_activity',
            'view_any_activity',
            'create_activity',

            // Task permissions
            'view_task',
            'view_any_task',
            'create_task',
            'update_task',

            // Note permissions
            'view_note',
            'view_any_note',
            'create_note',

            // View lead statuses
            'view_lead::status',
            'view_any_lead::status',

            // View users (to assign leads)
            'view_user',
            'view_any_user',

            // Dashboard widgets
            'widget_LeadsOverview',
            'widget_LeadsByStatusChart',
            'widget_LatestLeads',

            // Pipeline page
            'page_LeadsPipeline',
        ];

        foreach ($salesManagerPermissions as $permission) {
            $perm = Permission::where('name', $permission)->first();
            if ($perm) {
                $salesManager->givePermissionTo($perm);
            }
        }

        // Create Sales role
        $sales = Role::firstOrCreate(['name' => 'sales']);
        $salesPermissions = [
            // Only view assigned leads
            'view_lead',
            'update_lead',

            // Activity permissions
            'view_activity',
            'create_activity',

            // Task permissions
            'view_task',
            'create_task',
            'update_task',

            // Note permissions
            'view_note',
            'create_note',

            // View lead statuses
            'view_lead::status',

            // Pipeline page
            'page_LeadsPipeline',
        ];

        foreach ($salesPermissions as $permission) {
            $perm = Permission::where('name', $permission)->first();
            if ($perm) {
                $sales->givePermissionTo($perm);
            }
        }

        $this->command->info('Roles and permissions created successfully!');
        $this->command->info('- super_admin: Full access');
        $this->command->info('- sales_manager: Can view all leads, assign, and view analytics');
        $this->command->info('- sales: Can only view and update assigned leads');
    }
}
