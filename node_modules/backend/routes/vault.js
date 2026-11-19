const express = require('express');
const router = express.Router();
const vaultModel = require('../models/vault');
const verifyToken = require('../middlewares/verifyToken');

// Add to Vault (for logged-in user)
router.post('/add', verifyToken, async (req, res) => {
  const { gameId, title, price, thumb } = req.body;
  const userId = req.user.id;

  try {
    let vault = await vaultModel.findOne({ userId });

    if (!vault) {
      vault = new vaultModel({
        userId,
        items: [{ gameId, title, price, thumb, quantity: 1 }],
        totalPrice: price,
      });
    } else {
      const itemIndex = vault.items.findIndex((item) => item.gameId === gameId);

      if (itemIndex > -1) {
        vault.items[itemIndex].quantity += 1;
      } else {
        vault.items.push({ gameId, title, price, thumb, quantity: 1 });
      }

      vault.totalPrice = vault.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    await vault.save();
    res.status(200).json(vault);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to vault', error: err.message });
  }
});

// Get user's Vault (secure with JWT token)
router.get('/', verifyToken, async (req, res) => {
  try {
    const vault = await vaultModel.findOne({ userId: req.user.id }).populate('items.gameId');
    if (!vault) return res.status(404).json({ message: 'Vault not found' });

    res.status(200).json(vault);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vault', error: err.message });
  }
});

module.exports = router;
