<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsDemoSeeder extends Seeder
{
    /**
     * Create the initial roles and permissions.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['guard_name' => 'api','name' => 'register_role']);
        Permission::create(['guard_name' => 'api','name' => 'edit_role']);
        Permission::create(['guard_name' => 'api','name' => 'delete_role']);
        Permission::create(['guard_name' => 'api','name' => 'register_user']);

        Permission::create(['guard_name' => 'api','name' => 'edit_user']);
        Permission::create(['guard_name' => 'api','name' => 'delete_user']);
        Permission::create(['guard_name' => 'api','name' => 'register_product']);
        Permission::create(['guard_name' => 'api','name' => 'edit_product']);

        Permission::create(['guard_name' => 'api','name' => 'delete_product']);
        Permission::create(['guard_name' => 'api','name' => 'show_wallet_price_product']);
        Permission::create(['guard_name' => 'api','name' => 'register_wallet_price_product']);
        Permission::create(['guard_name' => 'api','name' => 'edit_wallet_price_product']);

        Permission::create(['guard_name' => 'api','name' => 'delete_wallet_price_product']);
        Permission::create(['guard_name' => 'api','name' => 'register_clientes']);
        Permission::create(['guard_name' => 'api','name' => 'edit_clientes']);
        Permission::create(['guard_name' => 'api','name' => 'delete_clientes']);

        Permission::create(['guard_name' => 'api','name' => 'valid_payments']);
        Permission::create(['guard_name' => 'api','name' => 'reports_caja']);
        Permission::create(['guard_name' => 'api','name' => 'record_contract_process']);
        Permission::create(['guard_name' => 'api','name' => 'egreso']);

        Permission::create(['guard_name' => 'api','name' => 'ingreso']);
        Permission::create(['guard_name' => 'api','name' => 'close_caja']);
        Permission::create(['guard_name' => 'api','name' => 'register_proforma']);
        Permission::create(['guard_name' => 'api','name' => 'edit_proforma']);

        Permission::create(['guard_name' => 'api','name' => 'delete_proforma']);
        Permission::create(['guard_name' => 'api','name' => 'cronograma']);
        Permission::create(['guard_name' => 'api','name' => 'comisiones']);
        Permission::create(['guard_name' => 'api','name' => 'register_compra']);

        Permission::create(['guard_name' => 'api','name' => 'edit_compra']);
        Permission::create(['guard_name' => 'api','name' => 'delete_compra']);
        Permission::create(['guard_name' => 'api','name' => 'register_transporte']);
        Permission::create(['guard_name' => 'api','name' => 'edit_transporte']);

        Permission::create(['guard_name' => 'api','name' => 'delete_transporte']);
        Permission::create(['guard_name' => 'api','name' => 'despacho']);
        Permission::create(['guard_name' => 'api','name' => 'movimientos']);
        Permission::create(['guard_name' => 'api','name' => 'kardex']);

        // create roles and assign existing permissions
        // $role1 = Role::create(['guard_name' => 'api','name' => 'writer']);
        // $role1->givePermissionTo('edit articles');
        // $role1->givePermissionTo('delete articles');

        // $role2 = Role::create(['guard_name' => 'api','name' => 'admin']);
        // $role2->givePermissionTo('publish articles');
        // $role2->givePermissionTo('unpublish articles');

        $role3 = Role::create(['guard_name' => 'api','name' => 'Super-Admin']);
        // gets all permissions via Gate::before rule; see AuthServiceProvider

        // create demo users
        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Example User',
        //     'email' => 'test@example.com',
        //     'password' => bcrypt("12345678")
        // ]);
        // $user->assignRole($role1);

        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Example Admin User',
        //     'email' => 'admin@example.com',
        //     'password' => bcrypt("12345678")
        // ]);
        // $user->assignRole($role2);

        $user = \App\Models\User::factory()->create([
            'name' => 'Example Super-Admin User',
            'email' => 'CarlosSuperadmin@example.com',
            'password' => bcrypt("12345678")
        ]);
        $user->assignRole($role3);
    }
}