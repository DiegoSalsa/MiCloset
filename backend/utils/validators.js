// Validadores para los datos de entrada

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Mínimo 8 caracteres
  return password && password.length >= 8;
};

const validateUsername = (username) => {
  // 3-50 caracteres, solo letras, números y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

const validateGender = (gender) => {
  return ['masculino', 'femenino', 'otro'].includes(gender.toLowerCase());
};

const validateColor = (color) => {
  // Validar que sea un nombre de color válido
  const validColors = [
    'blanco', 'negro', 'gris', 'rojo', 'azul', 'verde', 'amarillo',
    'naranja', 'rosa', 'marron', 'beige', 'violeta', 'turquesa',
    'dorado', 'plateado', 'multicolor'
  ];
  return validColors.includes(color.toLowerCase());
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateGender,
  validateColor
};
