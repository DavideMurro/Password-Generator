var charsetGlobal = {
    lettersLower: "abcdefghijklmnopqrstuvwxyz",
    lettersUpper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    specialCharacters: "!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"
};
var minLength = 4;
var maxLength = 64;
var defaultLength = 8;

document.addEventListener('DOMContentLoaded', (event) => {
    // init min max
    document.getElementById("password-min-max-length").innerHTML = "Min " + minLength + ", Max: " + maxLength;
    document.getElementById('password-length-view').setAttribute("min", minLength);
    document.getElementById('password-length-view').setAttribute("max", maxLength);
    document.getElementById('password-length-view').value = defaultLength;
    document.getElementById('password-length').setAttribute("min", minLength);
    document.getElementById('password-length').setAttribute("max", maxLength);
    document.getElementById('password-length').value = defaultLength;
});


function useLettersChanged() {
    let isDisabled = !document.getElementById("is-use-letters").checked;
    let radios = document.getElementsByName("use-letters-type");
    for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = isDisabled;
    }
}

function useRandomLengthChanged() {
    let isDisabled = document.getElementById("is-use-random-length").checked;
    document.getElementById("password-length-view").disabled = isDisabled;
    document.getElementById("password-length").disabled = isDisabled;

    let value = document.getElementById("password-length-view").value;
    if (isDisabled == false && !value) {
        document.getElementById('password-length-view').value = defaultLength;
        passwordLengthViewChanged();
    }
}

function passwordLengthViewChanged() {
    let value = document.getElementById("password-length-view").value;
    
    if (value) {
        document.getElementById('password-length').value = value;
    } else {
        /*
        document.getElementById('is-use-random-length').checked = true;
        useRandomLengthChanged();
        */
        document.getElementById('password-length-view').value = defaultLength;
        passwordLengthViewChanged();
    }
}
function passwordLengthChanged() {
    let value = document.getElementById("password-length").value;
    document.getElementById('password-length-view').value = value;
}

function generatePassword() {
    // vars
    let pgErrorInput = document.getElementById("passwordgenerator-error");
    let pgValueInput = document.getElementById("password-generated");

    let isRandomLength = document.getElementById("is-use-random-length").checked;
    let length = document.getElementById("password-length-view").value;
    let charset = "";
    let passwordGenerated = "";
    
    let isUseLetters = document.getElementById("is-use-letters").checked;
    let isUseLettersLowercase = document.getElementById("is-use-letters-lowercase").checked;
    let isUseLettersUppercase = document.getElementById("is-use-letters-uppercase").checked;
    let isUseLettersBothcase = document.getElementById("is-use-letters-bothcase").checked;
    let iseUseNumbers = document.getElementById("is-use-numbers").checked;
    let iseUseCharacters = document.getElementById("is-use-special-characters").checked;

    try {
        // reset 
        pgErrorInput.innerHTML = "";
        pgValueInput.value = "";
        

        //check length
        if(!isRandomLength && !(length >= minLength && length <= maxLength)) {
            throw "Password length must be between " + minLength + " and " + maxLength;
        } else if(isRandomLength) {
            length = Math.floor(Math.random() * (maxLength - minLength + 1) ) + minLength;
        }

        // set & check char set 
        if (isUseLetters) {
            if (isUseLettersLowercase) {
                charset += charsetGlobal.lettersLower;
            } else if (isUseLettersUppercase) {
                charset += charsetGlobal.lettersUpper;
            } else if (isUseLettersBothcase) {
                charset += charsetGlobal.lettersLower + charsetGlobal.lettersUpper;
            }
        }
        if (iseUseNumbers) {
            charset += charsetGlobal.numbers;
        }
        if (iseUseCharacters) {
            charset += charsetGlobal.specialCharacters;
        }

        if (!charset) throw "Check at least one option";


        // generate
        do {
            passwordGenerated = "";

            for (let i = 0, n = charset.length; i < length; ++i) {
                passwordGenerated += charset.charAt(Math.floor(Math.random() * n));
            }
        } while (!checkPassword(passwordGenerated, isUseLetters, isUseLettersLowercase, isUseLettersUppercase, isUseLettersBothcase, iseUseNumbers, iseUseCharacters));

        pgValueInput.value = passwordGenerated;
        
        return false;
    } catch (error) {
        pgErrorInput.innerHTML = error;
        pgErrorInput.scrollIntoView();
        console.error(error);
        return false;
    }
}

function checkPassword(passwordGenerated, isUseLetters, isUseLettersLowercase, isUseLettersUppercase, isUseLettersBothcase, iseUseNumbers, iseUseCharacters) {
    let isPasswordChecked = true;

    if (!(passwordGenerated.length >= minLength && passwordGenerated.length <= maxLength)) {
        isPasswordChecked = false;
    }

    if (isUseLetters) {
        if ((isUseLettersLowercase || isUseLettersBothcase) && !Array.from(charsetGlobal.lettersLower).some(x => passwordGenerated.includes(x))) {
            isPasswordChecked = false;
        } 
        if ((isUseLettersUppercase || isUseLettersBothcase) && !Array.from(charsetGlobal.lettersUpper).some(x => passwordGenerated.includes(x))) {
            isPasswordChecked = false;
        }
    }
    if (iseUseNumbers && !Array.from(charsetGlobal.numbers).some(x => passwordGenerated.includes(x))) {
        isPasswordChecked = false;
    }
    if (iseUseCharacters && !Array.from(charsetGlobal.specialCharacters).some(x => passwordGenerated.includes(x))) {
        isPasswordChecked = false;
    }

    return isPasswordChecked;
}