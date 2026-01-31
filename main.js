// Simple Login/Register System (No Clerk)

const authContainer = document.getElementById('auth-container')
const appContainer = document.getElementById('app-container')
const tabLogin = document.getElementById('tab-login')
const tabRegister = document.getElementById('tab-register')
const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')
const logoutBtn = document.getElementById('logout-btn')
const profileForm = document.getElementById('profile-form')
const authMessage = document.getElementById('auth-message')
const userName = document.getElementById('user-name')
const resultsList = document.getElementById('results-list')
const resultsSection = document.getElementById('results-section')
const nationalAnthem = document.getElementById('national-anthem')
const audioToggleBtn = document.getElementById('audio-toggle-btn')

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
  try {
    const response = await fetch('schemes.json')
    const data = await response.json()
    allSchemes = data.schemes || []
    console.log('Loaded schemes:', allSchemes.length)
    filterAndDisplaySchemes()
  } catch (error) {
    console.error('Error loading schemes:', error)
    resultsList.innerHTML = '<p>Error loading schemes</p>'
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
  if (!schemes || schemes.length === 0) {
    resultsList.innerHTML = `<p style="color: #b0b5c1;">${t('no_schemes')}</p>`
    return
  }

  resultsList.innerHTML = schemes.map(scheme => `
    <div class="scheme-card" onclick="viewScheme('${scheme.id}')">
      <div class="scheme-name">${scheme.name}</div>
      <div class="scheme-desc">${scheme.description}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
        <span class="scheme-category">${scheme.category || 'General'}</span>
        <span style="color: #ff9933; font-weight: 600; cursor: pointer; font-size: 14px;">${t('read_more')}</span>
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

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">✅ ${t('eligibility')}</h3>
        ${eligibilityHTML}

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">💰 ${t('benefits')}</h3>
        <div style="background: #f0fff0; border-left: 4px solid #138808; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; color: #333;">${scheme.benefits}</p>
        </div>

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">📎 ${t('documents')}</h3>
        <div style="margin-bottom: 20px;">
          ${requiredDocsHTML}
        </div>

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">🔹 ${t('how_to_apply')}</h3>
        <ol style="color: #333; line-height: 1.8; padding-left: 20px;">
          ${howToApplyHTML}
        </ol>

        <h3 style="color: #138808; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">🌐 ${t('official_website')}</h3>
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
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(255,153,51,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">🔗 ${t('register_button')}</button>
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

// Profile form submit
profileForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const profile = {
    state: document.getElementById('state').value,
    age: document.getElementById('age').value,
    occupation: document.getElementById('occupation').value,
    gender: document.getElementById('gender').value
  }
  localStorage.setItem('userProfile', JSON.stringify(profile))
  alert('✅ Profile saved! Showing schemes for you...')
  
  // Show schemes after profile is saved
  resultsSection.style.display = 'block'
  loadSchemes()  // Load schemes from JSON, then filter
})

// Check if user is already logged in
function checkLogin() {
  const user = getCurrentUser()
  if (user) {
    showAppPage()
  } else {
    showAuthPage()
  }
}

// Enable audio on any user interaction
document.addEventListener('click', () => {
  if (nationalAnthem && nationalAnthem.paused && nationalAnthem.currentTime === 0) {
    // Try to play if it was blocked
    nationalAnthem.play().catch(() => {})
  }
})

// Refresh schemes display (called when language changes)
window.refreshSchemesDisplay = function() {
  if (resultsSection && resultsSection.style.display !== 'none' && allSchemes.length > 0) {
    displaySchemes(allSchemes)
  }
}

// Initialize on page load
checkLogin()




