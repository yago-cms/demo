<?php

namespace App\Models;

use App\Contracts\Block;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FieldBlock extends Model implements Block
{
    use HasFactory;

    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }

}
