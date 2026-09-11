const STATUS_STYLES = {
  pending: { icon: '○', className: 'text-gray-500' },
  pass: { icon: '✓', className: 'text-green-600' },
  fail: { icon: '✕', className: 'text-red-600' },
};

export default function ChecklistItem({ label, status = 'pending' }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <div className="flex items-center gap-2 border rounded p-2">
      <span className={`font-bold ${style.className}`}>{style.icon}</span>
      <span>{label}</span>
    </div>
  );
}