<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $connection = 'mysql';
    protected $table = 'customers';
    protected $primaryKey = 'Customers_Numbers';

    protected $fillable = [
        'Customers_Numbers',
        'created_date',
        'updated_date',
        'birth_date',
        'matrimonial',
        'Names',
        'LastName',
        'Website',
        'Phones',
        'E-mails',
        'password',
        'Country',
        'Province',
        'City',
        'Adresses',
        'Appt',
        'Postal_Code',
        'type',
        'User',
        'Status',
        'Description',
        'Notes',
        'added_from',
        'Picture',
        'cover_picture',
        'Status',
        'type',
        'added_from',
        'az_id',
        'customer_db'
    ];

}
