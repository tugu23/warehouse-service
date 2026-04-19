-- ============================================
-- MIGRATION PART 5: RETURNS
-- butsaalt -> returns
-- ============================================


INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    1, 528, NULL, 10, NULL, '2017-08-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    2, 527, NULL, 5, NULL, '2017-08-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    3, 457, NULL, 24, NULL, '2017-09-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    4, 590, NULL, 6, NULL, '2017-09-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    5, 579, NULL, 8, NULL, '2017-09-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    6, 433, NULL, 5, NULL, '2017-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    7, 434, NULL, 2, NULL, '2017-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    8, 433, NULL, 4, NULL, '2017-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    9, 434, NULL, 3, NULL, '2017-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    10, 652, NULL, 30, NULL, '2017-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    11, 658, NULL, 30, NULL, '2017-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    12, 467, NULL, 8, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    13, 626, NULL, 20, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    14, 635, NULL, 15, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    15, 650, NULL, 12, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    16, 424, NULL, 20, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    17, 527, NULL, 9, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    18, 526, NULL, 1, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    19, 477, NULL, 240, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    20, 424, NULL, 20, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    21, 535, NULL, 11, NULL, '2017-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    22, 458, NULL, 11, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    23, 467, NULL, 5, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    24, 459, NULL, 3, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    25, 460, NULL, 5, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    26, 463, NULL, 10, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    27, 524, NULL, 8, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    28, 522, NULL, 18, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    29, 532, NULL, 2, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    30, 527, NULL, 4, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    31, 533, NULL, 1, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    32, 458, NULL, 2, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    33, 471, NULL, 15, NULL, '2017-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    34, 485, NULL, 250, NULL, '2018-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    35, 485, NULL, 31, NULL, '2018-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    36, 669, NULL, 2, NULL, '2018-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    37, 459, NULL, 27, NULL, '2018-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    38, 637, NULL, 32, NULL, '2018-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    39, 636, NULL, 32, NULL, '2018-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    40, 462, NULL, 13, NULL, '2018-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    41, 630, NULL, 2, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    42, 635, NULL, 3, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    43, 631, NULL, 1, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    44, 634, NULL, 4, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    45, 651, NULL, 7, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    46, 521, NULL, 150, NULL, '2018-04-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    50, 522, NULL, 10, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    51, 519, NULL, 9, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    52, 520, NULL, 2, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    53, 521, NULL, 1, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    54, 518, NULL, 4, NULL, '2018-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    55, 522, NULL, 13, NULL, '2018-03-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    56, 520, NULL, 2, NULL, '2018-03-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    57, 520, NULL, 4, NULL, '2018-03-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    58, 521, NULL, 11, NULL, '2018-03-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    59, 535, NULL, 6, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    60, 423, NULL, 85, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    61, 697, NULL, 1, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    62, 698, NULL, 1, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    63, 697, NULL, 1, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    64, 522, NULL, 1, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    65, 664, NULL, 21, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    66, 671, NULL, 6, NULL, '2018-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    67, 702, NULL, 6, NULL, '2018-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    68, 689, NULL, 24, NULL, '2019-03-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    69, 732, NULL, 5, NULL, '2020-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    70, 422, NULL, 10, NULL, '2020-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    71, 732, NULL, 10, NULL, '2020-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    72, 695, NULL, 2, NULL, '2020-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    73, 731, NULL, 45, NULL, '2020-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    74, 730, NULL, 42, NULL, '2020-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    75, 422, NULL, 60, NULL, '2020-04-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    76, 423, NULL, 200, NULL, '2020-07-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    77, 452, NULL, 22, NULL, '2021-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    78, 764, NULL, 3, NULL, '2021-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    79, 765, NULL, 3, NULL, '2021-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    80, 754, NULL, 15, NULL, '2021-10-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    81, 455, NULL, 2, NULL, '2021-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    82, 427, NULL, 1400, NULL, '2021-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    83, 737, NULL, 7, NULL, '2021-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    84, 752, NULL, 1, NULL, '2021-12-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    85, 752, NULL, 18, NULL, '2022-02-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    86, 433, NULL, 854, NULL, '2022-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    87, 426, NULL, 1864, NULL, '2022-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    88, 427, NULL, 20, NULL, '2022-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    89, 434, NULL, 569, NULL, '2022-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    90, 450, NULL, 27, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    91, 452, NULL, 4, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    92, 452, NULL, 2, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    93, 436, NULL, 2, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    94, 631, NULL, 4, NULL, '2023-04-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    95, 436, NULL, 1, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    96, 729, NULL, 44, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    97, 427, NULL, 7, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    98, 583, NULL, 7, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    99, 733, NULL, 6, NULL, '2023-05-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    100, 434, NULL, 53, NULL, '2023-06-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    101, 427, NULL, 2, NULL, '2023-06-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    102, 442, NULL, 20, NULL, '2023-06-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    103, 582, NULL, 1, NULL, '2023-06-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    104, 671, NULL, 36, NULL, '2023-11-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    105, 729, NULL, 220, NULL, '2024-01-01', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO returns (
    id, product_id, customer_id, quantity, unit_price, return_date, notes
) VALUES (
    106, 729, NULL, 780, NULL, '2024-01-01', NULL
) ON CONFLICT (id) DO NOTHING;
