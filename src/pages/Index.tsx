
import { Navigate } from "react-router-dom";

// This is just a redirect to the Dashboard
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
