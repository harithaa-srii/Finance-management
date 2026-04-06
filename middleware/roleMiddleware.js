const allowedRoles = ['viewer', 'analyst', 'admin'];

const requireRole = (...roles) => {
  return (req, res, next) => {
    const role = String(req.header('role') || '').toLowerCase();
    const userId = String(req.header('user-id') || req.header('userid') || '').trim();
    const userName = String(req.header('username') || req.header('user-name') || '').trim();

    req.user = {
      role,
      userId,
      userName
    };

    if (!role) {
      return res.status(401).json({ error: 'Role header required' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role header value' });
    }

    if (!roles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};

module.exports = { requireRole };