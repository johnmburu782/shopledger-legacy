var test = require('node:test');
var assert = require('node:assert/strict');
var inventory = require('../lib/inventory');
var orders = require('../lib/orders');

test('an order may consume the exact remaining sellable stock', function () {
  var products = [{ id: 8, name: 'Test product', stock: 4, reserved: 3 }];

  assert.deepEqual(inventory.check(products, [{ id: 8, qty: 1 }]), { ok: true });
});

test('cancelling an order returns its items to physical stock', function () {
  var db = {
    nextOrderId: 1001,
    orders: [],
    products: [{ id: 7, name: 'Test product', stock: 4, reserved: 2 }],
    customers: []
  };

  var order = orders.add(db, {
    items: [{ id: 7, qty: 3 }],
    total: 30
  });
  db.products[0].stock -= 3;

  var result = orders.cancel(db, order.id, 'Test cancellation');

  assert.equal(result.ok, true);
  assert.equal(db.products[0].stock, 4);
  assert.equal(db.products[0].reserved, 2);
});
