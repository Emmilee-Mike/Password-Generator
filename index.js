const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: [ "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "[", "}", "]",
            ",", ".", "/", ":", ";", "<", ">", "?", "~", "`", "|",  ].join(""),};

const lengthSlider = document.getElementById("lengthSlider");
const lengthVal = document.getElementById("lengthVal");
const copyBtnOne = document.getElementById("copyBtnOne");
const copyBtnTwo = document.getElementById("copyBtnTwo");
const passwordOne = document.getElementById("password-1");
const passwordTwo = document.getElementById("password-2");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const optionError = document.getElementById("optionError");
const strengthLabelOne = document.getElementById("strength-label-1");
const strengthLabelTwo = document.getElementById("strength-label-2");

const strengthBarOne = document.getElementById("strength-bar-1");
const strengthBarTwo = document.getElementById("strength-bar-2");

const strengthProgressOne = document.getElementById("strength-progress-1");
const strengthProgressTwo = document.getElementById("strength-progress-2");

lengthSlider.addEventListener("input", () => {
  lengthVal.textContent = lengthSlider.value;

  lengthSlider.setAttribute(
    "aria-valuetext",
    `${lengthSlider.value} characters`,
  );
});

function getRandomIndex(max) {
  // Validate the maximum value.
  if (!Number.isSafeInteger(max) || max <= 0) {
    throw new RangeError("Maximum must be a positive integer.");
  }

  const range = 2 ** 32;
  const limit = Math.floor(range / max) * max;
  const randomNumber = new Uint32Array(1);

  let value;

  do {
    crypto.getRandomValues(randomNumber);
    value = randomNumber[0];
  } while (value >= limit);

  return value % max;
}

function generatePassword() {
  const selectedCharacters = [];

  if (uppercaseCheckbox.checked) {
    selectedCharacters.push(characterSets.uppercase);
  }

  if (lowercaseCheckbox.checked) {
    selectedCharacters.push(characterSets.lowercase);
  }

  if (numbersCheckbox.checked) {
    selectedCharacters.push(characterSets.numbers);
  }

  if (symbolsCheckbox.checked) {
    selectedCharacters.push(characterSets.symbols);
  }

  // Stop if the user has not selected a character type.

  if (selectedCharacters.length === 0) {
    optionError.textContent =
      "Select at least one character type to generate a password.";
    optionError.hidden = false;
    return;
  }

  optionError.textContent = "";
  optionError.hidden = true;

  const characters = selectedCharacters.join("");
  const passwordLength = Number(lengthSlider.value);

  const minLength = Number(lengthSlider.min);
  const maxLength = Number(lengthSlider.max);

  if (
    !Number.isInteger(passwordLength) ||
    passwordLength < minLength ||
    passwordLength > maxLength
  ) {
    optionError.textContent = "Please select a valid password length.";

    optionError.hidden = false;
    return;
  }

  if (passwordLength < selectedCharacters.length) {
    optionError.textContent =
      "Password length must be at least the number of selected character types.";

    optionError.hidden = false;
    return;
  }
  passwordOne.textContent = "";
  passwordTwo.textContent = "";

  const generateSinglePassword = () => {
    const passwordCharacters = selectedCharacters.map((set) => {
      return set[getRandomIndex(set.length)];
    });

    while (passwordCharacters.length < passwordLength) {
      const randomIndex = getRandomIndex(characters.length);

      passwordCharacters.push(characters[randomIndex]);
    }

    // Securely shuffle the characters using Fisher-Yates.
    for (let i = passwordCharacters.length - 1; i > 0; i--) {
      const randomIndex = getRandomIndex(i + 1);

      [passwordCharacters[i], passwordCharacters[randomIndex]] = [
        passwordCharacters[randomIndex],
        passwordCharacters[i],
      ];
    }

    return passwordCharacters.join("");
  };

  passwordOne.textContent = generateSinglePassword();
  passwordTwo.textContent = generateSinglePassword();

  updatePasswordStrength(
    passwordOne.textContent,
    strengthLabelOne,
    strengthBarOne,
    strengthProgressOne,
  );

  updatePasswordStrength(
    passwordTwo.textContent,
    strengthLabelTwo,
    strengthBarTwo,
    strengthProgressTwo,
  );
}

function calculatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: "Not generated",
      className: "",
    };
  }

  let score = 0;

  // Award points for password length.
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Check the character types actually present.
  let variety = 0;

  if (/[A-Z]/.test(password)) variety++;
  if (/[a-z]/.test(password)) variety++;
  if (/[0-9]/.test(password)) variety++;
  if (/[^A-Za-z0-9]/.test(password)) variety++;

  if (variety >= 2) score++;
  if (variety >= 3) score++;
  if (variety >= 4) score++;

  // Penalize common predictable patterns.
  const predictablePatterns = [
    /1234/,
    /abcd/i,
    /qwerty/i,
    /password/i,
    /1111/,
    /0000/,
  ];

  if (predictablePatterns.some((pattern) => pattern.test(password))) {
    score = Math.max(0, score - 2);
  }

  if (score <= 1) {
    return { score, label: "Weak", className: "weak" };
  }

  if (score <= 3) {
    return { score, label: "Medium", className: "medium" };
  }

  if (score <= 4) {
    return { score, label: "Strong", className: "strong" };
  }

  return {
    score,
    label: "Very Strong",
    className: "very-strong",
  };
}

function updatePasswordStrength(
  password,
  labelElement,
  barElement,
  progressElement,
) {
  const result = calculatePasswordStrength(password);

  labelElement.textContent = result.label;

  barElement.className = "strength-bar";

  if (result.className) {
    barElement.classList.add(result.className);
  }

  // Six is the maximum score.
  barElement.style.width = `${(result.score / 6) * 100}%`;

  progressElement.setAttribute("aria-valuenow", result.score);
}

copyBtnOne.addEventListener("click", async function () {
  const textToCopy = passwordOne.textContent;

  if (!textToCopy) {
    alert("Generate a password first!");
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    alert("Password 1 copied successfully!");
  } catch (error) {
    alert("Copy failed. Please try again.");
    console.error("Clipboard error:", error);
  }
});

copyBtnTwo.addEventListener("click", async function () {
  const textToCopy = passwordTwo.textContent;

  if (!textToCopy) {
    alert("Generate a password first!");
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    alert("Password 2 copied successfully!");
  } catch (error) {
    alert("Copy failed. Please try again.");
    console.error("Clipboard error:", error);
  }
});
