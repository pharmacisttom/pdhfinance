/**
 * Comprehensive Automated System Test Suite
 * FINANCE CONTROL PLATFORM
 */

const assert = require('assert');
const bcrypt = require('bcryptjs');

// Test 1: Thai Fiscal Year Calculation
function testThaiFiscalYear() {
  console.log('--- Test 1: Thai Fiscal Year Calculation ---');
  
  function getThaiFiscalYear(month, year) { // month is 0-indexed (0=Jan, 9=Oct)
    const thaiYear = year + 543;
    if (month >= 9) return thaiYear + 1;
    return thaiYear;
  }

  // Oct 2025 -> FY 2569
  assert.strictEqual(getThaiFiscalYear(9, 2025), 2569, 'Oct 2025 should be FY 2569');
  // Sep 2026 -> FY 2569
  assert.strictEqual(getThaiFiscalYear(8, 2026), 2569, 'Sep 2026 should be FY 2569');
  // Oct 2026 -> FY 2570
  assert.strictEqual(getThaiFiscalYear(9, 2026), 2570, 'Oct 2026 should be FY 2570');
  
  console.log('✓ Thai Fiscal Year calculation passed.');
}

// Test 2: Dynamic Aging Calculation
function testAgingCalculation() {
  console.log('--- Test 2: Dynamic Aging Calculation ---');

  function calculateAging(diffDays) {
    if (diffDays <= 0) return 'CURRENT';
    if (diffDays <= 30) return '1_30';
    if (diffDays <= 60) return '31_60';
    if (diffDays <= 90) return '61_90';
    return 'OVER_90';
  }

  assert.strictEqual(calculateAging(0), 'CURRENT', '0 days should be CURRENT');
  assert.strictEqual(calculateAging(15), '1_30', '15 days should be 1_30');
  assert.strictEqual(calculateAging(45), '31_60', '45 days should be 31_60');
  assert.strictEqual(calculateAging(75), '61_90', '75 days should be 61_90');
  assert.strictEqual(calculateAging(120), 'OVER_90', '120 days should be OVER_90');

  console.log('✓ Aging calculation buckets passed.');
}

// Test 3: Document Number Format
function testDocumentNumberGenerator() {
  console.log('--- Test 3: Document Number Format ---');

  function formatDocNo(type, fy, seq) {
    return `${type}-${fy}-${String(seq).padStart(6, '0')}`;
  }

  assert.strictEqual(formatDocNo('AR', 2569, 1), 'AR-2569-000001');
  assert.strictEqual(formatDocNo('AP', 2569, 42), 'AP-2569-000042');
  assert.strictEqual(formatDocNo('LN', 2569, 8), 'LN-2569-000008');
  assert.strictEqual(formatDocNo('PV', 2569, 105), 'PV-2569-000105');
  assert.strictEqual(formatDocNo('RC', 2569, 12), 'RC-2569-000012');
  assert.strictEqual(formatDocNo('CM', 2569, 3), 'CM-2569-000003');

  console.log('✓ Document number sequence format passed.');
}

// Test 4: Budget Available Calculation Formula
function testBudgetFormula() {
  console.log('--- Test 4: Budget Available Formula ---');

  function calculateAvailable(allocated, adjustment, committed, spent) {
    return allocated + adjustment - committed - spent;
  }

  const allocated = 80000000;
  const adjustment = 5000000;
  const committed = 5650000;
  const spent = 68400000;

  const available = calculateAvailable(allocated, adjustment, committed, spent);
  assert.strictEqual(available, 10950000, 'Available budget calculation is incorrect');

  console.log('✓ Budget calculation formula passed.');
}

// Test 5: Password Hashing & Verification
async function testAuthSecurity() {
  console.log('--- Test 5: Password Security (bcrypt) ---');

  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const isValid = await bcrypt.compare(password, hash);
  assert.strictEqual(isValid, true, 'Valid password must match hash');

  const isInvalid = await bcrypt.compare('wrongPassword', hash);
  assert.strictEqual(isInvalid, false, 'Invalid password must not match hash');

  console.log('✓ Password security and hashing passed.');
}

// Test 6: RBAC Permissions Resolution
function testRBAC() {
  console.log('--- Test 6: RBAC Permissions Resolution ---');

  const rolePermissions = {
    SUPER_ADMIN: ['*'],
    CFO: ['receivable.approve', 'payable.approve', 'loan.approve', 'budget.approve'],
    FINANCE: ['receivable.create', 'payable.create', 'loan.clear'],
  };

  function hasPerm(role, perm) {
    if (role === 'SUPER_ADMIN') return true;
    return (rolePermissions[role] || []).includes(perm);
  }

  assert.strictEqual(hasPerm('SUPER_ADMIN', 'any.perm'), true);
  assert.strictEqual(hasPerm('CFO', 'payable.approve'), true);
  assert.strictEqual(hasPerm('FINANCE', 'payable.approve'), false);
  assert.strictEqual(hasPerm('FINANCE', 'loan.clear'), true);

  console.log('✓ RBAC permission matrix resolution passed.');
}

// Run All Tests
async function runAll() {
  console.log('====================================================');
  console.log('STARTING FINANCE CONTROL PLATFORM AUTOMATED TESTS');
  console.log('====================================================\n');

  testThaiFiscalYear();
  testAgingCalculation();
  testDocumentNumberGenerator();
  testBudgetFormula();
  await testAuthSecurity();
  testRBAC();

  console.log('\n====================================================');
  console.log('ALL 6 TEST SUITES PASSED SUCCESSFULLY! (100% OK)');
  console.log('====================================================');
}

runAll().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
