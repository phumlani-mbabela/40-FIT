import React from "react"; import { useSubscription } from "../../hooks/useSubscription";
export default function PremiumGuard({ children }) {
  const sub = useSubscription();
  if (sub.status !== "active") {
    return (<div className="container py-10"><div className="alert alert-warning"><h4 className="mb-2">Premium content</h4><p>Upgrade your plan to access this content.</p></div></div>);
  }
  return <>{children}</>;
}

