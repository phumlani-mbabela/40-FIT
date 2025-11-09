
import React from 'react';
function fmt(ms){
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms/1000);
  const h = Math.floor(total/3600).toString().padStart(2,'0');
  const m = Math.floor((total%3600)/60).toString().padStart(2,'0');
  const s = (total%60).toString().padStart(2,'0');
  return `${h}:${m}:${s}`;
}
export default function Countdown({ until }){
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(()=>{ const t = setInterval(()=>setNow(Date.now()), 1000); return ()=>clearInterval(t); }, []);
  const remain = new Date(until).getTime() - now;
  const expired = remain <= 0;
  return <span className={expired?'text-danger fw-bold':'text-success fw-bold'}>{fmt(remain)}</span>;
}
