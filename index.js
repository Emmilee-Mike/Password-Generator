const characters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "[", "}", "]", ",", ".", "/", ":", ";", "<", ">", "?", "~", "`", "|"];
const lengthSlider = document.getElementById("lengthSlider");
const lengthVal = document.getElementById("lengthVal");
const copyBtnOne = document.getElementById("copyBtnOne");
const copyBtnTwo = document.getElementById("copyBtnTwo");
const passwordOne = document.getElementById("password-1")
const passwordTwo = document.getElementById("password-2")


lengthSlider.addEventListener("input", function() {
    lengthVal.textContent = lengthSlider.value;
});


function generatePassword(){
    
    passwordOne.textContent = "";
    passwordTwo.textContent = "";

    let passwordLength = lengthSlider.value; 

    for (let i = 0; i < passwordLength; i++) {
        let randomIndexOne = Math.floor(Math.random() * characters.length);
        let randomIndexTwo = Math.floor(Math.random() * characters.length);
        passwordOne.textContent += characters[randomIndexOne]; 
        passwordTwo.textContent += characters[randomIndexTwo];

    }
    
}

copyBtnOne.addEventListener("click", function() {
    let textToCopy = passwordOne.textContent;
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        alert("Password 1 copied!");
    }
});

copyBtnTwo.addEventListener("click", function() {
    let textToCopy = passwordTwo.textContent;
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        alert("Password 2 copied!");
    }
});

