// Translation system for Mongolian and English
export type Language = 'mn' | 'en';

export interface Translations {
  auth: {
    invalidCredentials: string;
    accountDeactivated: string;
    loginSuccess: string;
    unauthorized: string;
    forbidden: string;
    tokenExpired: string;
    invalidToken: string;
  };
  employees: {
    created: string;
    updated: string;
    deleted: string;
    notFound: string;
    emailExists: string;
    cannotDeactivateSelf: string;
    listRetrieved: string;
  };
  products: {
    created: string;
    updated: string;
    notFound: string;
    codeExists: string;
    barcodeExists: string;
    insufficientStock: string;
    inventoryAdjusted: string;
    listRetrieved: string;
  };
  customers: {
    created: string;
    updated: string;
    deleted: string;
    notFound: string;
    listRetrieved: string;
  };
  orders: {
    created: string;
    updated: string;
    notFound: string;
    statusUpdated: string;
    cannotCancel: string;
    invalidStatus: string;
    listRetrieved: string;
    noItems: string;
    invalidDeliveryDate: string;
  };
  returns: {
    created: string;
    notFound: string;
    orderNotFound: string;
    productNotInOrder: string;
    invalidQuantity: string;
    listRetrieved: string;
  };
  categories: {
    created: string;
    updated: string;
    deleted: string;
    notFound: string;
    nameExists: string;
    listRetrieved: string;
  };
  stores: {
    created: string;
    updated: string;
    deleted: string;
    notFound: string;
    nameExists: string;
    hasActiveEmployees: string;
    listRetrieved: string;
  };
  payments: {
    created: string;
    updated: string;
    notFound: string;
    orderNotFound: string;
    invalidAmount: string;
    listRetrieved: string;
  };
  analytics: {
    calculated: string;
    forecastGenerated: string;
    dataRetrieved: string;
    noData: string;
  };
  reports: {
    generated: string;
    noData: string;
  };
  common: {
    success: string;
    error: string;
    notFound: string;
    validationError: string;
    serverError: string;
    badRequest: string;
    created: string;
    updated: string;
    deleted: string;
  };
  paymentMethod: {
    Cash: string;
    Card: string;
    BankTransfer: string;
    Credit: string;
    QR: string;
    Mobile: string;
  };
  orderStatus: {
    Pending: string;
    Fulfilled: string;
    Cancelled: string;
    Delivered: string;
  };
  paymentStatus: {
    Pending: string;
    Paid: string;
    Partial: string;
    Overdue: string;
  };
}

// Mongolian translations
export const mn: Translations = {
  auth: {
    invalidCredentials: 'Нэвтрэх нэр эсвэл нууц үг буруу байна',
    accountDeactivated: 'Таны данс идэвхгүй болсон байна',
    loginSuccess: 'Амжилттай нэвтэрлээ',
    unauthorized: 'Нэвтрэх шаардлагатай',
    forbidden: 'Хандах эрх хүрэлцэхгүй байна',
    tokenExpired: 'Таны нэвтрэх хугацаа дууссан байна',
    invalidToken: 'Буруу токен',
  },
  employees: {
    created: 'Ажилтан амжилттай үүсгэлээ',
    updated: 'Ажилтны мэдээлэл шинэчлэгдлээ',
    deleted: 'Ажилтан устгагдлаа',
    notFound: 'Ажилтан олдсонгүй',
    emailExists: 'Энэ имэйл хаяг бүртгэгдсэн байна',
    cannotDeactivateSelf: 'Өөрийгөө идэвхгүй болгох боломжгүй',
    listRetrieved: 'Ажилтнуудын жагсаалт',
  },
  products: {
    created: 'Бараа амжилттай үүсгэлээ',
    updated: 'Барааны мэдээлэл шинэчлэгдлээ',
    notFound: 'Бараа олдсонгүй',
    codeExists: 'Энэ кодтой бараа аль хэдийн бүртгэгдсэн байна',
    barcodeExists: 'Энэ баркодтой бараа аль хэдийн бүртгэгдсэн байна',
    insufficientStock: 'Барааны үлдэгдэл хүрэлцэхгүй байна',
    inventoryAdjusted: 'Барааны үлдэгдэл шинэчлэгдлээ',
    listRetrieved: 'Барааны жагсаалт',
  },
  customers: {
    created: 'Харилцагч амжилттай үүсгэлээ',
    updated: 'Харилцагчийн мэдээлэл шинэчлэгдлээ',
    deleted: 'Харилцагч устгагдлаа',
    notFound: 'Харилцагч олдсонгүй',
    listRetrieved: 'Харилцагчдын жагсаалт',
  },
  orders: {
    created: 'Захиалга амжилттай үүсгэлээ',
    updated: 'Захиалга шинэчлэгдлээ',
    notFound: 'Захиалга олдсонгүй',
    statusUpdated: 'Захиалгын төлөв өөрчлөгдлөө',
    cannotCancel: 'Энэ захиалгыг цуцлах боломжгүй',
    invalidStatus: 'Буруу төлөв',
    listRetrieved: 'Захиалгуудын жагсаалт',
    noItems: 'Захиалгад бараа байхгүй байна',
    invalidDeliveryDate: 'Хүргэлтийн огноо маргааш буюу түүнээс хойш байх ёстой',
  },
  returns: {
    created: 'Буцаалт амжилттай бүртгэгдлээ',
    notFound: 'Буцаалт олдсонгүй',
    orderNotFound: 'Захиалга олдсонгүй',
    productNotInOrder: 'Энэ бараа захиалгад байхгүй байна',
    invalidQuantity: 'Буцаах тоо ширхэг захиалсан тоо ширхгээс их байж болохгүй',
    listRetrieved: 'Буцаалтын жагсаалт',
  },
  categories: {
    created: 'Ангилал амжилттай үүсгэлээ',
    updated: 'Ангилал шинэчлэгдлээ',
    deleted: 'Ангилал устгагдлаа',
    notFound: 'Ангилал олдсонгүй',
    nameExists: 'Энэ нэртэй ангилал аль хэдийн бүртгэгдсэн байна',
    listRetrieved: 'Ангиллын жагсаалт',
  },
  stores: {
    created: 'Дэлгүүр амжилттай үүсгэлээ',
    updated: 'Дэлгүүрийн мэдээлэл шинэчлэгдлээ',
    deleted: 'Дэлгүүр устгагдлаа',
    notFound: 'Дэлгүүр олдсонгүй',
    nameExists: 'Энэ нэртэй дэлгүүр аль хэдийн бүртгэгдсэн байна',
    hasActiveEmployees: 'Идэвхтэй ажилтантай дэлгүүрийг идэвхгүй болгох боломжгүй',
    listRetrieved: 'Дэлгүүрүүдийн жагсаалт',
  },
  payments: {
    created: 'Төлбөр амжилттай бүртгэгдлээ',
    updated: 'Төлбөрийн мэдээлэл шинэчлэгдлээ',
    notFound: 'Төлбөр олдсонгүй',
    orderNotFound: 'Захиалга олдсонгүй',
    invalidAmount: 'Төлбөрийн дүн буруу байна',
    listRetrieved: 'Төлбөрийн жагсаалт',
  },
  analytics: {
    calculated: 'Шинжилгээ тооцоолж дууслаа',
    forecastGenerated: 'Таамаглал үүсгэгдлээ',
    dataRetrieved: 'Шинжилгээний өгөгдөл',
    noData: 'Шинжилгээ хийх өгөгдөл олдсонгүй',
  },
  reports: {
    generated: 'Тайлан бэлэн боллоо',
    noData: 'Тайлан гаргах өгөгдөл олдсонгүй',
  },
  common: {
    success: 'Амжилттай',
    error: 'Алдаа гарлаа',
    notFound: 'Олдсонгүй',
    validationError: 'Оруулсан өгөгдөл буруу байна',
    serverError: 'Серверийн алдаа гарлаа',
    badRequest: 'Буруу хүсэлт',
    created: 'Амжилттай үүсгэлээ',
    updated: 'Амжилттай шинэчлэгдлээ',
    deleted: 'Амжилттай устгагдлаа',
  },
  paymentMethod: {
    Cash: 'Бэлэн',
    Card: 'Карт',
    BankTransfer: 'Шилжүүлэг',
    Credit: 'Зээл',
    QR: 'QR',
    Mobile: 'Гар утас',
  },
  orderStatus: {
    Pending: 'Хүлээгдэж буй',
    Fulfilled: 'Биелсэн',
    Cancelled: 'Цуцлагдсан',
    Delivered: 'Хүргэгдсэн',
  },
  paymentStatus: {
    Pending: 'Хүлээгдэж буй',
    Paid: 'Төлөгдсөн',
    Partial: 'Хэсэгчлэн төлөгдсөн',
    Overdue: 'Хугацаа хэтэрсэн',
  },
};

// English translations
export const en: Translations = {
  auth: {
    invalidCredentials: 'Invalid credentials',
    accountDeactivated: 'Account is deactivated',
    loginSuccess: 'Logged in successfully',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    tokenExpired: 'Token expired',
    invalidToken: 'Invalid token',
  },
  employees: {
    created: 'Employee created successfully',
    updated: 'Employee updated successfully',
    deleted: 'Employee deleted successfully',
    notFound: 'Employee not found',
    emailExists: 'Email already exists',
    cannotDeactivateSelf: 'Cannot deactivate yourself',
    listRetrieved: 'Employees list retrieved',
  },
  products: {
    created: 'Product created successfully',
    updated: 'Product updated successfully',
    notFound: 'Product not found',
    codeExists: 'Product with this code already exists',
    barcodeExists: 'Product with this barcode already exists',
    insufficientStock: 'Insufficient stock',
    inventoryAdjusted: 'Inventory adjusted successfully',
    listRetrieved: 'Products list retrieved',
  },
  customers: {
    created: 'Customer created successfully',
    updated: 'Customer updated successfully',
    deleted: 'Customer deleted successfully',
    notFound: 'Customer not found',
    listRetrieved: 'Customers list retrieved',
  },
  orders: {
    created: 'Order created successfully',
    updated: 'Order updated successfully',
    notFound: 'Order not found',
    statusUpdated: 'Order status updated',
    cannotCancel: 'Cannot cancel this order',
    invalidStatus: 'Invalid status',
    listRetrieved: 'Orders list retrieved',
    noItems: 'Order must have at least one item',
    invalidDeliveryDate: 'Delivery date must be tomorrow or later',
  },
  returns: {
    created: 'Return created successfully',
    notFound: 'Return not found',
    orderNotFound: 'Order not found',
    productNotInOrder: 'Product not found in this order',
    invalidQuantity: 'Return quantity cannot exceed ordered quantity',
    listRetrieved: 'Returns list retrieved',
  },
  categories: {
    created: 'Category created successfully',
    updated: 'Category updated successfully',
    deleted: 'Category deleted successfully',
    notFound: 'Category not found',
    nameExists: 'Category with this name already exists',
    listRetrieved: 'Categories list retrieved',
  },
  stores: {
    created: 'Store created successfully',
    updated: 'Store updated successfully',
    deleted: 'Store deleted successfully',
    notFound: 'Store not found',
    nameExists: 'Store with this name already exists',
    hasActiveEmployees: 'Cannot deactivate store with active employees',
    listRetrieved: 'Stores list retrieved',
  },
  payments: {
    created: 'Payment created successfully',
    updated: 'Payment updated successfully',
    notFound: 'Payment not found',
    orderNotFound: 'Order not found',
    invalidAmount: 'Invalid payment amount',
    listRetrieved: 'Payments list retrieved',
  },
  analytics: {
    calculated: 'Analytics calculated successfully',
    forecastGenerated: 'Forecast generated successfully',
    dataRetrieved: 'Analytics data retrieved',
    noData: 'No data available for analytics',
  },
  reports: {
    generated: 'Report generated successfully',
    noData: 'No data available for report',
  },
  common: {
    success: 'Success',
    error: 'Error',
    notFound: 'Not found',
    validationError: 'Validation error',
    serverError: 'Internal server error',
    badRequest: 'Bad request',
    created: 'Created successfully',
    updated: 'Updated successfully',
    deleted: 'Deleted successfully',
  },
  paymentMethod: {
    Cash: 'Cash',
    Card: 'Card',
    BankTransfer: 'Bank Transfer',
    Credit: 'Credit',
    QR: 'QR',
    Mobile: 'Mobile',
  },
  orderStatus: {
    Pending: 'Pending',
    Fulfilled: 'Fulfilled',
    Cancelled: 'Cancelled',
    Delivered: 'Delivered',
  },
  paymentStatus: {
    Pending: 'Pending',
    Paid: 'Paid',
    Partial: 'Partial',
    Overdue: 'Overdue',
  },
};

// All translations
export const translations = {
  mn,
  en,
};

