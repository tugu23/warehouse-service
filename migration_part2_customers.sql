-- ============================================
-- MIGRATION PART 2: CUSTOMERS
-- hariltsagch -> customers
-- ============================================


INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10903, 'аман хуур баянцээл', 'ӨНХРҮҮШ БАЯН', 'аманхуурбаянцээл', '5749751', NULL, '94199569',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10904, 'Хор apple смаркет', NULL, 'Хорappleсмаркет', NULL, NULL, '94039976',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10905, '10 со хүнс 2', NULL, '10сохүнс2', NULL, NULL, '91180954',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10906, '10 со хүнс сөүл88', NULL, '10сохүнссөүл88', '5003059', NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10907, '10 хор арвин', NULL, '10хорарвин', '2692163', NULL, '88481040',
    NULL, NULL, 2, 10,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10908, '10 хор шинэ хүнс', NULL, '10хоршинэхүнс', NULL, NULL, '99108226',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10909, '100 айл  ', NULL, '100айл', NULL, NULL, NULL,
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10910, '100 айл 33хдэлгүүр', NULL, '100айл33хдэлгүүр', NULL, NULL, '95682341',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10911, '100 айл ммаркет', NULL, '100айлммаркет', NULL, NULL, '80430107',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10912, '100 айл хүслийн уул', NULL, '100айлхүслийнуул', '6068529', NULL, NULL,
    NULL, NULL, 2, 10,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10913, '10хор алла гэр ахуй', NULL, '10хораллагэрахуй', NULL, NULL, '94044787',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10914, '11 хор со хүнс', NULL, '11хорсохүнс', NULL, NULL, NULL,
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10915, '11a жаргалант', NULL, '11aжаргалант', NULL, NULL, '99745576',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10916, '13 ммаркет', NULL, '13ммаркет', NULL, NULL, '99645359',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10917, '13 орчлон ммаркет', NULL, '13орчлонммаркет', NULL, NULL, '99162190',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10918, '13ногоон төгөл 78 хдэлгүүр', NULL, '13ногоонтөгөл78хдэлгүүр', NULL, NULL, '98626367',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10919, '13-шинэ хүнс', NULL, '13-шинэхүнс', NULL, NULL, '91116769',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10920, '16 БЗ-со хүнс', NULL, '16БЗ-сохүнс', NULL, NULL, '96659545',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10921, '16 ммаркет', NULL, '16ммаркет', NULL, NULL, '91018335',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10922, '16 тамир хдэлгүүр', NULL, '16тамирхдэлгүүр', NULL, NULL, '91698899',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10923, '16 ханхөхий хдэлгүүр', NULL, '16ханхөхийхдэлгүүр', NULL, NULL, '88244363',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10924, '18 байр хдэлгүүр', NULL, '18байрхдэлгүүр', NULL, NULL, '88607118',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10925, '21 хтөв Л-33', NULL, '21хтөвЛ-33', NULL, NULL, '96201227',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10926, '21 хтөв Л-34', NULL, '21хтөвЛ-34', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10927, '21 хтөв Л-35', NULL, '21хтөвЛ-35', NULL, NULL, '99307276',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10928, '21 хтөв Л-36', NULL, '21хтөвЛ-36', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10929, '21 хтөв со гэр ахуй', NULL, '21хтөвсогэрахуй', NULL, NULL, '88017844',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10930, '21 худ төв V1', NULL, '21худтөвV1', NULL, NULL, '9660-8802',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10931, '21 худ төв бөөний төв', NULL, '21худтөвбөөнийтөв', NULL, NULL, NULL,
    NULL, NULL, 1, 12,
    NULL, false, 'Падаан', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10932, '25  j март', NULL, '25jмарт', '5091586', NULL, '11366654',
    NULL, NULL, 2, 11,
    NULL, true, 'Борлуулалт', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10933, '25 aloe', 'МОН СОНУ', '25aloe', '2748029', NULL, '99188686',
    NULL, NULL, 1, 6,
    NULL, true, 'Падаан', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10934, '25 смаркет', NULL, '25смаркет', NULL, NULL, '94622525',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10935, '29 гоймон', NULL, '29гоймон', NULL, NULL, NULL,
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10936, '33 хдэлгүүр', NULL, '33хдэлгүүр', NULL, NULL, '96670895',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10937, '3сайхан ммаркет', NULL, '3сайханммаркет', NULL, NULL, '99136681',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10938, '4зам ммаркет ', NULL, '4замммаркет', NULL, NULL, '99068273',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10939, '5 сур НВЦ', NULL, '5сурНВЦ', NULL, NULL, NULL,
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10940, '5 сур-со хүнс', NULL, '5сур-сохүнс', NULL, NULL, NULL,
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10941, '5 эрдэнэ 10', NULL, '5эрдэнэ10', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10942, '5 эрдэнэ 15', NULL, '5эрдэнэ15', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10943, '5 эрдэнэ 17', NULL, '5эрдэнэ17', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10944, '5 эрдэнэ 21', NULL, '5эрдэнэ21', NULL, NULL, '9606-1764',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10945, '5 эрдэнэ амтлагч', NULL, '5эрдэнэамтлагч', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10946, '5 эрдэнэ со хүнс Баянбүрд', NULL, '5эрдэнэсохүнсБаянбүрд', NULL, NULL, NULL,
    NULL, NULL, 1, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10947, '5 эрдэнэ хүнсний дэлгүүр', NULL, '5эрдэнэхүнснийдэлгүүр', NULL, NULL, '89122332',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10948, '51 хдэлгүүр ', NULL, '51хдэлгүүр', '2101815', NULL, '99838309',
    NULL, NULL, 2, 10,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10949, '5эрдэнэ гахайн мах', NULL, '5эрдэнэгахайнмах', NULL, NULL, '95967207',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10950, '5эрдэнэ гурил-2', NULL, '5эрдэнэгурил-2', NULL, NULL, '99735995',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10951, '6 буудал мини маркет', NULL, '6буудалминимаркет', NULL, NULL, '88983982',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10952, '6 буудал ммаркет ', NULL, '6буудалммаркет', NULL, NULL, '88983982',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10953, '7 Days  Б4Зам', NULL, '7DaysБ4Зам', NULL, NULL, '88999081',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10954, '7 буудал 19 лангуу', NULL, '7буудал19лангуу', NULL, NULL, '99700699',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10955, '7 буудал 9эрдэнэ гуанз', NULL, '7буудал9эрдэнэгуанз', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10956, '7 буудал 9эрдэнэ төв', NULL, '7буудал9эрдэнэтөв', NULL, NULL, '88028399',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10957, '7 уул', NULL, '7уул', NULL, NULL, '99743821',
    NULL, NULL, 2, 10,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10958, '78 ммаркет', NULL, '78ммаркет', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10959, '7буудал 14р хороо шанд', NULL, '7буудал14рхороошанд', NULL, NULL, '89243179',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10960, '7буудал 17р буудал гэгээ төв', NULL, '7буудал17рбуудалгэгээтөв', NULL, NULL, '88718848',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10961, '7буудал зах гэр ахуй Л-19', NULL, '7буудалзахгэрахуйЛ-19', NULL, NULL, '99700699',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10962, '7буудал мах ногоо жимс', NULL, '7буудалмахногоожимс', NULL, NULL, '88685757',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10963, '7буудал наран ', NULL, '7буудалнаран', NULL, NULL, '89729171',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10964, '7буудал ойгон ммаркет ', NULL, '7буудалойгонммаркет', NULL, NULL, '88616265',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10965, '7буудал цахир ам', NULL, '7буудалцахирам', NULL, NULL, '99160154',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10966, '7буудал ширээт ', NULL, '7буудалширээт', NULL, NULL, '99181250',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10967, '7буудал эргүүнэ', NULL, '7буудалэргүүнэ', NULL, NULL, '88012304',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10968, '8 ммаркет', NULL, '8ммаркет', '5391687', 'Төв шуудангийн ард', '99780144',
    NULL, NULL, 2, 10,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10969, '82 мини маркет', NULL, '82минимаркет', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10970, '888 амгалан хотхон', NULL, '888амгаланхотхон', NULL, NULL, '96603280',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10971, '888 ммаркет жуков', NULL, '888ммаркетжуков', NULL, NULL, '86004434',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10972, 'aldi бз', NULL, 'aldiбз', NULL, NULL, '86067898',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10973, 'Apple huns 10хор', NULL, 'Applehuns10хор', NULL, NULL, '88097874',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10974, 'Auto plaza aрд жаргалаг хүнс', NULL, 'Autoplazaaрджаргалагхүнс', NULL, NULL, '95603108',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10975, 'Auto plaza ард хүслийн уул ммаркет', NULL, 'Autoplazaардхүслийнуулммаркет', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10976, 'BF маркет', NULL, 'BFмаркет', NULL, NULL, '99078621',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10977, 'Blue sky', 'БЛЮСКАЙ ЭЙЖИА', 'Bluesky', '5093171', NULL, '70100607',
    NULL, NULL, 22, 16,
    NULL, true, 'Падаан', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10978, 'bonguri', NULL, 'bonguri', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10979, 'broadway office', NULL, 'broadwayoffice', '5527147', NULL, '9109-8899',
    NULL, NULL, 22, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10980, 'broadway бөмбөгөр', NULL, 'broadwayбөмбөгөр', '5527147', NULL, '88708546',
    NULL, NULL, 22, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10981, 'city 84 хдэлгүүр', NULL, 'city84хдэлгүүр', NULL, NULL, '96157785',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10982, 'city 94 хдэлгүүр', NULL, 'city94хдэлгүүр', NULL, NULL, '99080278',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10983, 'city shop', NULL, 'cityshop', NULL, NULL, '89174039',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10984, 'city shop-35 цирк', NULL, 'cityshop-35цирк', 'ШУ88022202', 'циркийн зүүн талд', '99061165',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10985, 'city зах', NULL, 'cityзах', NULL, NULL, '88836882',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10986, 'city зах L-10', NULL, 'cityзахL-10', NULL, NULL, '96262024',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10987, 'city зах одгэрэл', NULL, 'cityзаходгэрэл', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10988, 'dream house', NULL, 'dreamhouse', NULL, NULL, '99066736',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10989, 'dream смаркет,алтай хотхон', NULL, 'dreamсмаркет,алтайхотхон', NULL, NULL, '89011868',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10990, 'e mart', NULL, 'emart', NULL, NULL, '91912738',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10991, 'eden хдэлгүүр', NULL, 'edenхдэлгүүр', NULL, NULL, '99352080',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10992, 'Efes 10 хор', NULL, 'Efes10хор', '2083817', NULL, '89036011',
    NULL, NULL, 12, 16,
    NULL, true, 'Падаан', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10993, 'family market1 хороолол', NULL, 'familymarket1хороолол', NULL, NULL, '95953883',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10994, 'family market2хороолол', NULL, 'familymarket2хороолол', NULL, NULL, '99069553',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10995, 'family mart', NULL, 'familymart', NULL, NULL, '96669449',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10996, 'family mart - auto plaza', NULL, 'familymart-autoplaza', NULL, NULL, '99608989',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10997, 'family mart ХУД', NULL, 'familymartХУД', 'УС56122811', NULL, '96239978',
    NULL, NULL, 2, 15,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10998, 'Family supermarket', NULL, 'Familysupermarket', NULL, NULL, '89890962',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    10999, 'family смаркет', 'ШҮРЭНЦЭЦЭГ', 'familyсмаркет', 'ЗЮ82072105', NULL, '99079271',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11000, 'food pro mini market', 'Фүүдпро', 'foodprominimarket', '6034985', NULL, '99850838',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11001, 'fresco смаркет', 'ХОСЭКИ', 'frescoсмаркет', '2881071', 'Тэнгис к.театрын хойно', '77111414',
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11002, 'Fresh ахуйн бараа', NULL, 'Freshахуйнбараа', NULL, NULL, '99739538',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11003, 'fresh хдэлгүүр', 'ББСЖ', 'freshхдэлгүүр', '6314759', NULL, '99616921',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11004, 'g март хурд хор', 'Грийнлийф фүүдс', 'gмартхурдхор', '5703042', NULL, '99084857',
    NULL, NULL, 2, 11,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11005, 'gloria', NULL, 'gloria', NULL, NULL, '70120067',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11006, 'good market', 'СНДМ', 'goodmarket', '2700506', 'Маршалл таун, 115р байр', '99682883',
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11007, 'Good market зайсан', 'СНДМ', 'Goodmarketзайсан', '2700506', NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11008, 'good to best модны 2', 'Энхлэг арвин', 'goodtobestмодны2', '6458289', NULL, '89074041',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11009, 'happy 10хор', NULL, 'happy10хор', '2609061', NULL, '70006180',
    NULL, NULL, 2, 8,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11010, 'happy market', NULL, 'happymarket', '2609061', NULL, '99016180',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11011, 'happy mart хурд хор 2р байр', NULL, 'happymartхурдхор2рбайр', NULL, NULL, '95592200',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11012, 'home plaza 2', NULL, 'homeplaza2', '5160804', NULL, '94001275',
    NULL, NULL, 3, 11,
    NULL, true, 'Борлуулалт', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11013, 'home plaza-1', NULL, 'homeplaza-1', '5160804', NULL, NULL,
    NULL, NULL, 3, 11,
    NULL, true, 'Борлуулалт', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11014, 'kims mart', NULL, 'kimsmart', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11015, 'korea house', NULL, 'koreahouse', '5183227', NULL, '70002511',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11016, 'korean mart', 'ЭММЭ', 'koreanmart', '2627973', NULL, '99165995',
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11017, 'koryo pyonyon', NULL, 'koryopyonyon', NULL, NULL, '96007503',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11018, 'love hut ард кинотеатр', NULL, 'lovehutардкинотеатр', NULL, NULL, '99154413',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11019, 'lucky 7 буудал', NULL, 'lucky7буудал', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11020, 'lucky хайлааст', NULL, 'luckyхайлааст', NULL, NULL, '99234355',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11021, 'Lucky халдварт', NULL, 'Luckyхалдварт', NULL, NULL, '89750959',
    NULL, NULL, 2, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11022, 'Lucky', NULL, 'Lucky', '5487919', NULL, NULL,
    NULL, NULL, 2, 6,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11023, 'maral impex-tbd', NULL, 'maralimpex-tbd', '2671611', NULL, NULL,
    NULL, NULL, 2, 6,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11024, 'metro mall P10', NULL, 'metromallP10', NULL, NULL, '88221050  89060806',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11025, 'metromall 3', NULL, 'metromall3', NULL, NULL, '99800892',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11026, 'metromall A-4', NULL, 'metromallA-4', '6194184', NULL, '89192919',
    NULL, NULL, 1, 12,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11027, 'metromall p-11', NULL, 'metromallp-11', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11028, 'metromall p-2', NULL, 'metromallp-2', NULL, NULL, '89009786',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11029, 'metromall азимаркет', NULL, 'metromallазимаркет', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11030, 'modern nomads', NULL, 'modernnomads', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11031, 'mojista хдэлгүүр', NULL, 'mojistaхдэлгүүр', NULL, NULL, '95112462',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11032, 'mongolia restaurant', NULL, 'mongoliarestaurant', '2090481', NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11033, 'mors tuv', NULL, 'morstuv', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11034, 'mrs 1', NULL, 'mrs1', NULL, NULL, '91008178',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11035, 'my-do  кафе Бдээд', NULL, 'my-doкафеБдээд', '5724201', NULL, NULL,
    NULL, NULL, 2, 6,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11036, 'MМахны дэлгүүр 18байр налайх', NULL, 'MМахныдэлгүүр18байрналайх', NULL, NULL, '88944708',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11037, 'NTGS ХХК', NULL, 'NTGSХХК', '6006752', NULL, '88600353',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11038, 'okey смаркет БЗД', NULL, 'okeyсмаркетБЗД', NULL, NULL, '89694557',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11039, 'olink смаркет', NULL, 'olinkсмаркет', NULL, NULL, '99964644',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11040, 'on mart', NULL, 'onmart', NULL, NULL, '89606495',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11041, 'orange mart', NULL, 'orangemart', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11042, 'orange маркет', NULL, 'orangeмаркет', NULL, NULL, '95055225',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11043, 'orange төв П6', NULL, 'orangeтөвП6', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11044, 'orange хоол', NULL, 'orangeхоол', NULL, NULL, '70130113',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11045, 'peace', NULL, 'peace', NULL, NULL, '77110067',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11046, 'peace mart', 'НЭРГҮЙ', 'peacemart', 'ЕЙ85080901', NULL, '91152115',
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11047, 'PTL Дэлгүүр', NULL, 'PTLДэлгүүр', NULL, NULL, '95775307',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11048, 'Q mart1 ногоон төгөл', 'БИ ЭНД СИ ХАНА', 'Qmart1ногоонтөгөл', '2829339', NULL, '99771439',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11049, 'Q mart2 зайсан', 'БИ ЭНД СИ ХАНА', 'Qmart2зайсан', '2829339', NULL, '95011136',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11050, 'Ramen house', NULL, 'Ramenhouse', NULL, NULL, '99751009',
    NULL, NULL, 2, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11051, 'richo хдэлгүүр', NULL, 'richoхдэлгүүр', NULL, NULL, '99625223',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11052, 'river смаркет', 'БЭТЭБ', 'riverсмаркет', '5027225', 'river stone хотхон, алтай хотхоны урд', '95252117',
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11053, 's mart', NULL, 'smart', '5369258', NULL, '96061772',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11054, 's маркет мүис', NULL, 'sмаркетмүис', NULL, NULL, '96652098',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11055, 's.market 2давхар', NULL, 's.market2давхар', NULL, NULL, '94491611, 96061772',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11056, 's.market seven stars hajud', NULL, 's.marketsevenstarshajud', NULL, NULL, '99152617',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11057, 'safe life хдэлгүүр', NULL, 'safelifeхдэлгүүр', '2702193', NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11058, 'smart тэнгис ард', 'СМАРТ БХД', 'smartтэнгисард', '5369258', NULL, NULL,
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11059, 'st ммаркет', NULL, 'stммаркет', NULL, NULL, '88134434',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11060, 'star market', NULL, 'starmarket', NULL, NULL, '99125784',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11061, 'start хдэлгүүр', 'ЛОЯАЛ', 'startхдэлгүүр', '6048242', '4-р дэлгүүр, Start center', '91112077',
    NULL, NULL, 2, 16,
    'Сүхбаатар', true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11062, 'sunday 10', NULL, 'sunday10', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11063, 'Sunday 104', NULL, 'Sunday104', NULL, NULL, '99757360',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11064, 'Sunday 2', NULL, 'Sunday2', NULL, NULL, '96005900',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11065, 'Sunday 4', NULL, 'Sunday4', NULL, NULL, '95710661',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11066, 'sunday 5', NULL, 'sunday5', NULL, NULL, '95974155',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11067, 'sunday 8', NULL, 'sunday8', NULL, NULL, '9909550',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11068, 'Sunday 9', NULL, 'Sunday9', NULL, NULL, '99620964',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11069, 'sunday L-9', NULL, 'sundayL-9', NULL, NULL, '99620964',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11070, 'Sunday гэр ахуй', NULL, 'Sundayгэрахуй', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11071, 'Sunday ундаа', NULL, 'Sundayундаа', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11072, 'sunday хиам', NULL, 'sundayхиам', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11073, 'sunday хойно аман хуур', NULL, 'sundayхойноаманхуур', NULL, NULL, '99078370',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11074, 'sunday15', NULL, 'sunday15', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11075, 'sunday16', NULL, 'sunday16', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11076, 'sunday-Pod4', NULL, 'sunday-Pod4', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11077, 'Toffee', NULL, 'Toffee', NULL, NULL, '96823002',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11078, 'trendy mart', NULL, 'trendymart', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11079, 'Tsenos дэлгүүр', NULL, 'Tsenosдэлгүүр', NULL, NULL, '88051329',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11080, 'ub mart', NULL, 'ubmart', '2066505', NULL, '11-324403',
    NULL, NULL, 2, 11,
    NULL, true, 'Борлуулалт', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11081, 'ub смаркет', NULL, 'ubсмаркет', 'СЮ77090318', '19, UB town', '99641481',
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11082, 'V mart', NULL, 'Vmart', NULL, NULL, '94346233',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11083, 'white house-saranban', NULL, 'whitehouse-saranban', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11084, 'Аmenan', NULL, 'Аmenan', NULL, NULL, '96031163',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11085, 'Аutomall смаркет', NULL, 'Аutomallсмаркет', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11086, 'Аya kimbab', NULL, 'Аyakimbab', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11087, 'Ав хайрхан ', NULL, 'Авхайрхан', NULL, NULL, '88278790',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11088, 'агате хдэлгүүр', NULL, 'агатехдэлгүүр', NULL, NULL, '99751207',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11089, 'агниста хдэлгүүр суис хажууд', NULL, 'агнистахдэлгүүрсуисхажууд', NULL, NULL, '99067958',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11090, 'агуулах ажилчид', NULL, 'агуулахажилчид', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11091, 'Агь дэлгүүр', NULL, 'Агьдэлгүүр', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11092, 'агь дэлгүүр хүнс', NULL, 'агьдэлгүүрхүнс', NULL, NULL, '99882401',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11093, 'аз минимаркет', NULL, 'азминимаркет', NULL, NULL, '96336885',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11094, 'аз ммаркет 16хор', NULL, 'азммаркет16хор', NULL, NULL, '99918406',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11095, 'Аз смаркет', NULL, 'Азсмаркет', '5436494', NULL, '96336885',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11096, 'Азжин хдэлгүүр', NULL, 'Азжинхдэлгүүр', '5436494', NULL, '96656885',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11097, 'ази маркет', NULL, 'азимаркет', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11098, 'ази фарм', NULL, 'азифарм', '5697289', NULL, '94009001',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11099, 'Айзам хдэлгүүр', NULL, 'Айзамхдэлгүүр', NULL, NULL, '99499419',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11100, 'Алмаз хдэлгүүр', NULL, 'Алмазхдэлгүүр', NULL, NULL, '99075522',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11101, 'Алтан', NULL, 'Алтан', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11102, 'Алтан тариа 13', NULL, 'Алтантариа13', NULL, NULL, '94807898',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11103, 'Алтан тариа Чингэлтэй', NULL, 'АлтантариаЧингэлтэй', NULL, NULL, '99165944',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11104, 'Алтан тээл', NULL, 'Алтантээл', NULL, NULL, '91520909',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11105, 'алтан тээл 7буудал', NULL, 'алтантээл7буудал', NULL, NULL, '91520909',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11106, 'Алтанбосго', NULL, 'Алтанбосго', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11107, 'Алтантариа', NULL, 'Алтантариа', NULL, NULL, '99165944',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11108, 'алтантариа 5шар со хүнс тасаг', NULL, 'алтантариа5шарсохүнстасаг', NULL, NULL, '95804444',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11109, 'Алтантариа хдэлгүүр', NULL, 'Алтантариахдэлгүүр', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11110, 'Алтантариа хдэлгүүр', NULL, 'Алтантариахдэлгүүр', NULL, NULL, '94181146',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11111, 'алтантарий өргөө', 'НММ ЧАНДМАНЬ', 'алтантарийөргөө', '6356729', NULL, '98984050',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11112, 'Алтантөгрөг Л10', NULL, 'АлтантөгрөгЛ10', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11113, 'Алтантөгрөг Л11', NULL, 'АлтантөгрөгЛ11', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11114, 'Алтжин 1220', NULL, 'Алтжин1220', NULL, NULL, '8816-9537',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11115, 'алтжин 1221', NULL, 'алтжин1221', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11116, 'алтжин 1222', NULL, 'алтжин1222', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11117, 'Алтжин 1251', NULL, 'Алтжин1251', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11118, 'Алтжин 1258', NULL, 'Алтжин1258', NULL, NULL, '99974963',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11119, 'алтжин 1356', NULL, 'алтжин1356', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11120, 'алтжин 1364', NULL, 'алтжин1364', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11121, 'Алтжин 1501', NULL, 'Алтжин1501', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11122, 'Алтжин 1502', NULL, 'Алтжин1502', NULL, NULL, '89361369',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11123, 'Алтжин 1503', NULL, 'Алтжин1503', NULL, NULL, '89951747',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11124, 'алтжин 1504', NULL, 'алтжин1504', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11125, 'алтжин 1521', NULL, 'алтжин1521', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11126, 'алтжин 1528', NULL, 'алтжин1528', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11127, 'Алтжин 1532', NULL, 'Алтжин1532', NULL, NULL, '89045990',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11128, 'Алтжин 1534', NULL, 'Алтжин1534', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11129, 'Алтжин 1535', 'Мизүми но хана', 'Алтжин1535', '6867588', NULL, '96092019',
    NULL, NULL, 1, 6,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11130, 'алтжин 1537', NULL, 'алтжин1537', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11131, 'Алтжин 1540', NULL, 'Алтжин1540', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11132, 'Алтжин 1542', NULL, 'Алтжин1542', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11133, 'Алтжин 1545', NULL, 'Алтжин1545', NULL, NULL, '99156985',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11134, 'алтжин 1546', 'Инжир-Оюу', 'алтжин1546', '5073898', NULL, NULL,
    NULL, NULL, 1, 12,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11135, 'Алтжин 1547', NULL, 'Алтжин1547', NULL, NULL, '99788478',
    NULL, NULL, 1, 6,
    NULL, false, 'Данс', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11136, 'алтжин 1548', NULL, 'алтжин1548', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11137, 'алтжин 1560', NULL, 'алтжин1560', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11138, 'Алтжин 1565', NULL, 'Алтжин1565', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11139, 'алтжин 1565', NULL, 'алтжин1565', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11140, 'Алтжин 1585', NULL, 'Алтжин1585', NULL, NULL, '80612171',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11141, 'алтжин 4хоол', NULL, 'алтжин4хоол', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11142, 'Алтжин нарийн ногоо', NULL, 'Алтжиннарийнногоо', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11143, 'Алтжин өндөг 2', NULL, 'Алтжинөндөг2', NULL, NULL, '96004459',
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11144, 'Алтжин1528', NULL, 'Алтжин1528', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11145, 'аман хуур старкет зах', NULL, 'аманхуурстаркетзах', '5395631', NULL, '99078370',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11146, 'Амар смаркет', NULL, 'Амарсмаркет', NULL, NULL, '95604501',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11147, 'Амгалан 01', NULL, 'Амгалан01', NULL, NULL, '89053330',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11148, 'Амгалан 05', NULL, 'Амгалан05', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11149, 'Амгалан 07', NULL, 'Амгалан07', NULL, NULL, '9198-0885',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11150, 'Амгалан 09', NULL, 'Амгалан09', NULL, NULL, '99651718',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11151, 'Амгалан 116', NULL, 'Амгалан116', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11152, 'Амгалан 13', NULL, 'Амгалан13', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11153, 'Амгалан 14', NULL, 'Амгалан14', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11154, 'Амгалан 15', NULL, 'Амгалан15', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11155, 'Амгалан 16', NULL, 'Амгалан16', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11156, 'амгалан 17', NULL, 'амгалан17', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11157, 'Амгалан 20', NULL, 'Амгалан20', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11158, 'Амгалан 21', NULL, 'Амгалан21', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11159, 'Амгалан 23', NULL, 'Амгалан23', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11160, 'Амгалан 24', NULL, 'Амгалан24', NULL, NULL, '91016169',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11161, 'Амгалан 25', NULL, 'Амгалан25', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11162, 'Амгалан 27', NULL, 'Амгалан27', NULL, NULL, '94059069',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11163, 'Амгалан 28', NULL, 'Амгалан28', NULL, NULL, '94059069',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11164, 'Амгалан 29', NULL, 'Амгалан29', NULL, NULL, '96038636',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11165, 'амгалан 3', NULL, 'амгалан3', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11166, 'Амгалан 30', 'Түвшин үжин', 'Амгалан30', '6706509', NULL, '88743374',
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11167, 'Амгалан 32', 'Түвшин үжин', 'Амгалан32', '6706509', NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11168, 'Амгалан 33', 'ЦЭВЭЛМАА', 'Амгалан33', 'ЦД81093008', NULL, '88013994',
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11169, 'Амгалан 34', NULL, 'Амгалан34', NULL, NULL, '88924428',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11170, 'амгалан 35', NULL, 'амгалан35', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11171, 'Амгалан 36', NULL, 'Амгалан36', NULL, NULL, '96641041',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11172, 'амгалан 37', NULL, 'амгалан37', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11173, 'Амгалан 38', NULL, 'Амгалан38', NULL, NULL, '88018493',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11174, 'амгалан 40', 'ПАГМАСҮРЭН', 'амгалан40', 'ЖИ76012004', NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11175, 'Амгалан 41', NULL, 'Амгалан41', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11176, 'амгалан 42', 'БИЗЪЯА СЭРЖМАА', 'амгалан42', 'УС68012408', NULL, NULL,
    NULL, NULL, 1, 12,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11177, 'амгалан 44', NULL, 'амгалан44', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11178, 'Амгалан 45', NULL, 'Амгалан45', NULL, NULL, '99247108',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11179, 'Амгалан 46', NULL, 'Амгалан46', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11180, 'амгалан 48', NULL, 'амгалан48', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11181, 'Амгалан all', NULL, 'Амгаланall', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11182, 'Амгалан со хүнс', NULL, 'Амгалансохүнс', NULL, NULL, '89113267',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11183, 'Амгалан хдэлгүүр', NULL, 'Амгаланхдэлгүүр', NULL, NULL, '94258222',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11184, 'амгалан-35', NULL, 'амгалан-35', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11185, 'аменан  5р сур', NULL, 'аменан5рсур', NULL, NULL, '96031163',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11186, 'Америк тахиа', NULL, 'Америктахиа', '5169496', NULL, '99302123',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11187, 'Американ дэнж смаркет', 'Амархалиун', 'Американдэнжсмаркет', '5476399', NULL, '98188809',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11188, 'амеркан дэнж смаркет', NULL, 'амеркандэнжсмаркет', NULL, NULL, '98188809',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11189, 'амин ундрал офицер', NULL, 'аминундралофицер', NULL, NULL, '99596755',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11190, 'Амт хдэлгүүр 5сур', NULL, 'Амтхдэлгүүр5сур', '5720885', NULL, '99107649',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11191, 'амт2 мзавьяа', NULL, 'амт2мзавьяа', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11192, 'Амталгаа', NULL, 'Амталгаа', NULL, NULL, NULL,
    NULL, NULL, 18, 8,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11193, 'Амтат зоог', NULL, 'Амтатзоог', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11194, 'Амтлаг ', NULL, 'Амтлаг', NULL, NULL, '95953047',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11195, 'Амуу бөөний төв', NULL, 'Амуубөөнийтөв', NULL, NULL, '91915645',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11196, 'Анааш ммаркет хор эцэс', NULL, 'Анаашммаркетхорэцэс', NULL, NULL, '86868568',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11197, 'анар хдэлгүүр цамба', NULL, 'анархдэлгүүрцамба', NULL, NULL, '94479279',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11198, 'Анар хүнс', NULL, 'Анархүнс', NULL, NULL, '96869087',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11199, 'Анар хүнсний дэлгүүр', NULL, 'Анархүнснийдэлгүүр', NULL, NULL, '96098983',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11200, 'анд хдэлгүүр', NULL, 'андхдэлгүүр', '6411932', 'Autoplaza-н зүүн талд Саруул-н хойно', '89892808',
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11201, 'Андууд смаркет', NULL, 'Андуудсмаркет', NULL, NULL, '70005759',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11202, 'Андууд со хүнс', NULL, 'Андуудсохүнс', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11203, 'анир хдэлгүүр бдээд', NULL, 'анирхдэлгүүрбдээд', NULL, NULL, '99898899',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11204, 'Анно хороолол', NULL, 'Аннохороолол', NULL, NULL, '95122183',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11205, 'Ану хдэлгүүр', 'ХАМГИЙН ХАМГИЙН БАЯН', 'Анухдэлгүүр', '5857171', '3-р сур хойно, 44-р байр', '99104919',
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11206, 'Ар өвөр со хүнс', NULL, 'Арөвөрсохүнс', NULL, NULL, '96626767',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11207, 'Арвижих хдэлгүүр', NULL, 'Арвижиххдэлгүүр', '5448077', NULL, '94949195',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11208, 'арвин бзд', NULL, 'арвинбзд', NULL, NULL, '89070322',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11209, 'арвин бичил хор', 'БГЧ', 'арвинбичилхор', '5500168', NULL, '96554812',
    NULL, NULL, 2, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11210, 'Арвин смаркет', 'БАТТҮВШИН ТРЭЙД', 'Арвинсмаркет', '2692163', 'Гэмтлийн зүүн хаалга, Wellmart-н хойно', '88042562',
    NULL, NULL, 2, 16,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11211, 'Арвин тэнгис', NULL, 'Арвинтэнгис', NULL, NULL, '99145312',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11212, 'Ард яргуй', NULL, 'Ардяргуй', NULL, NULL, NULL,
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11213, 'Аривжих маркет', NULL, 'Аривжихмаркет', NULL, NULL, '88117300',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11214, 'архангай тариат', NULL, 'архангайтариат', NULL, NULL, '99029754',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11215, 'Асайт 20', NULL, 'Асайт20', NULL, NULL, '8802-2807',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11216, 'асайт 21', NULL, 'асайт21', NULL, NULL, '88057682',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11217, 'Асайт 21', NULL, 'Асайт21', NULL, NULL, '88057682',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11218, 'асайт 22', NULL, 'асайт22', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11219, 'Асайт 23', NULL, 'Асайт23', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11220, 'Асайт 35', NULL, 'Асайт35', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11221, 'Асайт 38', NULL, 'Асайт38', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11222, 'асайт 40', NULL, 'асайт40', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11223, 'асайт 41', NULL, 'асайт41', NULL, NULL, ',',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11224, 'асайт 45', NULL, 'асайт45', NULL, NULL, NULL,
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11225, 'асайт гурил ', 'БАДАМ', 'асайтгурил', 'ЙЗ70081203', NULL, '99012241',
    NULL, NULL, 1, 7,
    NULL, true, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11226, 'асайт42', NULL, 'асайт42', NULL, NULL, '89911889',
    NULL, NULL, 1, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11227, 'Астра смаркет', NULL, 'Астрасмаркет', NULL, NULL, '98088005',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11228, 'Ачмаг нуур', NULL, 'Ачмагнуур', NULL, NULL, '89938448',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11229, 'аяа кимбаб', 'Чү арх', 'аяакимбаб', '6644813', NULL, '91375151',
    NULL, NULL, 2, 12,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11230, 'аяа кимбаб богд ар', 'Чү арх', 'аяакимбаббогдар', '6644813', NULL, '91375151',
    NULL, NULL, 2, 12,
    NULL, true, 'Бэлэн', 'Зүг оруулаагүй байна'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11231, 'Бадархундага хдэлгүүр', NULL, 'Бадархундагахдэлгүүр', NULL, NULL, '99280845',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11232, 'Бар хдэлгүүр', NULL, 'Бархдэлгүүр', NULL, NULL, '89915676',
    NULL, NULL, 2, 7,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (
    id, name, real_name, name_2, legacy_customer_id, address, phone_number,
    location_latitude, location_longitude, customer_type_id, assigned_agent_id,
    registration_number, is_vat_payer, payment_terms, direction
) VALUES (
    11233, 'барс  с1', NULL, 'барсс1', NULL, NULL, NULL,
    NULL, NULL, 1, 6,
    NULL, false, 'Бэлэн', NULL
) ON CONFLICT (id) DO NOTHING;
