// ===== TRANSLATIONS.JS =====
const translations = {
  en: {
    // Sidebar Navigation
    dashboard: "Dashboard",
    transactions: "Transactions",
    wallet: "Wallet",
    goals: "Goals",
    users: "Users",
    settings: "Settings",
    
    // Dashboard
    welcome: "Welcome",
    total_balance: "Total balance",
    income: "Income",
    expenses: "Expenses",
    total_savings: "Total Savings",
    money_flow: "Money flow",
    budget: "Budget (expense)",
    vs_last_month: "vs last month",
    
    // Form Labels
    amount: "Amount",
    category: "Category",
    type: "Type",
    date: "Date",
    add_transaction: "Add Transaction",
    
    // Goals
    goal_name: "Goal Name",
    target_amount: "Target Amount",
    current_saved: "Current Saved Amount",
    add_goal: "Add Goal",
    your_goals: "Your goals",
    
    // Wallet
    credit_card: "Credit Card",
    savings_card: "Savings Card",
    generate_new_card: "Generate New Card",
    delete_card: "Delete Card",
    create_savings_card: "Create Savings Card",
    
    // Transactions
    recent_transactions: "Recent Transactions",
    all_transactions: "All Transactions",
    
    // Users
    manage_users: "Manage Users",
    add_user: "Add User",
    user_list: "User List",
    name: "Name",
    email: "Email",
    password: "Password",
    role: "Role",
    actions: "Actions",
    
    // Settings
    language: "Language",
    logout: "Logout",
    theme: "Theme"
  },
  fr: {
    // Sidebar Navigation
    dashboard: "Tableau de bord",
    transactions: "Transactions",
    wallet: "Portefeuille",
    goals: "Objectifs",
    users: "Utilisateurs",
    settings: "Paramètres",
    
    // Dashboard
    welcome: "Bienvenue",
    total_balance: "Solde total",
    income: "Revenus",
    expenses: "Dépenses",
    total_savings: "Économies totales",
    money_flow: "Flux d'argent",
    budget: "Budget (dépenses)",
    vs_last_month: "vs mois dernier",
    
    // Form Labels
    amount: "Montant",
    category: "Catégorie",
    type: "Type",
    date: "Date",
    add_transaction: "Ajouter une transaction",
    
    // Goals
    goal_name: "Nom de l'objectif",
    target_amount: "Montant cible",
    current_saved: "Montant économisé",
    add_goal: "Ajouter un objectif",
    your_goals: "Vos objectifs",
    
    // Wallet
    credit_card: "Carte de crédit",
    savings_card: "Compte d'épargne",
    generate_new_card: "Générer une nouvelle carte",
    delete_card: "Supprimer la carte",
    create_savings_card: "Créer un compte d'épargne",
    
    // Transactions
    recent_transactions: "Transactions récentes",
    all_transactions: "Toutes les transactions",
    
    // Users
    manage_users: "Gérer les utilisateurs",
    add_user: "Ajouter un utilisateur",
    user_list: "Liste des utilisateurs",
    name: "Nom",
    email: "Email",
    password: "Mot de passe",
    role: "Rôle",
    actions: "Actions",
    
    // Settings
    language: "Langue",
    logout: "Déconnexion",
    theme: "Thème"
  }
};

// ===== I18N.JS =====
let currentLanguage = localStorage.getItem('language') || 'en';

// Get translation
function t(key) {
  return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Change language
function changeLanguage(lang) {
  if (lang === 'en' || lang === 'fr') {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
  }
}

// Update all text on page
function updatePageLanguage() {
  // Nav items
  document.querySelectorAll('.nav-item span').forEach((el, idx) => {
    const keys = ['dashboard', 'transactions', 'wallet', 'goals', 'users', 'settings'];
    if (keys[idx]) el.textContent = t(keys[idx]);
  });
  
  // Headers
  document.querySelectorAll('h2').forEach((el) => {
    const text = el.textContent.toLowerCase();
    if (text.includes('dashboard')) el.textContent = t('dashboard');
    if (text.includes('transaction')) el.textContent = t('transactions');
    if (text.includes('wallet')) el.textContent = t('wallet');
    if (text.includes('goal')) el.textContent = t('goals');
    if (text.includes('settings')) el.textContent = t('settings');
  });
  
  // Form labels
  document.querySelectorAll('.form-label').forEach((el) => {
    const text = el.textContent.toLowerCase();
    if (text.includes('amount')) el.textContent = t('amount');
    if (text.includes('category')) el.textContent = t('category');
    if (text.includes('type')) el.textContent = t('type');
    if (text.includes('date')) el.textContent = t('date');
  });
  
  // Buttons
  const btns = document.querySelectorAll('button');
  btns.forEach((btn) => {
    const text = btn.textContent.toLowerCase();
    if (text.includes('add transaction')) btn.textContent = t('add_transaction');
    if (text.includes('add goal')) btn.textContent = t('add_goal');
    if (text.includes('logout')) btn.textContent = t('logout');
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updatePageLanguage();
  
  // Language select listener
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = currentLanguage;
    langSelect.addEventListener('change', function(e) {
      changeLanguage(e.target.value);
    });
  }
});