import TransactionRow from './TransactionRow';
import EmptyState from './EmptyState';

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="table-wrap">
        <EmptyState icon="○" title="No transactions found" message="No transactions match the current criteria." />
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Failure Reason</th>
            <th style={{ textAlign: 'center' }}>Retries</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(txn => (
            <TransactionRow key={txn.id} txn={txn} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
