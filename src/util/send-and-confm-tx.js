// @flow

import invariant from 'assert';

import {Connection} from '../connection';
import {Transaction} from '../transaction-controller';
import {sleep} from './sleep';
import type {BusAccount} from '../bus-account';
import type {TxnSignature} from '../transaction-controller';
import {DEFAULT_TICKS_PER_SLOT, NUM_TICKS_PER_SEC} from '../timing';

/**
 * Sign, send and confirm a transaction
 */
export async function sendAndconfmTx(
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<BusAccount>
): Promise<TxnSignature> {
  let sendRetries = 10;
  let signature;
  for (;;) {
    const start = Date.now();
    signature = await connection.sendTxn(transaction, ...signers);

    // Wait up to a couple slots for a confirmation
    let status = null;
    let statusRetries = 6;
    for (;;) {
      status = await connection.fetchSignatureState(signature);
      if (status) {
        break;
      }

      if (--statusRetries <= 0) {
        break;
      }
      // Sleep for approximately half a slot
      await sleep((500 * DEFAULT_TICKS_PER_SLOT) / NUM_TICKS_PER_SEC);
    }

    if (status && 'Ok' in status) {
      break;
    }
    if (--sendRetries <= 0) {
      const duration = (Date.now() - start) / 1000;
      throw new Error(
        `Transaction '${signature}' was not confirmed in ${duration.toFixed(
          2,
        )} seconds (${JSON.stringify(status)})`,
      );
    }

    if (status && status.Err && !('AccountInUse' in status.Err)) {
      throw new Error(
        `Transaction ${signature} failed (${JSON.stringify(status)})`,
      );
    }

    // Retry in 0..100ms to try to avoid another AccountInUse collision
    await sleep(Math.random() * 100);
  }

  invariant(signature !== undefined);
  return signature;
}
