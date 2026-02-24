<?php

use Illuminate\Http\Request;
use App\Events\WebSignalEvent;
use App\Http\Middleware\JwtAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\Auth\AuthController;


Route::middleware(JwtAuth::class)->group(function () {
       Route::get('/company/customers',[CompanyController::class,'getCustomers']);
       Route::post('/company/invite',[CompanyController::class,'inviteEmployee']);
       Route::post('/verify-code',[CompanyController::class,'verifyCode']);
 });

Route::post('/company/get/employers',[CompanyController::class,'getAllEmployers']);

Route::post("/login",[AuthController::class,'login']);
Route::post('/auth/select-company', [App\Http\Controllers\CompanyController::class, 'selectCompany']);






