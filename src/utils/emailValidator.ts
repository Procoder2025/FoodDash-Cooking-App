// Fraud/Spam email detection

// Disposable/temporary email domains (spam emails)
const disposableDomains = [
  "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com",
  "yopmail.com", "trashmail.com", "fakeinbox.com", "sharklasers.com",
  "guerrillamailblock.com", "grr.la", "dispostable.com", "mailnesia.com",
  "maildrop.cc", "discard.email", "mailcatch.com", "temp-mail.org",
  "tempail.com", "emailondeck.com", "tempr.email", "10minutemail.com",
  "minutemail.com", "binkmail.com", "safetymail.info", "trashmail.me",
  "harakirimail.com", "mailforspam.com", "spamfree24.org", "trash-mail.at",
  "mohmal.com", "getnada.com", "tempinbox.com", "burnermail.io",
  "crazymailing.com", "tmail.ws", "emailfake.com", "generator.email",
  "emltmp.com", "fakemail.net", "tmpmail.net", "tmpmail.org",
  "mytemp.email", "1secmail.com", "luxusmail.org", "getairmail.com",
];

// Suspicious patterns
const suspiciousPatterns = [
  /^[a-z]{1,2}\d{5,}@/i,        // a12345@... (random chars + many numbers)
  /^test\d*@/i,                   // test123@...
  /^fake\d*@/i,                   // fake@...
  /^spam\d*@/i,                   // spam@...
  /^temp\d*@/i,                   // temp@...
  /^throw\d*@/i,                  // throw@...
  /^trash\d*@/i,                  // trash@...
  /^junk\d*@/i,                   // junk@...
  /^null\d*@/i,                   // null@...
  /^noreply@/i,                   // noreply@...
  /^abuse@/i,                     // abuse@...
  /^admin@(?!gmail|yahoo|outlook)/i, // admin@ (not major providers)
  /^asdf/i,                       // keyboard smash
  /^qwerty/i,                     // keyboard smash
  /^aaa+@/i,                      // aaaa@...
  /^xxx+@/i,                      // xxx@...
  /^\d+@/i,                       // 12345@... (starts with only numbers)
  /(.)\1{4,}/,                    // same char repeated 5+ times (aaaaa)
];

export interface EmailValidation {
  valid: boolean;
  reason: string;
}

export function validateEmail(email: string): EmailValidation {
  const trimmed = email.trim().toLowerCase();

  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, reason: "Invalid email format" };
  }

  // Extract domain
  const domain = trimmed.split("@")[1];
  const localPart = trimmed.split("@")[0];

  // Check disposable/temporary email domains
  if (disposableDomains.includes(domain)) {
    return { valid: false, reason: "Temporary/disposable emails are not allowed. Please use a permanent email." };
  }

  // Check if domain looks suspicious (no dot in domain or very short TLD)
  const domainParts = domain.split(".");
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { valid: false, reason: "Invalid email domain" };
  }

  // Check suspicious local part patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed) || pattern.test(localPart)) {
      return { valid: false, reason: "This email looks suspicious. Please use your real email address." };
    }
  }

  // Check if local part is too short (single character)
  if (localPart.length < 2) {
    return { valid: false, reason: "Email username is too short" };
  }

  // Check if local part is too long
  if (localPart.length > 64) {
    return { valid: false, reason: "Email username is too long" };
  }

  // Check for excessive dots or special chars
  if (/\.{2,}/.test(localPart) || localPart.startsWith(".") || localPart.endsWith(".")) {
    return { valid: false, reason: "Invalid email format - check the dots" };
  }

  // Check for known bad domain patterns
  if (/^[a-z]{3,5}\d{1,3}\.[a-z]{2,3}$/.test(domain)) {
    // e.g. abc123.com - very generic suspicious domain
    return { valid: false, reason: "This email domain looks suspicious. Please use a trusted email provider." };
  }

  return { valid: true, reason: "" };
}

// Phone validation
export function validatePhone(phone: string): EmailValidation {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.length < 10) {
    return { valid: false, reason: "Phone number is too short (min 10 digits)" };
  }

  if (cleaned.length > 15) {
    return { valid: false, reason: "Phone number is too long" };
  }

  if (!/^[\+]?[\d]{10,15}$/.test(cleaned)) {
    return { valid: false, reason: "Invalid phone number format" };
  }

  // Check for obviously fake numbers
  if (/^(\d)\1{9,}$/.test(cleaned.replace("+", ""))) {
    return { valid: false, reason: "This phone number looks fake" };
  }

  return { valid: true, reason: "" };
}

// Name validation
export function validateName(name: string): EmailValidation {
  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, reason: "Name is too short" };
  }

  if (trimmed.length > 50) {
    return { valid: false, reason: "Name is too long" };
  }

  if (!/^[a-zA-Z\s\.\-']+$/.test(trimmed)) {
    return { valid: false, reason: "Name contains invalid characters" };
  }

  // Check for spam-like names
  if (/^(test|fake|spam|asdf|qwerty|admin|user|null|undefined)/i.test(trimmed)) {
    return { valid: false, reason: "Please enter your real name" };
  }

  // Check for repeated characters
  if (/(.)\1{3,}/.test(trimmed)) {
    return { valid: false, reason: "Please enter a valid name" };
  }

  return { valid: true, reason: "" };
}
