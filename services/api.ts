// API service for fetching data from mock endpoints

// Types
import type {
  Card,
  Transaction,
  WeeklyActivity,
  ExpenseCategory,
  Contact,
  BalanceHistory,
} from '@/context/dashboard-context';


const API_BASE_URL = '/api';

const simulateApiDelay = (ms = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Fetch cards
export async function fetchCards(): Promise<Card[]> {
  await simulateApiDelay();
  return [
    {
      id: 'card1',
      balance: 5756,
      cardHolder: 'Eddy Cusuma',
      cardNumber: '3778 **** **** 1234',
      validThru: '12/22',
      isDefault: true,
    },
    {
      id: 'card2',
      balance: 3280,
      cardHolder: 'Eddy Cusuma',
      cardNumber: '4539 **** **** 5789',
      validThru: '08/24',
      isDefault: false,
    },
    {
      id: 'card3',
      balance: 1890,
      cardHolder: 'Eddy Cusuma',
      cardNumber: '5267 **** **** 7591',
      validThru: '05/23',
      isDefault: false,
    },
  ];
}

// Fetch transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  await simulateApiDelay();
  return [
    {
      id: 'tx1',
      type: 'withdrawal',
      amount: 850,
      description: 'Deposit from my Card',
      date: '28 January 2021',
      icon: 'card',
      iconBg: '#FFF5D9',
    },
    {
      id: 'tx2',
      type: 'deposit',
      amount: 2500,
      description: 'Deposit Paypal',
      date: '25 January 2021',
      icon: 'paypal',
      iconBg: '#E7EDFF',
    },
    {
      id: 'tx3',
      type: 'deposit',
      amount: 5400,
      description: 'Jemi Wilson',
      date: '21 January 2021',
      icon: 'user',
      iconBg: '#DCFAF8',
    },
  ];
}

// Fetch weekly activity data
export async function fetchWeeklyActivity(): Promise<WeeklyActivity[]> {
  await simulateApiDelay();
  return [
    { day: 'Sat', deposit: 91, withdrawal: 178 },
    { day: 'Sun', deposit: 49, withdrawal: 130 },
    { day: 'Mon', deposit: 98, withdrawal: 122 },
    { day: 'Tue', deposit: 138, withdrawal: 178 },
    { day: 'Wed', deposit: 91, withdrawal: 57 },
    { day: 'Thu', deposit: 91, withdrawal: 145 },
    { day: 'Fri', deposit: 126, withdrawal: 147 },
  ];
}

// Fetch expense categories
export async function fetchExpenseCategories(): Promise<ExpenseCategory[]> {
  await simulateApiDelay();
  return [
    { category: 'Bill Expense', percentage: 25, color: '#FC7900' },
    { category: 'Entertainment', percentage: 30, color: '#343C6A' },
    { category: 'Investment', percentage: 20, color: '#396AFF' },
    { category: 'Others', percentage: 25, color: '#232323' },
  ];
}

// Fetch contacts for quick transfer
export async function fetchContacts(): Promise<Contact[]> {
  await simulateApiDelay();
  return [
    {
      id: 'contact1',
      name: 'Livia Bator',
      role: 'CEO',
      avatar: '/dashboardAssets/livia.png',
    },
    {
      id: 'contact2',
      name: 'Randy Press',
      role: 'Director',
      avatar: '/dashboardAssets/randy.png',
    },
    {
      id: 'contact3',
      name: 'Workman',
      role: 'Designer',
      avatar: '/dashboardAssets/workman.png',
    },
  ];
}

// Fetch balance history
export async function fetchBalanceHistory(): Promise<BalanceHistory[]> {
  await simulateApiDelay();
  return [
    { month: 'Jul', balance: 120 },
    { month: 'Aug', balance: 340 },
    { month: 'Sep', balance: 490 },
    { month: 'Oct', balance: 780 },
    { month: 'Nov', balance: 220 },
    { month: 'Dec', balance: 580 },
    { month: 'Jan', balance: 640 },
  ];
}
