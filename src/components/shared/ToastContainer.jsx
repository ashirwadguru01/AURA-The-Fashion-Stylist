import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice';
import { X } from 'lucide-react';

function Toast({ t }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(t.id)), 3500);
    return () => clearTimeout(timer);
  }, [dispatch, t.id]);
  const colors = { success:'var(--green)', error:'var(--red)', warning:'var(--amber)', info:'var(--purple2)' };
  return (
    <div className="toast" style={{ borderLeft: `3px solid ${colors[t.type] || colors.info}` }}>
      <span style={{ flex:1 }}>{t.message}</span>
      <button onClick={() => dispatch(removeToast(t.id))}
        style={{ background:'none', border:'none', cursor:'pointer', opacity:0.6, color:'inherit' }}>
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector(s => s.ui.toasts);
  return (
    <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem', zIndex:9999 }}>
      {toasts.map(t => <Toast key={t.id} t={t} />)}
    </div>
  );
}
