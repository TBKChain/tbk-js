// @flow

import {BvmAcct} from '../src/bvm-acct';
import {BudgetController} from '../src/bvm-script';

test('pay', () => {
  const from = new BvmAcct();
  const controller = new BvmAcct();
  const to = new BvmAcct();
  let transaction;

  transaction = BudgetController.pay(
    from.pubKey,
    controller.pubKey,
    to.pubKey,
    123,
  );
  expect(transaction.operations[0].keys).toHaveLength(2);
  expect(transaction.operations[1].keys).toHaveLength(2);
  // TODO: Validate transaction contents more

  transaction = BudgetController.pay(
    from.pubKey,
    controller.pubKey,
    to.pubKey,
    123,
    BudgetController.signatureCond(from.pubKey),
  );
  expect(transaction.operations[0].keys).toHaveLength(2);
  expect(transaction.operations[1].keys).toHaveLength(1);
  // TODO: Validate transaction contents more

  transaction = BudgetController.pay(
    from.pubKey,
    controller.pubKey,
    to.pubKey,
    123,
    BudgetController.signatureCond(from.pubKey),
    BudgetController.datetimeCond(from.pubKey, new Date()),
  );
  expect(transaction.operations[0].keys).toHaveLength(2);
  expect(transaction.operations[1].keys).toHaveLength(1);
  // TODO: Validate transaction contents more

  transaction = BudgetController.payOnAll(
    from.pubKey,
    controller.pubKey,
    to.pubKey,
    123,
    BudgetController.signatureCond(from.pubKey),
    BudgetController.datetimeCond(from.pubKey, new Date()),
  );
  expect(transaction.operations[0].keys).toHaveLength(2);
  expect(transaction.operations[1].keys).toHaveLength(1);
  // TODO: Validate transaction contents more
});

test('apply', () => {
  const from = new BvmAcct();
  const controller = new BvmAcct();
  const to = new BvmAcct();
  let transaction;

  transaction = BudgetController.sealWithDatetime(
    from.pubKey,
    controller.pubKey,
    to.pubKey,
    new Date(),
  );
  expect(transaction.keys).toHaveLength(3);
  // TODO: Validate transaction contents more

  transaction = BudgetController.sealWithSignature(
    from.pubKey,
    controller.pubKey,
    to.pubKey,
  );
  expect(transaction.keys).toHaveLength(3);
  // TODO: Validate transaction contents more
});
