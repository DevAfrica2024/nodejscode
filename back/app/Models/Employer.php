<?php

namespace App\Models;

use app\Models\User;
use Illuminate\Database\Eloquent\Model;

class Employer extends Model
{
    protected $connection = 'mysql2';
    protected $table = 'employees';
    protected $primaryKey = 'employees_Number';
     protected $fillable = [
               'employees_Number',
               'az_id',
               'FirstName',
               'LastName',
               'Phones',
               'TypeEmplyement',
               'Email'
               ];

     public function user()
        {
            return $this->belongsTo(User::class, 'az_id', 'Customers_Numbers');
        }
}
