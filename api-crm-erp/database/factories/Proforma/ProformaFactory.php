<?php

namespace Database\Factories\Proforma;

use App\Models\User;
use Illuminate\Support\Str;
use App\Models\Client\Client;
use App\Models\Proforma\Proforma;
use App\Models\Configuration\Sucursale;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class ProformaFactory extends Factory
{
    protected $model = Proforma::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        //$date_sales = $this->faker->dateTimeBetween("2024-01-01 00:00:00", "2024-12-25 23:59:59");
        $date_sales = $this->faker->dateTimeBetween("2025-01-01 00:00:00", "2025-12-25 23:59:59");

        $client = Client::inRandomOrder()->first();
        return [
            "user_id" => User::where("role_id",2)->inRandomOrder()->first()->id,
            "client_id" => $client->id,
            "client_segment_id" => $client->client_segment_id,
            "sucursale_id" => Sucursale::where("state",1)->inRandomOrder()->first()->id,
            "subtotal" => 0,
            "discount" => 0,
            "total" => 0,
            "igv" => 0,
            "state_proforma" => $this->faker->randomElement([1,2]),
            "state_payment" => 1,
            "debt" => 0,
            "paid_out" => 0,
            "description" => $this->faker->text($maxNbChars = 300),
            "created_at" => $date_sales,
            "updated_at" => $date_sales,
        ];
    }
}
