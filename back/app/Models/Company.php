<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    //


    protected $connection = 'mysql';
    protected $table = 'company_employee_links';
    protected $primaryKey = 'id';

    protected $fillable = [
        'company_number',
        'employee_number',
        'role'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'company_number', 'Customers_Numbers');
    }

    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'employee_number', 'id');
    // }
}
