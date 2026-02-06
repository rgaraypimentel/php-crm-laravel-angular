<?php

namespace App\Console\Commands\Client;

use App\Mail\BirthDayClient as BirthDayClientF;
use App\Models\Client\Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class BirthDayClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:birth-day';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Correo electronico a los clientes que cumplan años';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        date_default_timezone_set("America/Lima");
        //
        $clients = Client::where("state",1)
                            ->whereMonth("birthdate",today())
                            ->whereDay("birthdate",today())
                            ->orderBy("id","desc")->get();

        foreach ($clients as $key => $client) {
            if($client->email){
                Mail::to($client->email)->send(new BirthDayClientF($client));
            }
        }
    }
}
