import { useAuth } from '../../hooks/useAuth';

const RoleBasedComponent = ({ allowedRoles, children, fallback = null }) => {
  const { userRole } = useAuth();

  if (!allowedRoles.includes(userRole)) {
    return fallback;
  }

  return children;
};

export default RoleBasedComponent;