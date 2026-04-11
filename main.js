// Simple Login/Register System (No Clerk)

let authContainer, appContainer, tabLogin, tabRegister, loginForm, registerForm, logoutBtn, profileForm, authMessage, userName, resultsList, resultsSection

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
}

let allSchemes = []

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

// Store filtered schemes based on user profile globally
let profileFilteredSchemes = []

// Filter schemes based on user profile
function filterAndDisplaySchemes() {
  const saved = localStorage.getItem('userProfile')
  
  if (!saved || allSchemes.length === 0) {
    console.log('No saved profile or schemes. Showing all.')
    profileFilteredSchemes = allSchemes
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

  // Store the profile-filtered schemes for category filtering
  profileFilteredSchemes = filteredSchemes.length > 0 ? filteredSchemes : allSchemes
  
  console.log(`Filtered: ${filteredSchemes.length} out of ${allSchemes.length} schemes match`)
  displaySchemes(profileFilteredSchemes)
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

  // Display category tabs using profile-filtered schemes
  displayCategoryTabs(profileFilteredSchemes.length > 0 ? profileFilteredSchemes : schemes)

  const readMoreText = typeof t === 'function' ? t('read_more') : 'Read More →'
  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en'
  
  resultsList.innerHTML = schemes.map(scheme => {
    const translatedName = typeof window.translateSchemeName === 'function' ? window.translateSchemeName(scheme.name, currentLang) : scheme.name
    const translatedCategory = typeof window.translateCategory === 'function' ? window.translateCategory(scheme.category || 'General', currentLang) : (scheme.category || 'General')
    
    return `
      <div class="scheme-card" onclick="viewScheme('${scheme.id}')">
        <div class="scheme-name">${translatedName}</div>
        <div class="scheme-desc">${scheme.description}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
          <span class="scheme-category">${translatedCategory}</span>
          <span style="color: #ff9933; font-weight: 600; cursor: pointer; font-size: 14px;">${readMoreText}</span>
        </div>
      </div>
    `
  }).join('')
}

// Display category tabs
function displayCategoryTabs(schemes) {
  const categoryTabs = document.getElementById('category-tabs')
  if (!categoryTabs) return
  
  // Get unique categories
  const categories = [...new Set(schemes.map(s => s.category))].sort()
  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en'
  
  // Create "All" tab with translation
  const allTextMap = {
    'en': 'All',
    'hi': 'सभी',
    'ta': 'அனைத்தும்',
    'te': 'అన్నీ',
    'kn': 'ಎಲ್ಲಾ',
    'ml': 'എല്ലാം',
    'mr': 'सर्व',
    'gu': 'બધા',
    'bn': 'সব'
  }
  const allText = allTextMap[currentLang] || 'All'
  let tabsHTML = `<button class="category-tab active" onclick="filterByCategory(null, event)">${allText} (${schemes.length})</button>`
  
  // Add category tabs with count
  categories.forEach(category => {
    const count = schemes.filter(s => s.category === category).length
    const translatedCategory = typeof window.translateCategory === 'function' ? window.translateCategory(category, currentLang) : category
    tabsHTML += `<button class="category-tab" onclick="filterByCategory('${category}', event)">${translatedCategory} (${count})</button>`
  })
  
  categoryTabs.innerHTML = tabsHTML
}

// Filter schemes by category
window.filterByCategory = function(category, event) {
  event.preventDefault()
  
  // Update active tab
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active')
  })
  event.target.classList.add('active')
  
  // Use profile-filtered schemes as the base for category filtering
  const baseSchemes = profileFilteredSchemes.length > 0 ? profileFilteredSchemes : allSchemes
  
  // Filter and display
  if (category === null) {
    displayFilteredResults(baseSchemes)
  } else {
    const filtered = baseSchemes.filter(s => s.category === category)
    displayFilteredResults(filtered)
  }
}

// Display filtered results (only schemes list, not tabs)
function displayFilteredResults(schemes) {
  if (!resultsList) {
    resultsList = document.getElementById('results-list')
  }
  
  if (!resultsList) return
  
  if (!schemes || schemes.length === 0) {
    resultsList.innerHTML = `<p style="color: #b0b5c1;">No schemes in this category</p>`
    return
  }

  const readMoreText = typeof t === 'function' ? t('read_more') : 'Read More →'
  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en'
  
  resultsList.innerHTML = schemes.map(scheme => {
    const translatedName = typeof window.translateSchemeName === 'function' ? window.translateSchemeName(scheme.name, currentLang) : scheme.name
    const translatedCategory = typeof window.translateCategory === 'function' ? window.translateCategory(scheme.category || 'General', currentLang) : (scheme.category || 'General')
    
    return `
      <div class="scheme-card" onclick="viewScheme('${scheme.id}')">
        <div class="scheme-name">${translatedName}</div>
        <div class="scheme-desc">${scheme.description}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
          <span class="scheme-category">${translatedCategory}</span>
          <span style="color: #ff9933; font-weight: 600; cursor: pointer; font-size: 14px;">${readMoreText}</span>
        </div>
      </div>
    `
  }).join('')
}

// View scheme details in modal
window.viewScheme = function(schemeId) {
  const scheme = allSchemes.find(s => s.id === schemeId)
  if (scheme) {
    const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en'
    const translatedName = typeof window.translateSchemeName === 'function' ? window.translateSchemeName(scheme.name, currentLang) : scheme.name
    
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
        <h2 style="color: #ff9933; margin-top: 0; font-size: 24px; border-bottom: 3px solid #ff9933; padding-bottom: 12px;">${translatedName}</h2>
        
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
    setTimeout(() => {
      tabLogin.click()
      registerForm.reset()
    }, 1500)
  })

  // Logout
  logoutBtn.addEventListener('click', () => {
    clearCurrentUser()
    showAuthPage()
  })

  // Profile form submit
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Make sure sections are initialized
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
    alert('✅ Profile saved! Showing your dashboard...')
    
    // Hide profile section and show dashboard
    const profileSection = document.querySelector('.profile-section')
    const dashboardSection = document.getElementById('dashboard-section')
    if (profileSection) {
      profileSection.style.display = 'none'
    }
    if (dashboardSection) {
      dashboardSection.style.display = 'block'
      // Load schemes first, then populate dashboard
      if (allSchemes.length === 0) {
        loadSchemes().then(() => {
          populateDashboard()
        })
      } else {
        populateDashboard()
      }
    }
    if (resultsSection) {
      resultsSection.style.display = 'none'
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
    
    // Check if profile is saved
    const saved = localStorage.getItem('userProfile')
    const profileSection = document.querySelector('.profile-section')
    
    if (saved) {
      // Profile exists - show schemes only
      if (profileSection) {
        profileSection.style.display = 'none'
      }
      if (resultsSection) {
        resultsSection.style.display = 'block'
      }
      loadSchemes()
    } else {
      // No profile yet - show profile form
      if (profileSection) {
        profileSection.style.display = 'block'
      }
      if (resultsSection) {
        resultsSection.style.display = 'none'
      }
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
  console.log('🤖 Initializing chatbot...')
  
  const chatbotToggle = document.getElementById('chatbot-toggle')
  const chatbotContainer = document.getElementById('chatbot-container')
  const chatbotClose = document.getElementById('chatbot-close')
  const chatbotInput = document.getElementById('chatbot-input')
  const chatbotSend = document.getElementById('chatbot-send')
  const chatbotMessages = document.getElementById('chatbot-messages')
  const quickQuestions = document.querySelectorAll('.quick-question')

  console.log('Chatbot elements:', {
    toggle: !!chatbotToggle,
    container: !!chatbotContainer,
    close: !!chatbotClose,
    input: !!chatbotInput,
    send: !!chatbotSend,
    messages: !!chatbotMessages,
    quickQuestions: quickQuestions.length
  })

  if (!chatbotToggle || !chatbotContainer) {
    console.error('❌ Chatbot elements not found!')
    return
  }

  // Helper functions exposed globally
  function addMessage(text, type) {
    console.log('addMessage called:', { text, type })
    
    const messages = document.getElementById('chatbot-messages')
    if (!messages) {
      console.error('chatbotMessages element not found!')
      return
    }
    
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
    messages.appendChild(messageDiv)
    
    console.log('Message added to DOM')
    
    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight
  }

  function getBotResponse(message) {
    const lang = (typeof window.currentLanguage !== 'undefined' ? window.currentLanguage : null) || 
                 localStorage.getItem('selectedLanguage') || 'en'
    console.log('Getting bot response in language:', lang)
    
    const lowerMessage = message.toLowerCase()
    
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
    const lang = (typeof window.currentLanguage !== 'undefined' ? window.currentLanguage : null) || 
                 localStorage.getItem('selectedLanguage') || 'en'
    return chatbotResponses[question]?.[lang] || chatbotResponses[question]?.en || chatbotResponses.default[lang]
  }

  // Global send message function
  window.chatbotSendMessage = function() {
    console.log('chatbotSendMessage called')
    
    const input = document.getElementById('chatbot-input')
    if (!input) {
      console.error('chatbotInput not found!')
      return
    }
    
    const message = input.value.trim()
    console.log('Message value:', message)
    
    if (!message) {
      console.log('Empty message, returning')
      return
    }

    addMessage(message, 'user')
    input.value = ''

    setTimeout(() => {
      const response = getBotResponse(message)
      addMessage(response, 'bot')
    }, 500)
  }

  // Global quick question handler
  window.handleQuickQuestion = function(question, questionText) {
    console.log('handleQuickQuestion called:', question, questionText)
    
    addMessage(questionText, 'user')
    
    setTimeout(() => {
      const response = getQuickResponse(question)
      addMessage(response, 'bot')
    }, 500)
  }

  // Create global toggle function
  window.toggleChatbot = function() {
    console.log('🔔 toggleChatbot called!')
    const isActive = chatbotContainer.classList.contains('active')
    console.log('Current state:', isActive ? 'open' : 'closed')
    
    if (isActive) {
      chatbotContainer.classList.remove('active')
      console.log('Closing chatbot')
    } else {
      chatbotContainer.classList.add('active')
      console.log('Opening chatbot')
      if (chatbotInput) {
        setTimeout(() => chatbotInput.focus(), 100)
      }
      // Remove badge when opened
      const badge = chatbotToggle.querySelector('.chatbot-badge')
      if (badge) badge.style.display = 'none'
    }
  }

  // Also add traditional event listener as backup
  chatbotToggle.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Chatbot toggle clicked via event listener')
    window.toggleChatbot()
  })

  if (chatbotClose) {
    chatbotClose.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('Chatbot closed via X button')
      chatbotContainer.classList.remove('active')
    })
  }

  // Also add event listeners as backup
  if (chatbotSend) {
    console.log('Adding click listener to send button')
    chatbotSend.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('Send button clicked via event listener')
      window.chatbotSendMessage()
    })
  }
  
  if (chatbotInput) {
    console.log('Adding keypress listener to input')
    chatbotInput.addEventListener('keypress', (e) => {
      console.log('Key pressed:', e.key)
      if (e.key === 'Enter') {
        e.preventDefault()
        console.log('Enter key detected')
        window.chatbotSendMessage()
      }
    })
  }

  // Quick questions backup
  quickQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question')
      const questionText = btn.textContent
      window.handleQuickQuestion(question, questionText)
    })
  })
  
  console.log('✅ Chatbot initialized successfully!')
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

// Populate dashboard with user profile info
function populateDashboard() {
  const saved = localStorage.getItem('userProfile')
  if (!saved) return
  
  const profile = JSON.parse(saved)
  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en'
  
  // Update profile cards with translations
  const translatedState = typeof window.translateState === 'function' ? window.translateState(profile.state, currentLang) : profile.state
  const translatedOccupation = typeof t === 'function' ? t(profile.occupation.toLowerCase().replace(' ', '_')) : profile.occupation
  const translatedGender = typeof t === 'function' ? t(profile.gender.toLowerCase().replace(' ', '_').replace('-', '_')) : profile.gender
  
  document.getElementById('dashboard-state').textContent = translatedState || '-'
  document.getElementById('dashboard-age').textContent = profile.age || '-'
  document.getElementById('dashboard-occupation').textContent = translatedOccupation || profile.occupation || '-'
  document.getElementById('dashboard-gender').textContent = translatedGender || profile.gender || '-'
  
  // Calculate matched schemes - ensure schemes are loaded first
  if (allSchemes.length === 0) {
    console.log('Loading schemes for dashboard...')
    loadSchemes().then(() => {
      console.log('Schemes loaded, updating stats...')
      updateSchemeStats(profile)
    })
  } else {
    console.log('Schemes already loaded, updating stats...')
    updateSchemeStats(profile)
  }
}

// Update scheme statistics
function updateSchemeStats(profile) {
  const userAge = parseInt(profile.age)
  const userOccupation = profile.occupation
  
  console.log('Updating scheme stats for:', { age: userAge, occupation: userOccupation, totalSchemes: allSchemes.length })
  
  const matchedSchemes = allSchemes.filter(scheme => {
    if (!scheme.criteria) return true
    
    const criteria = scheme.criteria
    
    // Check age
    if (criteria.minAge !== null && criteria.minAge !== undefined && userAge < criteria.minAge) {
      return false
    }
    if (criteria.maxAge !== null && criteria.maxAge !== undefined && userAge > criteria.maxAge) {
      return false
    }
    
    // Check occupation
    if (criteria.occupations && criteria.occupations.length > 0) {
      if (!criteria.occupations.includes(userOccupation)) {
        return false
      }
    }
    
    return true
  })
  
  const totalElement = document.getElementById('total-schemes')
  const matchedElement = document.getElementById('matched-schemes')
  
  if (totalElement) {
    totalElement.textContent = allSchemes.length
    console.log('Updated total-schemes to:', allSchemes.length)
  } else {
    console.error('total-schemes element not found!')
  }
  
  if (matchedElement) {
    matchedElement.textContent = matchedSchemes.length
    console.log('Updated matched-schemes to:', matchedSchemes.length)
  } else {
    console.error('matched-schemes element not found!')
  }
}

// Navigate to schemes view
window.goToSchemes = function() {
  const dashboardSection = document.getElementById('dashboard-section')
  if (dashboardSection) {
    dashboardSection.style.display = 'none'
  }
  if (resultsSection) {
    resultsSection.style.display = 'block'
  }
  loadSchemes()
}

// Back to dashboard from schemes
window.backToDashboard = function() {
  const dashboardSection = document.getElementById('dashboard-section')
  if (dashboardSection) {
    dashboardSection.style.display = 'block'
  }
  if (resultsSection) {
    resultsSection.style.display = 'none'
  }
}

// Back to profile from dashboard
window.backToProfile = function() {
  const profileSection = document.querySelector('.profile-section')
  const dashboardSection = document.getElementById('dashboard-section')
  if (profileSection) {
    profileSection.style.display = 'block'
  }
  if (dashboardSection) {
    dashboardSection.style.display = 'none'
  }
}




