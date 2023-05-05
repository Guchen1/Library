<template>
  <!-- Wrapper Area -->
  <div>
    <div class="wrapper__area" id="wrapper_Area">
      <!-- Forms Area -->
      <div class="forms__area">
        <!-- Login Form -->
        <form class="login__form" id="loginForm">
          <!-- Form Title -->
          <div style="margin-top: -40px; padding-bottom: 10px; margin-left: -20px">
            <a-page-header
              style="border: 0px solid rgb(235, 237, 240)"
              title="Back"
              @back="() => router.go(-1)"
            />
          </div>
          <h1 class="form__title">Sign In</h1>
          <!-- inputs Groups -->
          <div class="input__group">
            <label class="field">
              <input type="text" name="username" placeholder="Username" id="loginUsername" />
            </label>
            <span class="input__icon"><i class="bx bx-user"></i></span>
            <small class="input__error_message"></small>
          </div>
          <div class="input__group">
            <label class="field">
              <input type="password" name="password" placeholder="Password" id="loginPassword" />
            </label>
            <span class="input__icon"><i class="bx bx-lock"></i></span>
            <span class="showHide__Icon"><i class="bx bx-hide"></i></span>
            <small class="input__error_message"></small>
          </div>
          <div class="form__actions">
            <label for="checkboxInput" class="remeber_me">
              <input type="checkbox" id="checkboxInput" />
              <span class="checkmark"></span>
              <span style="padding-left: 5px">Remeber Me</span>
            </label>
            <div class="forgot_password">Forgot Password?</div>
          </div>
          <!-- Login Button -->
          <button type="submit" class="submit-button" id="loginSubmitBtn">Sign in</button>
          <!-- Alternate Login -->
        </form>
        <!-- End Login Form -->

        <!-- Sign Up Form -->
        <form class="sign-up__form" id="signUpForm">
          <!-- Form Title -->
          <div style="margin-top: -40px; padding-bottom: 10px; margin-left: -20px">
            <a-page-header
              style="border: 0px solid rgb(235, 237, 240)"
              title="Back"
              @back="() => router.go(-1)"
            />
          </div>
          <h1 class="form__title">Sign Up</h1>
          <!-- inputs Groups -->
          <div class="input__group">
            <label class="field">
              <input type="text" name="username" placeholder="Username123..." id="signUpUsername" />
            </label>
            <span class="input__icon"><i class="bx bx-user"></i></span>
            <small class="input__error_message"></small>
          </div>
          <div class="input__group">
            <label class="field">
              <input type="text" name="email" placeholder="Email@example.com" id="signUpEmail" />
            </label>
            <span class="input__icon"><i class="bx bx-at"></i></span>
            <small class="input__error_message"></small>
          </div>
          <div class="input__group">
            <label class="field">
              <input
                type="password"
                name="password"
                placeholder="Password123$#%&..."
                id="signUpPassword"
              />
            </label>
            <span class="input__icon"><i class="bx bx-lock"></i></span>
            <span class="showHide__Icon"><i class="bx bx-hide"></i></span>
            <small class="input__error_message"></small>
          </div>
          <div class="input__group confirm__group">
            <label class="field">
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                id="signUpConfirmPassword"
              />
            </label>
            <span class="input__icon"><i class="bx bx-lock"></i></span>
            <span class="showHide__Icon"><i class="bx bx-hide"></i></span>
            <small class="input__error_message"></small>
          </div>
          <!-- Sign Up Button -->
          <button type="submit" class="submit-button" id="signUpSubmitBtn">Sign Up</button>
          <!-- Alternate Login -->
        </form>
        <!-- End Sign Up Form -->
      </div>
      <!-- End Forms Area -->

      <!-- Aside Area -->
      <div class="aside__area" id="aside_Area">
        <div class="login__aside-info">
          <div style="height: 40px"></div>
          <h4>Hello</h4>
          <img src="https://d.top4top.io/p_1945xjz2y1.png" alt="Image" />
          <p>Enter your personal details and start journey with us</p>
          <button id="aside_signUp_Btn">Sign Up</button>
        </div>
        <div class="sign-up__aside-info">
          <div style="height: 40px"></div>
          <h4>Welcome</h4>
          <img src="https://e.top4top.io/p_1945sidbp2.png" alt="Image" />
          <p>To Keep connected with us please login with your personal info</p>
          <button id="aside_signIn_Btn">Sign In</button>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
  <!-- End Wrapper Area -->
</template>
<script setup>
// Hello Everyone.
// This Is A Simple App Login Sing Up From Validation.
// I Hope You Like It And i tried To Make The JavaScript Code simple
// See You Guys In Next Project :)
// Thanks.

// - - - - -  Variables - - - - - //

// Wrapper Area
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'boxicons/css/boxicons.min.css'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css'
const axios = useAxios().Axios
const client = useClient()
const router = useRouter()
//import { LeftOutlined } from '@ant-design/icons-vue'
onMounted(() => {
  const wrapper__Area = document.querySelector('#wrapper_Area')

  // Login & Sing-Up Forms
  const loginForm = document.querySelector('#loginForm')
  const signUpForm = document.querySelector('#signUpForm')

  // All Login And Sing-Up Forms Inputs
  const allLoginFormFields = Array.from(
    document.querySelectorAll('#loginForm .input__group .field input')
  )
  const allSignUpFormFields = Array.from(
    document.querySelectorAll('#signUpForm .input__group:not(.confirm__group) .field input')
  )

  // Password And Confirm Password Fileds
  const passwordField = document.querySelector('#signUpPassword')
  const confirmPassword = document.querySelector('#signUpConfirmPassword')

  // Login % Sign-Up Submit Buttons
  const loginFormSubmitBtn = document.querySelector('#loginSubmitBtn')
  const signUpFormSubmitBtn = document.querySelector('#signUpSubmitBtn')

  // Show Hide Password Element
  const showHidePassDom = Array.from(document.querySelectorAll('.showHide__Icon i'))

  // Pattrens Regex
  const patterns = {
    // All This Regex Code Is For Demo You Can Add Your Own Regex Code :)
    username: /^[a-z]+\d?/,
    email: /^[^\W\d.-_]+\w\d?@[a-z0-9]+\.([a-z0-9]{2,6})(\.[a-z0-9]{2,6})?$/,
    password: /^[a-z0-9]+\d?/
  }

  // Aside Area
  const aside__Area = document.querySelector('#aside_Area')

  // Aside Sing-Up & Sign In Buttons
  const aside__SignUp_Button = document.querySelector('#aside_signUp_Btn')
  const aside__SignIn_Button = document.querySelector('#aside_signIn_Btn')

  // - - - - -  Events - - - - - //

  // When Submitting On Login & Sign-Up Forms
  loginForm.addEventListener('submit', (e) => {
    // Stop Form Submission
    e.preventDefault()
    // Call Login Form Validation Function
    loginFormValidation()
  })
  signUpForm.addEventListener('submit', (e) => {
    // Stop Form Submission
    e.preventDefault()
    // Call Sign-Up Form Validation Function
    signUpFormValidation()
  })

  // Every Time Click On Aside Sign-Up & Sing-In Buttons. Call Function Chnage Form Mode

  aside__Area.addEventListener('click', chnageFormMode)
  aside__Area.addEventListener('click', chnageFormMode)
  // - - - - -  Functions - - - - - //
  if (client.state == 'signup') {
    wrapper__Area.classList.add('sign-up__Mode-active')
  } else {
    wrapper__Area.classList.remove('sign-up__Mode-active')
  }
  // Change Form Mode Function
  function chnageFormMode(e) {
    // Check. If The Target Element Is Aside Sign-Up Button
    if (e.target === aside__SignUp_Button) {
      // Add Class [ Sign Up Mode Active ] On Wrapper Area
      wrapper__Area.classList.add('sign-up__Mode-active')
    }
    // Check. If The Target Element Is Aside Sign-In Button
    if (e.target === aside__SignIn_Button) {
      // Remove Class [ Sign Up Mode Active ] From Wrapper Area
      wrapper__Area.classList.remove('sign-up__Mode-active')
    }
  }

  // Function Show Hide Password
  ;(function showHidePass() {
    // Loop On All The Show Hide Password Icon
    showHidePassDom.forEach((icon) => {
      // When Click On Any Show Hide Icon...
      icon.addEventListener('click', () => {
        // Select The Target Password Input
        const targetAreaInput = icon.parentElement.parentElement.querySelector('.field input')
        // If The Target Icon Has Hide-icon
        if (icon.className === 'bx bx-hide') {
          // Change The Target Icon Class
          icon.className = 'bx bx-show'
          // Change The Target Input Area Type
          targetAreaInput.setAttribute('type', 'text')
        } else {
          // else
          // Change The Target Icon Class
          icon.className = 'bx bx-hide'
          // Change The Target Input Area Type
          targetAreaInput.setAttribute('type', 'password')
        }
      })
    })
  })()

  // Login Form Validation Function
  function loginFormValidation() {
    // Loop On All The Inputs
    let loginFormValid = true
    allLoginFormFields.forEach((input) => {
      // Input Targte Field Name Value
      const inputAttribueValueName = input.attributes.name.value
      // Input Value Without Spaces
      const inputValue = input.value.trim()
      // Input Regex Validation Response [ True || False ] :)
      const inputRegex = patterns[inputAttribueValueName].test(inputValue)

      // Check If The Input Value Is Empty
      if (inputValue === '') {
        // Call Function Set Error For
        loginFormValid = false
        setErrorFor(input, `${inputAttribueValueName} is required. Please enter your response.`)
      } else if (inputRegex === false) {
        loginFormValid = false
        // Else If: If The InputRegext Response Is False
        // Call Function Set Error For
        setErrorFor(input, `${inputAttribueValueName} Is Invalid .`)
      } else {
        // Else
        // Call Function Set Success For
        setSuccessFor(input)
      }
    })
    if (loginFormValid) {
      axios
        .post('login', {
          account: allLoginFormFields[0].value,
          password: allLoginFormFields[1].value
        })
        .then((res) => {
          if (!res.data.status) {
            throw res.data.msg.content
          }
          console.log(res)
          
            client.loggedIn = true
            localStorage.setItem('loggedin', 'true')
            console.log(res.data.userType)
            switch (res.data.userType) {
              case 1:
                client.clientData.clientType = 'admin'
                break
              case 2:
                client.clientData.clientType = 'user'
                break
              case 3:
                client.clientData.clientType = 'staff'
                break
            }
            message.info(`Login success, you identity is ${client.clientData.clientType}`)
            setTimeout(() => {
              router.push('/')
            // Todo: goto mainpage
          }, 500)
        })
        .catch((err) => {
          message.error(`Login failed with error: ${err}`)
        })
    }
  }

  // Sign-Up Form Validation Function
  function signUpFormValidation() {
    let signUpFormValid = true
    // Loop On All The Inputs
    allSignUpFormFields.forEach((input) => {
      console.log(input.value)
      // Password And Confirm Password Fileds Values Without Spaces
      const passwordFieldValue = passwordField.value.trim()
      const conifrmPassValue = confirmPassword.value.trim()
      // Input Targte Field Name Value
      const inputAttribueValueName = input.attributes.name.value
      // Input Value Without Spaces
      const inputValue = input.value.trim()
      // Input Regex Validation Response [ True || False ] :)
      const inputRegex = patterns[inputAttribueValueName].test(inputValue)

      // Check If The Input Value Is Empty
      if (inputValue === '') {
        signUpFormValid = false
        // Call Function Set Error For
        setErrorFor(input, `${inputAttribueValueName} is required. Please enter your response.`)
      } else if (inputRegex === false) {
        signUpFormValid = false
        // Else If: If The InputRegext Response Is False
        // Call Function Set Error For
        setErrorFor(input, `${inputAttribueValueName} Is Invalid .`)
      } else {
        // Else
        // Call Function Set Success For
        setSuccessFor(input)
      }

      // Validation The Confirm Password
      if (conifrmPassValue === '') {
        signUpFormValid = false
        // Check If The Confirm Password Value Is Empty
        // Call Function Set Error For
        setErrorFor(confirmPassword, `Confirm password is required. Please enter your response.`)
      } else if (conifrmPassValue !== passwordFieldValue) {
        signUpFormValid = false
        // Check If The Confirm Password Value Is Dose Not Match The Password Filed
        // Call Function Set Error For
        setErrorFor(confirmPassword, `Confirm password does not match`)
      } else {
        // Eles
        // Call Function Set Success For
        setSuccessFor(confirmPassword)
      }
    })

    if (signUpFormValid) {
      axios
        .post('/userop/register', {
          account: allSignUpFormFields[0].value,
          password: allSignUpFormFields[2].value,
          email: allSignUpFormFields[1].value
        })
        .then((res) => {
          console.log(res)
          if (!res.data.status) {
            message.error(`Sign up failed with error: ${res.data.msg.content}`)
          } else {
            setTimeout(() => {
              // Todo: Goto login page
            }, 500)
          }
        })
        .catch((err) => {
          message.error(`Sign up failed with error: ${err}`)
        })
    }
  }

  // Set Error For Function
  function setErrorFor(input, message) {
    // Select The Target Parent Target Input Group
    const targetParentInput = input.parentElement.parentElement
    // Select The Target Input Error Message
    const targetErrorMessage = targetParentInput.querySelector('.input__error_message')

    // Remove Class FormSucess From The Parent Target
    targetParentInput.classList.remove('formSuccess')
    // Add Class Success On Target ParentElement
    targetParentInput.classList.add('formError')
    // Set The Message Inside The Target Error Message
    targetErrorMessage.innerHTML = message
  }

  // Set Success For Function
  function setSuccessFor(input) {
    // Select The Target Parent Target Input Group
    const targetParentInput = input.parentElement.parentElement
    // Select The Target Input Error Message
    const targetErrorMessage = targetParentInput.querySelector('.input__error_message')

    // Remove Class FormError From The Parent Target
    targetParentInput.classList.remove('formError')
    // Add Class Success On Target ParentElement
    targetParentInput.classList.add('formSuccess')
    // Empty The Error Message
    targetErrorMessage.innerHTML = ''
  }
})
</script>
<style>
/* Main Css Reset */
:root {
  --white-color: rgb(255, 255, 255);
  --balck-color: rgb(0, 0, 0);
  --body-BG-color: rgb(225, 232, 255);
  --wrapper-shadow-color: rgba(255, 255, 255, 0.439);
  --aside-area-BG-color: rgb(82, 116, 255);
  --aside-area-width: 330px;
  --error-color: rgb(231, 76, 60);
  --success-color: rgb(46, 204, 113);
  --primary-light-gray: rgb(184, 180, 180);
  --primary-color: rgb(82, 116, 255);
  --light-blue-color: rgb(141 162 246);
  --input-border-color: rgb(152, 169, 192);
  --paragraph-color: rgb(231, 231, 231);
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', Arial, sans-serif;
}
body {
  height: 100vh;
  background-color: var(--body-BG-color);
  display: flex;
  justify-content: center;
  align-items: center;
}
/* End Css Reset */

/* Wrapper Area */
.wrapper__area {
  position: relative;
  width: 800px;
  height: 650px;
  background-color: var(--white-color);
  box-shadow: 0 0 50px var(--wrapper-shadow-color);
  border: 5px solid var(--wrapper-shadow-color);
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  transform: scale(0.9);
}

/* Forms Area */
.forms__area {
  position: relative;
  width: calc(100% - var(--aside-area-width));
  height: 100%;
  background-color: transparent;
  margin-right: 10px;
}
/* Form */
.forms__area form {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  padding: 20px 20px 10px 20px;
  transition: 1.2s cubic-bezier(0.18, 0.02, 0.36, 0.96);
  opacity: 1;
}
form.sign-up__form {
  /* Hide The Sign Up */
  margin-top: -650px;
}
/* Form Title */
form .form__title {
  font-size: 45px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 40px;
}
.sign-up__form .form__title {
  /* Sign Up Form Title */
  margin-bottom: 25px;
}
/* Input Group */
form .input__group {
  position: relative;
  width: 100%;
  margin: 10px 0;
}
/* Field */
form .input__group .field {
  position: relative;
  width: 100%;
  height: auto;
  display: inline-block;
  transition: 0.3s ease-in-out;
  overflow: hidden;
}
/* Field After ( For Border Animation Focus ) */
form .input__group .field::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  transform: translateX(-100%);
  transition: 0.3s ease-in-out;
}
form .input__group .field:focus::after,
form .input__group .field:focus-within::after {
  transform: translateX(0);
}
/* Text And Password Inputs */
form .input__group input[type='text'],
form .input__group input[type='password'] {
  position: relative;
  outline: none;
  width: 100%;
  border: none;
  padding: 15px 40px 15px 40px;
  background: transparent;
  border-bottom: 2px solid var(--input-border-color);
}
/* Form Error */
form .formError .field input {
  border-color: var(--error-color);
}
/* FormSuccess */
form .formSuccess .field input {
  border-color: var(--success-color);
}
/* For Input Autofill */
form .input__group input:-webkit-autofill,
form .input__group input:-webkit-autofill:hover,
form .input__group input:-webkit-autofill:focus,
form .input__group input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
  background: transparent;
}
/* Next Span */
form .input__group > span {
  position: absolute;
  font-size: 18px;
  color: var(--primary-light-gray);
  transition: 0.3s ease-in-out;
}
form .input__group input[type='text']:focus ~ span,
form .input__group input[type='password']:focus ~ span {
  color: var(--primary-color);
}
/* Input Icon */
form .input__group .input__icon {
  top: 13px;
  left: 13px;
  pointer-events: none;
}
/* Show Hide Icon */
form .input__group .showHide__Icon {
  top: 13px;
  right: 13px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
form .input__group .showHide__Icon:hover {
  color: var(--primary-color);
}
/* Error Message */
form .input__group .input__error_message {
  display: block;
  color: var(--error-color);
  margin: 0 10px;
  opacity: 0;
  pointer-events: none;
  transition: 0.3s ease-in-out;
  text-transform: capitalize;
}
/* Form Error class */
form .formError .input__error_message {
  opacity: 1;
}
/* Form Success class */
form .formSuccess .input__error_message {
  opacity: 0;
}

/* Form Actions */
form .form__actions {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
/* EveryThing In The Form Action */
form .form__actions * {
  transition: 0.3s ease-in-out;
}
/* Next Label And Next Div */
form .form__actions > label:hover,
form .form__actions > div:hover {
  opacity: 0.7;
}
/* Remeber Me And Input */
.form__actions .remeber_me,
.form__actions .remeber_me input {
  position: relative;
  cursor: pointer;
  font-size: 15px;
  color: var(--primary-light-gray);
}
/* Input And Checkmark box */
.form__actions .remeber_me input,
.form__actions .remeber_me .checkmark {
  width: 20px;
  height: 20px;
  top: 5px;
}
.form__actions .remeber_me input {
  opacity: 0;
  z-index: 2;
}
.form__actions .remeber_me .checkmark {
  position: absolute;
  left: 0;
  border: 2px solid var(--primary-light-gray);
  border-radius: 3px;
  z-index: 1;
}
/* Create Check Mark */
.form__actions .remeber_me .checkmark::after {
  content: '';
  position: absolute;
  opacity: 0;
  left: 5px;
  top: 2px;
  width: 3px;
  height: 8px;
  border: solid var(--primary-color);
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg) scale(0);
  transform: rotate(45deg) scale(0);
  transition: 0.3s ease-in-out;
}
/* When Input Checkbox Is Checked */
.form__actions .remeber_me input:checked ~ .checkmark ~ span {
  color: var(--primary-color);
}
.form__actions .remeber_me input:checked ~ .checkmark {
  border-color: var(--primary-color);
}
.form__actions .remeber_me input:checked ~ .checkmark::after {
  opacity: 1;
  -webkit-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}
/* Forgot Password */
.form__actions .forgot_password {
  position: relative;
  top: 4px;
  cursor: pointer;
  font-size: 15px;
  color: var(--primary-color);
  transition: 0.3s ease-in-out;
  font-weight: 550;
}

/* Submit Button */
button.submit-button {
  position: relative;
  width: 65%;
  background-color: var(--primary-color);
  color: var(--white-color);
  cursor: pointer;
  padding: 16px 0;
  border: none;
  border-radius: 5px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 50px auto 10px;
  display: block;
  outline: none;
  transition: 0.5s ease-in-out;
  overflow: hidden;
  text-transform: uppercase;
}
.sign-up__form button.submit-button {
  /* Sign Up Submit Button */
  margin-top: 25px;
}
button.submit-button:hover {
  opacity: 0.8;
}
button.submit-button:active {
  opacity: 1;
}

/* Alternate Login */
.alternate-login {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}
.sign-up__form .alternate-login {
  /* Sign Up Alternate Login */
  margin-top: 25px;
}
.alternate-login .link {
  border: 2px solid var(--primary-light-gray);
  margin: 10px;
  padding: 7px 25px 5px;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.4s ease-out;
  color: var(--primary-light-gray);
}
.alternate-login .link:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
.alternate-login .link i {
  font-size: 18px;
  position: relative;
  top: 2px;
}
/* Forms Animation */

/* When Sign Up Mode Is Active\ Sign Up Form */
form.sign-up__form {
  opacity: 0;
}
.wrapper__area.sign-up__Mode-active form.sign-up__form {
  margin-top: 0;
  opacity: 1;
}
/* When Sign Up Mode Is Active\ Login Form */
.wrapper__area.sign-up__Mode-active form.login__form {
  margin-top: 650px;
  opacity: 0;
}

/* End Forms Animation */

/* Aside Area */
.aside__area {
  position: relative;
  width: var(--aside-area-width);
  height: 100%;
  background-color: var(--aside-area-BG-color);
  border-radius: 5px;
  opacity: 1;
}
/* Sides */
.aside__area > div {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  text-align: center;
  transition: 1.2s cubic-bezier(0.18, 0.02, 0.36, 0.96);
  margin-top: 30px;
}
.aside__area > div h4 {
  color: var(--white-color);
  letter-spacing: 5px;
  font-weight: 500;
  font-size: 35px;
  position: absolute;
  left: 24px;
}
.aside__area > div img {
  width: 100%;
  pointer-events: none;
}
.aside__area > div p {
  color: var(--paragraph-color);
  font-size: 14px;
  padding: 20px;
  margin-bottom: 20px;
}
.aside__area > div button {
  display: block;
  outline: none;
  background-color: transparent;
  width: 60%;
  margin: auto;
  border: 2px solid var(--white-color);
  color: var(--white-color);
  cursor: pointer;
  padding: 14px 0;
  border-radius: 2px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: 0.5s ease-in-out;
}
.aside__area > div button:hover {
  border-color: var(--white-color);
  background-color: var(--white-color);
  color: vAR(--balck-color);
}
.aside__area > div button:active {
  opacity: 0.8;
}
/* Aside Animation */

/* When Sign Up Mode Is Active\ Sign Up Side */
.wrapper__area.sign-up__Mode-active .login__aside-info {
  /* Login Aside */
  margin-top: -650px;
  opacity: 0;
}
/* When Sign Up Mode Is Active\ Login Side */
.sign-up__aside-info {
  /* Sign Up Aside */
  opacity: 0;
}
.wrapper__area.sign-up__Mode-active .sign-up__aside-info {
  opacity: 1;
}

/* End Aside Animation */

/* End Wrapper Area */
</style>
