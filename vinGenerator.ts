// VIN Generation Module
// Generates unique Voter Identification Numbers in the format: NG-YYYY-XXXXXX

export const generateVIN = (existingVINs: string[]): string => {
  const year = new Date().getFullYear();
  let vin: string;
  let attempts = 0;
  const maxAttempts = 1000;

  do {
    // Generate a random 6-digit number
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    vin = `NG-${year}-${randomNum}`;
    attempts++;

    if (attempts >= maxAttempts) {
      // If we've tried too many times, use timestamp-based approach
      const timestamp = Date.now().toString().slice(-6);
      vin = `NG-${year}-${timestamp}`;
      break;
    }
  } while (existingVINs.includes(vin));

  return vin;
};

export const validateVINFormat = (vin: string): boolean => {
  // VIN format: NG-YYYY-XXXXXX
  const vinRegex = /^NG-\d{4}-\d{6}$/;
  return vinRegex.test(vin);
};

export const extractVINYear = (vin: string): number | null => {
  if (!validateVINFormat(vin)) return null;
  const parts = vin.split('-');
  return parseInt(parts[1], 10);
};

// Simple hash function for password (in production, use bcrypt on backend)
export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Add salt and convert to string
  const salt = 'INEC_SECURE_2026';
  return btoa(`${hash}:${salt}:${password.length}`);
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};
