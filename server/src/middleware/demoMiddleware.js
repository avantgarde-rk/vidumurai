
// Middleware to prevent modification actions in Demo Mode
const checkDemoMode = (req, res, next) => {
    // Check if logged in user is the Guest Account
    // Check if logged in user is a Demo Account
    if (req.user && req.user.email?.endsWith('@demo.com')) {
        console.log(`[DemoMode] Blocking ${req.method} request from ${req.user.email}`);
        // Block modification methods
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
            // Allow Login/Auth (though this middleware usually runs after auth protect, so login is safe)
            // Allow specific safe actions if needed (e.g. searching), but usually those are GET

            // Allow Logout (if it's a POST)
            if (req.originalUrl.includes('/logout')) return next();

            return res.status(403).json({
                message: 'Demo Mode: This action is disabled to protect data integrity.'
            });
        }
    }
    next();
};

module.exports = { checkDemoMode };
