const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Empêcher création d'admin sans authentification
    if (role && role !== 'user' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Seul un admin peut créer un compte avec ce rôle' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l’inscription', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ userId: user._id, role: user.role, token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion', err });
  }
};
