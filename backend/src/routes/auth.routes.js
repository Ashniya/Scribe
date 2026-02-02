import express from 'express';
const router = express.Router();

// Placeholder - you can add auth routes later
router.get('/me', (req, res) => {
    res.json({ success: true, message: 'Auth routes placeholder' });
});

export default router;
