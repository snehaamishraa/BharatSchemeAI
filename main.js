// Simple Login/Register System (No Clerk)

let authContainer, appContainer, tabLogin, tabRegister, loginForm, registerForm, logoutBtn, profileForm, authMessage, userName, resultsList, resultsSection, nationalAnthem, audioToggleBtn

// Initialize DOM elements
function initializeDOMElements() {
  authContainer = document.getElementById('auth-container')
  appContainer = document.getElementById('app-container')
  tabLogin = document.getElementById('tab-login')
  tabRegister = document.getElementById('tab-register')
  loginForm = document.getElementById('login-form')
  registerForm = document.getElementById('register-form')
  logoutBtn = document.getElementById('logout-btn')
  profileForm = document.getElementById('profile-form')
  authMessage = document.getElementById('auth-message')
  userName = document.getElementById('user-name')
  resultsList = document.getElementById('results-list')
  resultsSection = document.getElementById('results-section')
  nationalAnthem = document.getElementById('national-anthem')
  audioToggleBtn = document.getElementById('audio-toggle-btn')
}

let allSchemes = []
let audioEnabled = true

// Play National Anthem
function playNationalAnthem() {
  if (!audioEnabled) {
    console.log('🔇 Audio is disabled')
    return
  }

  console.log('🎵 playNationalAnthem called')
  console.log('Audio element:', nationalAnthem)
  console.log('Audio src:', nationalAnthem ? nationalAnthem.src : 'no element')
  
  if (!nationalAnthem) {
    console.log('❌ Audio element not found!')
    return
  }
  
  // Check if audio can load
  nationalAnthem.load()
  
  nationalAnthem.addEventListener('canplaythrough', () => {
    console.log('✅ Audio loaded successfully')
  })
  
  nationalAnthem.addEventListener('error', (e) => {
    console.log('❌ Audio error:', e)
  })
  
  nationalAnthem.volume = 1
  nationalAnthem.currentTime = 0
  
  // Try to play
  nationalAnthem.play()
    .then(() => {
      console.log('✅✅ Jana Gana Mana is Playing!')
    })
    .catch(err => {
      console.log('❌ Play blocked:', err.message)
      console.log('Try clicking on the page first')
      
      // Add click handler to enable audio
      document.body.addEventListener('click', function enableAudio() {
        nationalAnthem.play()
          .then(() => console.log('✅ Playing after click'))
          .catch(e => console.log('Still blocked:', e))
        document.body.removeEventListener('click', enableAudio)
      }, { once: true })
    })
}

// Load schemes from JSON
async function loadSchemes() {
  console.log('loadSchemes called')
  try {
    const response = await fetch('/schemes.json')
    console.log('Fetch response:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Parsed JSON, schemes in data:', data.schemes ? data.schemes.length : 0)
    
    allSchemes = data.schemes || []
    console.log('Loaded schemes:', allSchemes.length)
    
    if (allSchemes.length === 0) {
      console.warn('No schemes loaded!')
    }
    
    filterAndDisplaySchemes()
  } catch (error) {
    console.error('Error loading schemes:', error)
    if (resultsList) {
      resultsList.innerHTML = `<p style="color: #ff6b6b;">Error loading schemes: ${error.message}</p>`
    }
  }
}

// Filter schemes based on user profile
function filterAndDisplaySchemes() {
  const saved = localStorage.getItem('userProfile')
  
  if (!saved || allSchemes.length === 0) {
    console.log('No saved profile or schemes. Showing all.')
    displaySchemes(allSchemes)
    return
  }

  const profile = JSON.parse(saved)
  const userAge = parseInt(profile.age)
  const userOccupation = profile.occupation
  
  console.log('Filtering with:', { age: userAge, occupation: userOccupation })

  const filteredSchemes = allSchemes.filter(scheme => {
    // If no criteria defined, show the scheme
    if (!scheme.criteria) return true

    const criteria = scheme.criteria

    // Check age constraints
    if (criteria.minAge !== null && criteria.minAge !== undefined && userAge < criteria.minAge) {
      return false
    }
    if (criteria.maxAge !== null && criteria.maxAge !== undefined && userAge > criteria.maxAge) {
      return false
    }

    // Check occupation - if criteria has occupations defined AND user's occupation is not in the list, filter out
    if (criteria.occupations && criteria.occupations.length > 0) {
      if (!criteria.occupations.includes(userOccupation)) {
        return false
      }
    }

    // Check income if applicable
    if (criteria.maxAnnualIncome && criteria.maxAnnualIncome > 0) {
      const incomeField = document.getElementById('income')
      if (incomeField) {
        const userIncome = parseInt(incomeField.value || 0)
        if (userIncome > criteria.maxAnnualIncome) {
          return false
        }
      }
    }

    return true
  })

  console.log(`Filtered: ${filteredSchemes.length} out of ${allSchemes.length} schemes match`)
  displaySchemes(filteredSchemes.length > 0 ? filteredSchemes : allSchemes)
}

// Display schemes
function displaySchemes(schemes) {
  // Make sure resultsList is initialized
  if (!resultsList) {
    resultsList = document.getElementById('results-list')
  }
  
  if (!resultsList) {
    console.error('results-list element not found in DOM')
    return
  }
  
  if (!schemes || schemes.length === 0) {
    const noSchemesText = typeof t === 'function' ? t('no_schemes') : 'No schemes found'
    resultsList.innerHTML = `<p style="color: #b0b5c1;">${noSchemesText}</p>`
    return
  }

  const readMoreText = typeof t === 'function' ? t('read_more') : 'Read More →'
  
  resultsList.innerHTML = schemes.map(scheme => `
    <div class="scheme-card" onclick="viewScheme('${scheme.id}')">
      <div class="scheme-name">${scheme.name}</div>
      <div class="scheme-desc">${scheme.description}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
        <span class="scheme-category">${scheme.category || 'General'}</span>
        <span style="color: #ff9933; font-weight: 600; cursor: pointer; font-size: 14px;">${readMoreText}</span>
      </div>
    </div>
  `).join('')
}

// View scheme details in modal
window.viewScheme = function(schemeId) {
  const scheme = allSchemes.find(s => s.id === schemeId)
  if (scheme) {
    const howToApplyHTML = (scheme.howToApply || []).map((step, index) => 
      `<li style="margin-bottom: 12px; line-height: 1.6;"><strong>Step ${index + 1}:</strong> ${step}</li>`
    ).join('')
    
    const requiredDocsHTML = (scheme.requiredDocuments || []).map(doc => 
      `<span style="display: inline-block; background: #e8f4f8; color: #0052cc; padding: 6px 12px; margin: 4px; border-radius: 4px; font-size: 13px;">📄 ${doc}</span>`
    ).join('')

    const eligibilityHTML = `
      <div style="background: #f0f8ff; border-left: 4px solid #0052cc; padding: 12px; border-radius: 4px; margin-bottom: 16px;">
        <p style="margin: 0; color: #333;">${scheme.eligibility}</p>
      </div>
    `

    const detailContent = `
      <div style="max-height: 80vh; overflow-y: auto;">
        <h2 style="color: #ff9933; margin-top: 0; font-size: 24px; border-bottom: 3px solid #ff9933; padding-bottom: 12px;">${scheme.name}</h2>
        
        <div style="background: #fffbf0; border-left: 4px solid var(--gov-saffron); padding: 12px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6;">${scheme.description}</p>
        </div>

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">✅ ${typeof t === 'function' ? t('eligibility') : 'Who is Eligible?'}</h3>
        ${eligibilityHTML}

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">💰 ${typeof t === 'function' ? t('benefits') : 'Benefits'}</h3>
        <div style="background: #f0fff0; border-left: 4px solid #138808; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; color: #333;">${scheme.benefits}</p>
        </div>

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">📎 ${typeof t === 'function' ? t('documents') : 'Required Documents'}</h3>
        <div style="margin-bottom: 20px;">
          ${requiredDocsHTML}
        </div>

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">🔹 ${typeof t === 'function' ? t('how_to_apply') : 'How to Apply?'}</h3>
        <ol style="color: #333; line-height: 1.8; padding-left: 20px;">
          ${howToApplyHTML}
        </ol>

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">🌐 ${typeof t === 'function' ? t('official_website') : 'Official Website'}</h3>
        <a href="${scheme.officialLink}" target="_blank" style="color: #0052cc; text-decoration: none; font-weight: 600; font-size: 15px;">
          Visit: ${scheme.officialLink} →
        </a>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
          <button onclick="window.open('${scheme.officialLink}', '_blank')" style="
            background: linear-gradient(135deg, var(--gov-saffron) 0%, var(--gov-green) 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(255,153,51,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">🔗 ${typeof t === 'function' ? t('register_button') : 'Register on Official Website'}</button>
        </div>
      </div>
    `

    document.getElementById('scheme-detail-content').innerHTML = detailContent
    document.getElementById('scheme-modal').style.display = 'flex'
  }
}

// Close scheme modal
window.closeSchemeModal = function() {
  document.getElementById('scheme-modal').style.display = 'none'
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('scheme-modal')
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSchemeModal()
      }
    })
  }
})

// Tab switching
function setupEventListeners() {
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active')
    tabRegister.classList.remove('active')
    loginForm.style.display = 'block'
    registerForm.style.display = 'none'
    authMessage.textContent = ''
    updatePageTranslations()
  })

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active')
    tabLogin.classList.remove('active')
    registerForm.style.display = 'block'
    loginForm.style.display = 'none'
    authMessage.textContent = ''
    updatePageTranslations()
  })

// Get users from localStorage
function getUsers() {
  const users = localStorage.getItem('users')
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

// Get current logged in user
function getCurrentUser() {
  return localStorage.getItem('currentUser')
}

// Set current user
function setCurrentUser(email, name) {
  localStorage.setItem('currentUser', JSON.stringify({ email, name }))
}

// Clear current user
function clearCurrentUser() {
  localStorage.removeItem('currentUser')
}

// Login Form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      setCurrentUser(email, user.name)
      playNationalAnthem()
      showAppPage()
      loginForm.reset()
    } else {
      authMessage.textContent = '❌ Invalid email or password'
      authMessage.style.color = '#ff6b6b'
    }
  })

  // Register Form
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('register-name').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    const confirm = document.getElementById('register-confirm').value

    if (password !== confirm) {
      authMessage.textContent = '❌ Passwords do not match'
      authMessage.style.color = '#ff6b6b'
      return
    }

    const users = getUsers()
    const existingUser = users.find(u => u.email === email)

    if (existingUser) {
      authMessage.textContent = '❌ Email already registered'
      authMessage.style.color = '#ff6b6b'
      return
    }

    users.push({ name, email, password })
    saveUsers(users)
    authMessage.textContent = '✅ Registration successful! Please login.'
    authMessage.style.color = '#4ecdc4'
    playNationalAnthem()

    setTimeout(() => {
      tabLogin.click()
      registerForm.reset()
    }, 1500)
  })

  // Audio Toggle Button
  audioToggleBtn.addEventListener('click', () => {
    if (audioEnabled) {
      // Turn off audio
      if (nationalAnthem) {
        nationalAnthem.pause()
      }
      audioEnabled = false
      audioToggleBtn.textContent = '🔇 Audio Off'
      audioToggleBtn.classList.add('muted')
    } else {
      // Turn on audio
      audioEnabled = true
      audioToggleBtn.textContent = '🔊 Audio On'
      audioToggleBtn.classList.remove('muted')
    }
  })

  // Logout
  logoutBtn.addEventListener('click', () => {
    clearCurrentUser()
    showAuthPage()
    // Stop anthem if playing
    if (nationalAnthem) {
      nationalAnthem.pause()
      nationalAnthem.currentTime = 0
    }
  })

  // Profile form submit
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Make sure resultsSection is initialized
    if (!resultsSection) {
      resultsSection = document.getElementById('results-section')
    }
    
    const profile = {
      state: document.getElementById('state').value,
      age: document.getElementById('age').value,
      occupation: document.getElementById('occupation').value,
      gender: document.getElementById('gender').value
    }
    localStorage.setItem('userProfile', JSON.stringify(profile))
    alert('✅ Profile saved! Showing schemes for you...')
    
    // Show schemes after profile is saved
    if (resultsSection) {
      resultsSection.style.display = 'block'
    }
    loadSchemes()  // Load schemes from JSON, then filter
  })

  // Enable audio on any user interaction
  document.addEventListener('click', () => {
    if (nationalAnthem && nationalAnthem.paused && nationalAnthem.currentTime === 0) {
      // Try to play if it was blocked
      nationalAnthem.play().catch(() => {})
    }
  })
}

// Show Auth Page
function showAuthPage() {
  authContainer.style.display = 'flex'
  appContainer.style.display = 'none'
  loginForm.reset()
  registerForm.reset()
  authMessage.textContent = ''
}

// Show App Page
function showAppPage() {
  authContainer.style.display = 'none'
  appContainer.style.display = 'flex'
  
  const user = getCurrentUser()
  if (user) {
    const { name, email } = JSON.parse(user)
    userName.textContent = `👤 ${name}`
    loadProfileData()
    
    // Call translation update for app page
    updatePageTranslations()
    
    // Check if profile is saved, if yes show schemes
    const saved = localStorage.getItem('userProfile')
    if (saved) {
      resultsSection.style.display = 'block'
      loadSchemes()
    } else {
      resultsSection.style.display = 'none'
    }
  }
}

// Load saved profile data
function loadProfileData() {
  const saved = localStorage.getItem('userProfile')
  if (saved) {
    const profile = JSON.parse(saved)
    document.getElementById('state').value = profile.state || ''
    document.getElementById('age').value = profile.age || ''
    document.getElementById('occupation').value = profile.occupation || ''
    document.getElementById('gender').value = profile.gender || ''
  }
}

// Check if user is already logged in
function checkLogin() {
  const user = getCurrentUser()
  if (user) {
    showAppPage()
  } else {
    showAuthPage()
  }
}

// Refresh schemes display (called when language changes)
window.refreshSchemesDisplay = function() {
  if (resultsSection && resultsSection.style.display !== 'none' && allSchemes.length > 0) {
    displaySchemes(allSchemes)
  }
}

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

const chatbotResponses = {
  schemes: {
    en: "We have 50+ government schemes including PM Kisan, Ayushman Bharat, Sukanya Samriddhi Yojana, and more. Fill your profile details to see schemes you're eligible for! 🎯",
    hi: "हमारे पास 50+ सरकारी योजनाएं हैं जिनमें पीएम किसान, आयुष्मान भारत, सुकन्या समृद्धि योजना आदि शामिल हैं। अपने योग्य योजनाओं को देखने के लिए अपना प्रोफाइल भरें! 🎯"
  },
  eligibility: {
    en: "1. Fill in your details (age, occupation, gender, state)\n2. Click 'Save Details'\n3. We'll show schemes you're eligible for\n4. Click on any scheme to see full details! ✅",
    hi: "1. अपना विवरण भरें (उम्र, व्यवसाय, लिंग, राज्य)\n2. 'विवरण सहेजें' पर क्लिक करें\n3. हम आपके योग्य योजनाएं दिखाएंगे\n4. पूरी जानकारी के लिए किसी भी योजना पर क्लिक करें! ✅"
  },
  apply: {
    en: "To apply:\n1. View scheme details by clicking on a scheme card\n2. Check eligibility and required documents\n3. Click 'Register on Official Website' button\n4. You'll be redirected to the official government portal to complete your application 🔗",
    hi: "आवेदन करने के लिए:\n1. योजना कार्ड पर क्लिक करके विवरण देखें\n2. योग्यता और आवश्यक दस्तावेज जांचें\n3. 'आधिकारिक वेबसाइट पर पंजीकृत करें' बटन पर क्लिक करें\n4. आवेदन पूरा करने के लिए आपको आधिकारिक सरकारी पोर्टल पर भेजा जाएगा 🔗"
  },
  help: {
    en: "I can help you with:\n• Finding government schemes 🎯\n• Checking eligibility ✅\n• Understanding how to apply 📝\n• Navigating the portal 🧭\n\nWhat would you like to know?",
    hi: "मैं आपकी इनमें मदद कर सकता हूं:\n• सरकारी योजनाएं खोजना 🎯\n• योग्यता जांचना ✅\n• आवेदन कैसे करें समझना 📝\n• पोर्टल का उपयोग करना 🧭\n\nआप क्या जानना चाहेंगे?"
  },
  default: {
    en: "I'm here to help you discover government schemes! 😊\n\nYou can ask me about:\n• Available schemes\n• Eligibility criteria\n• How to apply\n• Any other questions about the portal\n\nHow can I assist you?",
    hi: "मैं आपको सरकारी योजनाएं खोजने में मदद करने के लिए यहां हूं! 😊\n\nआप मुझसे पूछ सकते हैं:\n• उपलब्ध योजनाएं\n• योग्यता मानदंड\n• आवेदन कैसे करें\n• पोर्टल के बारे में कोई अन्य प्रश्न\n\nमैं आपकी कैसे सहायता कर सकता हूं?"
  }
}

function initChatbot() {
  const chatbotToggle = document.getElementById('chatbot-toggle')
  const chatbotContainer = document.getElementById('chatbot-container')
  const chatbotClose = document.getElementById('chatbot-close')
  const chatbotInput = document.getElementById('chatbot-input')
  const chatbotSend = document.getElementById('chatbot-send')
  const chatbotMessages = document.getElementById('chatbot-messages')
  const quickQuestions = document.querySelectorAll('.quick-question')

  if (!chatbotToggle || !chatbotContainer) return

  // Toggle chatbot
  chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active')
    if (chatbotContainer.classList.contains('active')) {
      chatbotInput.focus()
      // Remove badge when opened
      const badge = chatbotToggle.querySelector('.chatbot-badge')
      if (badge) badge.style.display = 'none'
    }
  })

  chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active')
  })

  // Send message
  function sendMessage() {
    const message = chatbotInput.value.trim()
    if (!message) return

    // Add user message
    addMessage(message, 'user')
    chatbotInput.value = ''

    // Get bot response
    setTimeout(() => {
      const response = getBotResponse(message)
      addMessage(response, 'bot')
    }, 500)
  }

  chatbotSend.addEventListener('click', sendMessage)
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage()
  })

  // Quick questions
  quickQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question')
      const questionText = btn.textContent
      addMessage(questionText, 'user')
      
      setTimeout(() => {
        const response = getQuickResponse(question)
        addMessage(response, 'bot')
      }, 500)
    })
  })

  function addMessage(text, type) {
    const messageDiv = document.createElement('div')
    messageDiv.className = `chatbot-message ${type}-message`
    
    const avatar = document.createElement('div')
    avatar.className = 'message-avatar'
    avatar.textContent = type === 'bot' ? '🤖' : '👤'
    
    const content = document.createElement('div')
    content.className = 'message-content'
    const p = document.createElement('p')
    p.textContent = text
    p.style.whiteSpace = 'pre-line'
    content.appendChild(p)
    
    messageDiv.appendChild(avatar)
    messageDiv.appendChild(content)
    chatbotMessages.appendChild(messageDiv)
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight
  }

  function getBotResponse(message) {
    const lang = currentLanguage || 'en'
    const lowerMessage = message.toLowerCase()
    
    // Check for keywords
    if (lowerMessage.includes('scheme') || lowerMessage.includes('योजना')) {
      return chatbotResponses.schemes[lang] || chatbotResponses.schemes.en
    }
    if (lowerMessage.includes('eligible') || lowerMessage.includes('योग्य')) {
      return chatbotResponses.eligibility[lang] || chatbotResponses.eligibility.en
    }
    if (lowerMessage.includes('apply') || lowerMessage.includes('आवेदन')) {
      return chatbotResponses.apply[lang] || chatbotResponses.apply.en
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('मदद')) {
      return chatbotResponses.help[lang] || chatbotResponses.help.en
    }
    
    return chatbotResponses.default[lang] || chatbotResponses.default.en
  }

  function getQuickResponse(question) {
    const lang = currentLanguage || 'en'
    return chatbotResponses[question]?.[lang] || chatbotResponses[question]?.en || chatbotResponses.default[lang]
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeDOMElements()
  setupEventListeners()
  checkLogin()
  initChatbot()
  
  // Ensure translations are applied after small delay to ensure DOM is fully ready
  setTimeout(() => {
    if (typeof updatePageTranslations === 'function') {
      console.log('Calling updatePageTranslations from main.js DOMContentLoaded')
      updatePageTranslations()
    }
  }, 100)
})




