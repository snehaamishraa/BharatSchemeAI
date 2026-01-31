/**
 * BharatScheme – AI Assisted Government Scheme Finder
 * Auth via Clerk; Profile, Schemes from JSON, Scheme detail modal
 */

(function () {
  'use strict';

  var STORAGE_KEYS = {
    userProfile: 'bharatscheme-userProfile',
    lang: 'bharatscheme-lang'
  };

  var T = {
    en: {
      tagline: 'Discover Government Schemes Tailored for Your Benefits',
      tabLogin: 'Login',
      tabRegister: 'Register',
      labelEmail: 'Email',
      labelPassword: 'Password',
      labelName: 'Full Name',
      btnLogin: 'Login',
      btnRegister: 'Register',
      authHint: 'Sign in or create an account to continue.',
      profileTitle: 'Your details (helps us find right schemes)',
      labelState: 'State',
      labelAge: 'Age',
      labelOccupation: 'Occupation',
      labelIncome: 'Annual Income (₹)',
      btnSaveProfile: 'Save & Find Schemes',
      btnLogout: 'Logout',
      searchLabel: 'What are you looking for?',
      searchPlaceholder: 'e.g. farmer, pension, education...',
      btnSearch: 'Find Schemes',
      sectionQuickPick: 'Quick pick',
      categoryFarmer: 'Farmer',
      categoryPension: 'Pension',
      categoryEducation: 'Education',
      categoryHealth: 'Health',
      categoryWomen: 'Women',
      categoryAll: 'All Schemes',
      sectionYourSchemes: 'Schemes for you',
      btnBack: '← Back',
      footerLine1: 'Bringing government scheme information to you',
      footerLine2: 'Powered by AI',
      noResults: 'No schemes found. Try different words.',
      modalDesc: 'Description',
      modalEligibility: 'Eligibility',
      modalBenefits: 'Benefits',
      modalDocuments: 'Required Documents',
      modalHowToApply: 'How to Apply',
      modalOfficialLink: 'Official Website / Apply'
    },
    hi: {
      tagline: 'आपके लिए सही सरकारी योजना ढूंढें',
      tabLogin: 'लॉगिन',
      tabRegister: 'रजिस्टर',
      labelEmail: 'ईमेल',
      labelPassword: 'पासवर्ड',
      labelName: 'पूरा नाम',
      btnLogin: 'लॉगिन',
      btnRegister: 'रजिस्टर',
      authHint: 'जारी रखने के लिए साइन इन करें या अकाउंट बनाएं।',
      profileTitle: 'आपके बारे में (सही योजना ढूंढने में मदद करता है)',
      labelState: 'राज्य',
      labelAge: 'उम्र',
      labelOccupation: 'पेशा',
      labelIncome: 'वार्षिक आय (₹)',
      btnSaveProfile: 'सेव करें और योजना ढूंढें',
      btnLogout: 'लॉगआउट',
      searchLabel: 'आप क्या ढूंढ रहे हैं?',
      searchPlaceholder: 'जैसे: किसान, पेंशन, शिक्षा...',
      btnSearch: 'योजना ढूंढें',
      sectionQuickPick: 'शीघ्र चुनें',
      categoryFarmer: 'किसान',
      categoryPension: 'पेंशन',
      categoryEducation: 'शिक्षा',
      categoryHealth: 'स्वास्थ्य',
      categoryWomen: 'महिला',
      categoryAll: 'सभी योजनाएं',
      sectionYourSchemes: 'आपके लिए योजनाएं',
      btnBack: '← वापस जाएं',
      footerLine1: 'सरकारी योजनाओं की जानकारी आप तक',
      footerLine2: 'AI सहायता से',
      noResults: 'कोई योजना नहीं मिली। दूसरे शब्द आज़माएं।',
      modalDesc: 'विवरण',
      modalEligibility: 'पात्रता',
      modalBenefits: 'लाभ',
      modalDocuments: 'जरूरी दस्तावेज',
      modalHowToApply: 'कैसे आवेदन करें',
      modalOfficialLink: 'ऑफिसियल वेबसाइट / आवेदन'
    }
  };

  var SCHEMES = [];
  var currentLang = (function () {
    try {
      var saved = localStorage.getItem(STORAGE_KEYS.lang);
      return saved === 'hi' || saved === 'en' ? saved : 'en';
    } catch (e) {
      return 'en';
    }
  })();

  var authScreen = document.getElementById('auth-screen');
  var mainScreen = document.getElementById('main-screen');
  var clerkAuthContainer = document.getElementById('clerk-auth-container');
  var profileForm = document.getElementById('profile-form');
  var searchInput = document.getElementById('search');
  var btnSearch = document.getElementById('btn-search');
  var btnBack = document.getElementById('btn-back');
  var btnLogout = document.getElementById('btn-logout');
  var resultsSection = document.getElementById('results-section');
  var resultsList = document.getElementById('results-list');
  var searchSection = mainScreen ? mainScreen.querySelector('.search-section') : null;
  var categoriesSection = mainScreen ? mainScreen.querySelector('.categories-section') : null;
  var categoryCards = mainScreen ? mainScreen.querySelectorAll('.category-card') : [];
  var langButtons = mainScreen ? mainScreen.querySelectorAll('.lang-btn') : [];
  var schemeModal = document.getElementById('scheme-modal');
  var schemeDetail = document.getElementById('scheme-detail');
  var modalClose = document.getElementById('modal-close');
  var modalBackdrop = document.getElementById('modal-backdrop');
  var mainInitialized = false;

  function getUserProfile() {
    try {
      var raw = localStorage.getItem(STORAGE_KEYS.userProfile);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveUserProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
    } catch (e) {}
  }

  function showScreen(screen) {
    if (authScreen) authScreen.classList.toggle('hidden', screen !== 'auth');
    if (mainScreen) mainScreen.classList.toggle('hidden', screen !== 'main');
  }

  function mountClerkSignIn() {
    if (window.Clerk && clerkAuthContainer) {
      try {
        window.Clerk.mountSignIn(clerkAuthContainer);
      } catch (e) {
        console.warn('Clerk mountSignIn:', e);
      }
    }
  }

  function unmountClerkSignIn() {
    if (window.Clerk && typeof window.Clerk.unmountSignIn === 'function') {
      try {
        window.Clerk.unmountSignIn(clerkAuthContainer);
      } catch (e) {}
    }
    if (clerkAuthContainer) clerkAuthContainer.innerHTML = '';
  }

  function onAuthStateChange() {
    if (!window.Clerk) return;
    if (window.Clerk.isSignedIn) {
      unmountClerkSignIn();
      showScreen('main');
      loadProfileIntoForm();
      loadSchemesAndInitMain();
    } else {
      showScreen('auth');
      mountClerkSignIn();
    }
  }

  function initAuthWithClerk() {
    if (!window.Clerk) {
      console.warn('Clerk not loaded. Add your Clerk script from Dashboard → API Keys → Quick Copy.');
      showScreen('auth');
      if (clerkAuthContainer) {
        clerkAuthContainer.innerHTML =
          '<p class="auth-clerk-message">Clerk is not configured yet. To enable sign-in: go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener">dashboard.clerk.com</a> → API Keys → Quick Copy (JavaScript), then replace the script tag in <code>index.html</code>.</p>' +
          '<button type="button" class="btn btn-primary btn-large btn-demo" id="btn-demo">Continue without sign-in (demo)</button>';
        var btnDemo = document.getElementById('btn-demo');
        if (btnDemo) {
          btnDemo.addEventListener('click', function () {
            showScreen('main');
            loadProfileIntoForm();
            loadSchemesAndInitMain();
          });
        }
      }
      return;
    }
    window.Clerk.addListener(function () {
      onAuthStateChange();
    });
    onAuthStateChange();
  }

  function loadProfileIntoForm() {
    var profile = getUserProfile();
    var stateEl = document.getElementById('profile-state');
    var ageEl = document.getElementById('profile-age');
    var occEl = document.getElementById('profile-occupation');
    var incEl = document.getElementById('profile-income');
    if (profile && stateEl && ageEl && occEl && incEl) {
      stateEl.value = profile.state || '';
      ageEl.value = profile.age != null ? profile.age : '';
      occEl.value = profile.occupation || '';
      incEl.value = profile.annualIncome != null ? profile.annualIncome : '';
    }
  }

  function loadSchemesAndInitMain() {
    fetch('schemes.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        SCHEMES = data.schemes || [];
        initMain();
      })
      .catch(function () {
        SCHEMES = [];
        initMain();
      });
  }

  function initMain() {
    if (mainInitialized) return;
    mainInitialized = true;

    if (btnLogout) {
      btnLogout.addEventListener('click', function () {
        window.open('', '_blank');
        if (window.Clerk && typeof window.Clerk.signOut === 'function') {
          window.Clerk.signOut().then(function () {
            showScreen('auth');
            mountClerkSignIn();
          }).catch(function () {
            showScreen('auth');
            mountClerkSignIn();
          });
        } else {
          showScreen('auth');
          if (clerkAuthContainer) {
            clerkAuthContainer.innerHTML =
              '<p class="auth-clerk-message">Clerk is not configured. <a href="https://dashboard.clerk.com" target="_blank" rel="noopener">Get your key</a> and add it in index.html.</p>' +
              '<button type="button" class="btn btn-primary btn-large btn-demo" id="btn-demo-logout">Continue without sign-in (demo)</button>';
            var btnDemoLogout = document.getElementById('btn-demo-logout');
            if (btnDemoLogout) {
              btnDemoLogout.addEventListener('click', function () {
                showScreen('main');
                loadProfileIntoForm();
                loadSchemesAndInitMain();
              });
            }
          }
        }
      });
    }

    if (profileForm) {
      profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        window.open('', '_blank');
        var state = document.getElementById('profile-state').value || '';
        var age = parseInt(document.getElementById('profile-age').value, 10);
        var occupation = document.getElementById('profile-occupation').value || '';
        var income = parseInt(document.getElementById('profile-income').value, 10) || 0;
        saveUserProfile({ state: state, age: isNaN(age) ? null : age, occupation: occupation, annualIncome: isNaN(income) ? null : income });
        alert(currentLang === 'hi' ? 'सेव हो गया।' : 'Saved. You can now find schemes.');
      });
    }

    setLanguage(currentLang);

    if (btnSearch && searchInput) {
      btnSearch.addEventListener('click', function () {
        window.open('', '_blank');
        showResults(searchInput.value, '');
      });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          window.open('', '_blank');
          btnSearch.click();
        }{
      btnBack.addEventListener('click', function () {
        window.open('', '_blank');
        showMainView();
      });
    }
      });
    }

    if (btnBack) btnBack.addEventListener('click', showMainView);
window.open('', '_blank');
        
    categoryCards.forEach(function (card) {
      card.addEventListener('click', function () {
        window.open('', '_blank');
        showResults(searchInput ? searchInput.value.trim() : '', this.getAttribute('data-category') || '');
      });
    });

    langButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentLang = this.getAttribute('data-lang');
        try { localStorage.setItem(STORAGE_KEYS.lang, currentLang); } catch (e) {}
        setLanguage(currentLang);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeSchemeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeSchemeModal);
  }

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    var t = T[currentLang] || T.en;
    var scope = mainScreen || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] != null) {
        if (el.getAttribute('data-i18n-aria')) el.setAttribute('aria-label', t[key]);
        var textEl = el.querySelector('.btn-text');
        if (textEl) textEl.textContent = t[key];
        else el.textContent = t[key];
      }
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] != null) el.placeholder = t[key];
    });
    langButtons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function matchesProfile(scheme) {
    var profile = getUserProfile();
    if (!profile) return true;
    var c = scheme.criteria || {};
    if (c.minAge != null && (profile.age == null || profile.age < c.minAge)) return false;
    if (c.maxAge != null && (profile.age == null || profile.age > c.maxAge)) return false;
    if (c.maxAnnualIncome != null && (profile.annualIncome != null && profile.annualIncome > c.maxAnnualIncome)) return false;
    if (c.occupations && c.occupations.length && profile.occupation && profile.occupation !== 'Other') {
      if (c.occupations.indexOf(profile.occupation) === -1) return false;
    }
    return true;
  }

  function getSchemes(query, category) {
    var q = (query || '').trim().toLowerCase();
    var cat = (category || '').toLowerCase();
    return SCHEMES.filter(function (s) {
      if (!matchesProfile(s)) return false;
      var matchCat = !cat || cat === 'all' || s.category === cat;
      if (!matchCat) return false;
      if (!q) return true;
      var nameMatch = (s.name || '').toLowerCase().indexOf(q) !== -1;
      var descMatch = (s.description || '').toLowerCase().indexOf(q) !== -1;
      var eligMatch = (s.eligibility || '').toLowerCase().indexOf(q) !== -1;
      return nameMatch || descMatch || eligMatch;
    });
  }

  function escapeHtml(text) {
    if (text == null) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function openSchemeDetail(scheme) {
    var t = T[currentLang] || T.en;
    var html = '<h2 id="scheme-modal-title">' + escapeHtml(scheme.name) + '</h2>';
    html += '<div class="detail-block"><h3>' + escapeHtml(t.modalDesc) + '</h3><p>' + escapeHtml(scheme.description) + '</p></div>';
    html += '<div class="detail-block"><h3>' + escapeHtml(t.modalEligibility) + '</h3><p>' + escapeHtml(scheme.eligibility) + '</p></div>';
    html += '<div class="detail-block"><h3>' + escapeHtml(t.modalBenefits) + '</h3><p>' + escapeHtml(scheme.benefits) + '</p></div>';
    if (scheme.requiredDocuments && scheme.requiredDocuments.length) {
      html += '<div class="detail-block"><h3>' + escapeHtml(t.modalDocuments) + '</h3><ul>';
      scheme.requiredDocuments.forEach(function (doc) {
        html += '<li>' + escapeHtml(doc) + '</li>';
      });
      html += '</ul></div>';
    }
    if (scheme.howToApply && scheme.howToApply.length) {
      html += '<div class="detail-block"><h3>' + escapeHtml(t.modalHowToApply) + '</h3><ol class="detail-steps">';
      scheme.howToApply.forEach(function (step, i) {
        html += '<li data-step="' + (i + 1) + '">' + escapeHtml(step) + '</li>';
      });
      html += '</ol></div>';
    }
    if (scheme.officialLink) {
      html += '<div class="detail-block"><h3>' + escapeHtml(t.modalOfficialLink) + '</h3>';
      html += '<a href="' + escapeHtml(scheme.officialLink) + '" target="_blank" rel="noopener noreferrer" class="detail-link">' + escapeHtml(scheme.officialLink) + '</a></div>';
    }
    schemeDetail.innerHTML = html;
    schemeModal.hidden = false;
  }

  function closeSchemeModal() {
    if (schemeModal) schemeModal.hidden = true;
  }

  function renderResults(schemes) {
    resultsList.innerHTML = '';
    var noResultsText = (T[currentLang] || T.en).noResults;
    if (!schemes.length) {
      resultsList.innerHTML = '<p class="results-empty">' + escapeHtml(noResultsText) + '</p>';
      return;
    }
    schemes.forEach(function (scheme) {
      var card = document.createElement('button');
        window.open('', '_blank');
        openSchemeDetail(scheme); 
     
      card.type = 'button';
      card.className = 'result-card';
      card.innerHTML = '<strong>' + escapeHtml(scheme.name) + '</strong><span>' + escapeHtml(scheme.description) + '</span>';
      card.addEventListener('click', function () { openSchemeDetail(scheme); });
      resultsList.appendChild(card);
    });
  }

  function showResults(query, category) {
    if (!searchSection || !categoriesSection) return;
    searchSection.style.opacity = '0';
    searchSection.style.transform = 'translateY(-10px)';
    searchSection.style.pointerEvents = 'none';
    categoriesSection.style.opacity = '0';
    categoriesSection.style.transform = 'translateY(-10px)';
    categoriesSection.style.pointerEvents = 'none';

    resultsSection.hidden = false;
    resultsSection.style.opacity = '0';
    resultsList.innerHTML = '<div class="loading-dots" aria-busy="true"><span></span><span></span><span></span></div>';
    resultsList.style.textAlign = 'center';
    resultsList.setAttribute('data-last-category', category || '');

    setTimeout(function () {
      var schemes = getSchemes(query, category);
      resultsList.style.textAlign = 'left';
      renderResults(schemes);
      resultsSection.style.opacity = '1';
      resultsSection.style.transform = 'translateY(0)';
    }, 500);
  }

  function showMainView() {
    resultsSection.hidden = true;
    resultsSection.style.opacity = '0';
    if (searchSection) {
      searchSection.style.opacity = '1';
      searchSection.style.transform = 'translateY(0)';
      searchSection.style.pointerEvents = '';
    }
    if (categoriesSection) {
      categoriesSection.style.opacity = '1';
      categoriesSection.style.transform = 'translateY(0)';
      categoriesSection.style.pointerEvents = '';
    }
  }

  window.addEventListener('load', function () {
    if (window.Clerk && typeof window.Clerk.load === 'function') {
      window.Clerk.load({
        appearance: {
          variables: {
            colorPrimary: '#2d6a4f',
            colorBackground: '#ffffff',
            borderRadius: '16px'
          }
        }
      }).then(function () {
        initAuthWithClerk();
      }).catch(function (err) {
        console.warn('Clerk.load failed:', err);
        showScreen('auth');
        if (clerkAuthContainer) {
          clerkAuthContainer.innerHTML =
          '<p class="auth-clerk-message">Sign-in could not load. Check your Clerk key in index.html, or <a href="https://dashboard.clerk.com" target="_blank" rel="noopener">get your key</a>.</p>' +
          '<button type="button" class="btn btn-primary btn-large btn-demo" id="btn-demo-fallback">Continue without sign-in (demo)</button>';
        var btnDemoFallback = document.getElementById('btn-demo-fallback');
        if (btnDemoFallback) {
          btnDemoFallback.addEventListener('click', function () {
            showScreen('main');
            loadProfileIntoForm();
            loadSchemesAndInitMain();
          });
        }
        }
      });
    } else {
      initAuthWithClerk();
    }
  });
})();
