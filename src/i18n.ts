export interface Translations {
  common: { serverError: string; validationError: string; };
  auth: { invalidCredentials: string; accountDeactivated: string; unauthorized: string; forbidden: string; };
  employees: { notFound: string; created: string; updated: string; deleted: string; emailExists: string; };
  customers: { notFound: string; };
  products: { notFound: string; codeExists: string; insufficientStock: string; };
  categories: { notFound: string; nameExists: string; };
  orders: { notFound: string; noItems: string; invalidDeliveryDate: string; };
  payments: { invalidAmount: string; orderNotFound: string; };
  returns: { notFound: string; orderNotFound: string; productNotInOrder: string; cannotDeleteInsufficientStock: string; deleted: string; };
  stores: { notFound: string; };
}

const translations: Record<string, Translations> = {
  mn: {
    common: { serverError: 'Серверийн алдаа гарлаа', validationError: 'Өгөгдөл буруу байна' },
    auth: { invalidCredentials: 'И-мэйл эсвэл нууц үг буруу байна', accountDeactivated: 'Таны эрх идэвхгүй байна', unauthorized: 'Нэвтрэх эрхгүй байна', forbidden: 'Хандах эрхгүй байна' },
    employees: { notFound: 'Ажилтан олдсонгүй', created: 'Ажилтан үүсгэгдлээ', updated: 'Ажилтан шинэчлэгдлээ', deleted: 'Ажилтан устгагдлаа', emailExists: 'И-мэйл бүртгэлтэй байна' },
    customers: { notFound: 'Харилцагч олдсонгүй' },
    products: { notFound: 'Бараа олдсонгүй', codeExists: 'Барааны код бүртгэлтэй байна', insufficientStock: 'Барааны үлдэгдэл хүрэлцэхгүй байна' },
    categories: { notFound: 'Ангилал олдсонгүй', nameExists: 'Ангиллын нэр бүртгэлтэй байна' },
    orders: { notFound: 'Захиалга олдсонгүй', noItems: 'Захиалгын бараа байхгүй байна', invalidDeliveryDate: 'Хүргэлтийн огноо буруу байна' },
    payments: { invalidAmount: 'Төлбөрийн дүн буруу байна', orderNotFound: 'Захиалга олдсонгүй' },
    returns: { notFound: 'Буцаалт олдсонгүй', orderNotFound: 'Захиалга олдсонгүй', productNotInOrder: 'Бараа захиалгад байхгүй', cannotDeleteInsufficientStock: 'Үлдэгдэл хүрэлцэхгүй тул устгах боломжгүй', deleted: 'Буцаалт устгагдлаа' },
    stores: { notFound: 'Дэлгүүр олдсонгүй' },
  },
  en: {
    common: { serverError: 'Internal server error', validationError: 'Validation error' },
    auth: { invalidCredentials: 'Invalid email or password', accountDeactivated: 'Account is deactivated', unauthorized: 'Unauthorized', forbidden: 'Forbidden' },
    employees: { notFound: 'Employee not found', created: 'Employee created', updated: 'Employee updated', deleted: 'Employee deleted', emailExists: 'Email already exists' },
    customers: { notFound: 'Customer not found' },
    products: { notFound: 'Product not found', codeExists: 'Product code already exists', insufficientStock: 'Insufficient stock' },
    categories: { notFound: 'Category not found', nameExists: 'Category name already exists' },
    orders: { notFound: 'Order not found', noItems: 'No items in order', invalidDeliveryDate: 'Invalid delivery date' },
    payments: { invalidAmount: 'Invalid payment amount', orderNotFound: 'Order not found' },
    returns: { notFound: 'Return not found', orderNotFound: 'Order not found', productNotInOrder: 'Product not in order', cannotDeleteInsufficientStock: 'Cannot delete: insufficient stock', deleted: 'Return deleted' },
    stores: { notFound: 'Store not found' },
  },
};

export const getLanguage = (req: any): 'mn' | 'en' => {
  return req.headers['accept-language']?.startsWith('en') ? 'en' : 'mn';
};

export const getTranslations = (lang: string): Translations => {
  return translations[lang] || translations.mn;
};

export const tLang = (lang: string): Translations => {
  return getTranslations(lang);
};
