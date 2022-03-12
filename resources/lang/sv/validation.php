<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attribute måste accepteras.',
    'active_url' => ':attribute är inte en giltig webbadress.',
    'after' => ':attribute måste vara ett datum efter :date.',
    'after_or_equal' => ':attribute måste vara ett datum senare eller samma dag som :date.',
    'alpha' => ':attribute får endast innehålla bokstäver.',
    'alpha_dash' => ':attribute får endast innehålla bokstäver, siffror och bindestreck.',
    'alpha_num' => ':attribute får endast innehålla bokstäver och siffror.',
    'array' => ':attribute måste vara en array.',
    'before' => ':attribute måste vara ett datum innan :date.',
    'before_or_equal' => ':attribute måste vara ett datum före eller samma dag som :date.',
    'between' => [
        'array' => ':attribute måste innehålla mellan :min - :max objekt.',
        'file' => ':attribute måste vara mellan :min till :max kilobyte stor.',
        'numeric' => ':attribute måste vara en siffra mellan :min och :max.',
        'string' => ':attribute måste innehålla :min till :max tecken.',
    ],
    'boolean' => ':attribute måste vara sant eller falskt.',
    'confirmed' => ':attribute bekräftelsen matchar inte.',
    'date' => ':attribute är inte ett giltigt datum.',
    'date_equals' => ':attribute måste vara ett datum lika med :date.',
    'date_format' => ':attribute matchar inte formatet :format.',
    'different' => ':attribute och :other får inte vara lika.',
    'digits' => ':attribute måste vara :digits tecken.',
    'digits_between' => ':attribute måste vara mellan :min och :max tecken.',
    'dimensions' => ':attribute har felaktiga bilddimensioner.',
    'distinct' => ':attribute innehåller fler än en repetition av samma element.',
    'email' => ':attribute måste innehålla en korrekt e-postadress.',
    'ends_with' => ':attribute måste sluta med en av följande: :values.',
    'exists' => ':attribute är ogiltigt.',
    'file' => ':attribute måste vara en fil.',
    'filled' => ':attribute är obligatoriskt.',
    'gt' => [
        'array' => ':attribute måste innehålla fler än :value objekt.',
        'file' => ':attribute måste vara större än :value kilobyte stor.',
        'numeric' => ':attribute måste vara större än :value.',
        'string' => ':attribute måste vara längre än :value tecken.',
    ],
    'gte' => [
        'array' => ':attribute måste innehålla lika många eller fler än :value objekt.',
        'file' => ':attribute måste vara lika med eller större än :value kilobyte stor.',
        'numeric' => ':attribute måste vara lika med eller större än :value.',
        'string' => ':attribute måste vara lika med eller längre än :value tecken.',
    ],
    'image' => ':attribute måste vara en bild.',
    'in' => ':attribute är ogiltigt.',
    'in_array' => ':attribute finns inte i :other.',
    'integer' => ':attribute måste vara en siffra.',
    'ip' => ':attribute måste vara en giltig IP-adress.',
    'ipv4' => ':attribute måste vara en giltig IPv4-adress.',
    'ipv6' => ':attribute måste vara en giltig IPv6-adress.',
    'json' => ':attribute måste vara en giltig JSON-sträng.',
    'lt' => [
        'array' => ':attribute måste innehålla färre än :value objekt.',
        'file' => ':attribute måste vara mindre än :value kilobyte stor.',
        'numeric' => ':attribute måste vara mindre än :value.',
        'string' => ':attribute måste vara kortare än :value tecken.',
    ],
    'lte' => [
        'array' => ':attribute måste innehålla lika många eller färre än :value objekt.',
        'file' => ':attribute måste vara lika med eller mindre än :value kilobyte stor.',
        'numeric' => ':attribute måste vara lika med eller mindre än :value.',
        'string' => ':attribute måste vara lika med eller kortare än :value tecken.',
    ],
    'max' => [
        'array' => ':attribute får inte innehålla mer än :max objekt.',
        'file' => ':attribute får max vara :max kilobyte stor.',
        'numeric' => ':attribute får inte vara större än :max.',
        'string' => ':attribute får max innehålla :max tecken.',
    ],
    'mimes' => ':attribute måste vara en fil av typen: :values.',
    'mimetypes' => ':attribute måste vara en fil av typen: :values.',
    'min' => [
        'array' => ':attribute måste innehålla minst :min objekt.',
        'file' => ':attribute måste vara minst :min kilobyte stor.',
        'numeric' => ':attribute måste vara större än :min.',
        'string' => ':attribute måste innehålla minst :min tecken.',
    ],
    'multiple_of' => ':attribute måste vara en multipel av :value',
    'not_in' => ':attribute är ogiltigt.',
    'not_regex' => 'Formatet för :attribute är ogiltigt.',
    'numeric' => ':attribute måste vara en siffra.',
    'present' => ':attribute måste finnas med.',
    'regex' => ':attribute har ogiltigt format.',
    'required' => ':attribute är obligatoriskt.',
    'required_array_keys' => 'The :attribute field must contain entries for: :values.',
    'required_if' => ':attribute är obligatoriskt när :other är :value.',
    'required_unless' => ':attribute är obligatoriskt när inte :other finns bland :values.',
    'required_with' => ':attribute är obligatoriskt när :values är ifyllt.',
    'required_with_all' => ':attribute är obligatoriskt när :values är ifyllt.',
    'required_without' => ':attribute är obligatoriskt när :values ej är ifyllt.',
    'required_without_all' => ':attribute är obligatoriskt när ingen av :values är ifyllt.',
    'prohibited' => 'Fältet :attribute är förbjudet.',
    'prohibited_if' => ':attribute är förbjudet när :other är :value.',
    'prohibited_unless' => ':attribute är förbjudet om inte :other är :values.',
    'same' => ':attribute och :other måste vara lika.',
    'size' => [
        'array' => ':attribute måste innehålla :size objekt.',
        'file' => ':attribute får endast vara :size kilobyte stor.',
        'numeric' => ':attribute måste vara :size.',
        'string' => ':attribute måste innehålla :size tecken.',
    ],
    'starts_with' => ':attribute måste börja med en av följande: :values',
    'string' => ':attribute måste vara en sträng.',
    'timezone' => ':attribute måste vara en giltig tidszon.',
    'unique' => ':attribute används redan.',
    'uploaded' => ':attribute kunde inte laddas upp.',
    'url' => ':attribute har ett ogiltigt format.',
    'uuid' => ':attribute måste vara ett giltigt UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
