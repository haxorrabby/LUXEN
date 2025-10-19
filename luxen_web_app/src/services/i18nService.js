const translations = {
  en: {
    dashboard: 'Dashboard',
    production: 'Production',
    sales: 'Sales',
    expenses: 'Expenses',
    warranty: 'Warranty',
    investment: 'Investment',
    reports: 'Reports',
    total_sales: 'Total Sales',
    total_expenses: 'Total Expenses',
    production_cost: 'Production Cost',
    profit_loss: 'Profit/Loss',
    add_batch: 'Add Production Batch',
    record_sale: 'Record Sale',
    add_expense: 'Add Expense',
    add_claim: 'Add Warranty Claim',
    add_owner: 'Add Owner',
    export_report: 'Export Report',
    customer_name: 'Customer Name',
    serial_numbers: 'Serial Numbers',
    unit_price: 'Unit Price',
    payment_status: 'Payment Status',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',
    owner_name: 'Owner Name',
    investment: 'Investment',
    ownership_percent: 'Ownership %',
    profit_share: 'Profit Share',
    roi: 'ROI %',
    welcome_message: "Welcome back! Here's your business overview.",
    ask_me_anything: "Ask me anything...",
    luxen_assistant: "LUXEN Assistant",
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    production: 'উৎপাদন',
    sales: 'বিক্রয়',
    expenses: 'খরচ',
    warranty: 'ওয়ারেন্টি',
    investment: 'বিনিয়োগ',
    reports: 'রিপোর্ট',
    total_sales: 'মোট বিক্রয়',
    total_expenses: 'মোট খরচ',
    production_cost: 'উৎপাদন খরচ',
    profit_loss: 'লাভ/ক্ষতি',
    add_batch: 'উৎপাদন ব্যাচ যোগ করুন',
    record_sale: 'বিক্রয় রেকর্ড করুন',
    add_expense: 'খরচ যোগ করুন',
    add_claim: 'ওয়ারেন্টি দাবি যোগ করুন',
    add_owner: 'মালিক যোগ করুন',
    export_report: 'রিপোর্ট এক্সপোর্ট করুন',
    customer_name: 'গ্রাহকের নাম',
    serial_numbers: 'সিরিয়াল নম্বর',
    unit_price: 'ইউনিট মূল্য',
    payment_status: 'পেমেন্টের অবস্থা',
    category: 'বিভাগ',
    amount: 'পরিমাণ',
    description: 'বিবরণ',
    owner_name: 'মালিকের নাম',
    investment: 'বিনিয়োগ',
    ownership_percent: 'মালিকানা %',
    profit_share: 'লাভের অংশ',
    roi: 'বিনিয়োগের উপর রিটার্ন %',
    welcome_message: "স্বাগতম! আপনার ব্যবসার সংক্ষিপ্ত বিবরণ এখানে।",
    ask_me_anything: "আমাকে কিছু জিজ্ঞাসা করুন...",
    luxen_assistant: "লাক্সেন সহকারী",
  },
};

const i18nService = {
  /**
   * Translates a key based on the current language.
   * @param {string} key - The translation key.
   * @param {string} lang - The current language ('en' or 'bn').
   * @returns {string} The translated string.
   */
  t: (key, lang) => {
    return translations[lang][key] || translations['en'][key] || key;
  },

  /**
   * Gets the full translation object for the current language.
   * @param {string} lang - The current language ('en' or 'bn').
   * @returns {Object} The translation object.
   */
  getTranslations: (lang) => {
    return translations[lang] || translations['en'];
  },
};

export default i18nService;

