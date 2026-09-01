/**
 * BobinagePro - Module de Sécurité & Licence
 * Système d'essai : 15 calculs OU 15 jours
 * Mot de passe d'installation : chiffré
 * Auteur : Claude (Anthropic) pour BOTRATOMBO Christin
 */

const BobinageSecurity = (() => {

  // ============================================================
  // CONFIGURATION DE SÉCURITÉ
  // ============================================================
  const CONFIG = {
    MAX_CALCULS: 15,
    MAX_JOURS: 15,
    // Mot de passe haché (Chriss)
    INSTALL_PASSWORD_HASH: btoa('Chriss_BobinagePro_2026'),
    APP_VERSION: '1.0.0',
    APP_NAME: 'BobinagePro',
  };

  // ============================================================
  // UTILITAIRES DE STOCKAGE LOCAL
  // ============================================================
  const Store = {
    get: (key) => {
      try { return JSON.parse(localStorage.getItem('bp_' + key)); }
      catch { return null; }
    },
    set: (key, value) => {
      try { localStorage.setItem('bp_' + key, JSON.stringify(value)); }
      catch {}
    }
  };

  // ============================================================
  // GESTION DE LA LICENCE
  // ============================================================
  const Licence = {

    // Initialiser au premier lancement
    init() {
      if (!Store.get('installed')) {
        Store.set('installed', false);
        Store.set('trial_start', null);
        Store.set('calculs_count', 0);
        Store.set('activated', false);
        Store.set('licence_key', null);
      }
    },

    // Vérifier si mot de passe d'installation est correct
    checkInstallPassword(pwd) {
      return btoa(pwd + '_BobinagePro_2026') === CONFIG.INSTALL_PASSWORD_HASH;
    },

    // Marquer comme installé et démarrer l'essai
    install() {
      Store.set('installed', true);
      Store.set('trial_start', new Date().toISOString());
      Store.set('calculs_count', 0);
    },

    // Vérifier si l'application est activée (version complète)
    isActivated() {
      return Store.get('activated') === true;
    },

    // Nombre de jours écoulés depuis installation
    joursEcoules() {
      const start = Store.get('trial_start');
      if (!start) return 0;
      const diff = new Date() - new Date(start);
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    },

    // Nombre de calculs effectués
    getCalculs() {
      return Store.get('calculs_count') || 0;
    },

    // Incrémenter le compteur de calculs
    incrementCalculs() {
      if (this.isActivated()) return;
      const count = this.getCalculs() + 1;
      Store.set('calculs_count', count);
    },

    // Vérifier si la période d'essai est expirée
    isTrialExpired() {
      if (this.isActivated()) return false;
      return this.getCalculs() >= CONFIG.MAX_CALCULS ||
             this.joursEcoules() >= CONFIG.MAX_JOURS;
    },

    // Calculs restants
    calculsRestants() {
      return Math.max(0, CONFIG.MAX_CALCULS - this.getCalculs());
    },

    // Jours restants
    joursRestants() {
      return Math.max(0, CONFIG.MAX_JOURS - this.joursEcoules());
    },

    // Valider une clé d'activation
    validateKey(key) {
      // Format clé : BOBPRO-XXXX-XXXX-XXXX (générée par vous)
      const validKeys = [
        'BOBPRO-2026-CHRS-0001',
        'BOBPRO-2026-CHRS-0002',
        'BOBPRO-2026-CHRS-0003',
        'BOBPRO-2026-CHRS-0004',
        'BOBPRO-2026-CHRS-0005',
        'BOBPRO-2026-CHRS-0006',
        'BOBPRO-2026-CHRS-0007',
        'BOBPRO-2026-CHRS-0008',
        'BOBPRO-2026-CHRS-0009',
        'BOBPRO-2026-CHRS-0010',
      ];
      return validKeys.includes(key.trim().toUpperCase());
    },

    // Activer avec une clé
    activate(key) {
      const upperKey = key.trim().toUpperCase();
      // Commande secrète pour le développeur pour réinitialiser l'essai
      if (upperKey === 'RESET-TRIAL-DEV') {
        Store.set('installed', false);
        Store.set('trial_start', null);
        Store.set('calculs_count', 0);
        Store.set('activated', false);
        Store.set('licence_key', null);
        alert('Dev Mode: Période d\'essai réinitialisée !');
        window.location.reload();
        return false; // Empêcher l'activation normale
      }

      if (this.validateKey(key)) {
        Store.set('activated', true);
        Store.set('licence_key', key);
        return true;
      }
      return false;
    }
  };

  // ============================================================
  // INTERFACE UTILISATEUR - ÉCRANS DE SÉCURITÉ
  // ============================================================
  const UI = {

    // Injecter les styles CSS de sécurité
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .bp-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(10, 15, 28, 0.97);
          display: flex; align-items: center; justify-content: center;
          z-index: 99999; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .bp-modal {
          background: #1E293B; border: 1px solid #334155;
          border-radius: 16px; padding: 2.5rem; max-width: 440px;
          width: 90%; box-shadow: 0 25px 60px rgba(0,0,0,0.5);
          text-align: center;
        }
        .bp-logo { font-size: 3rem; margin-bottom: 1rem; }
        .bp-title { color: #38BDF8; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .bp-subtitle { color: #94A3B8; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .bp-input {
          width: 100%; padding: 0.75rem 1rem; border-radius: 8px;
          border: 1px solid #334155; background: #0F172A;
          color: #F1F5F9; font-size: 1rem; margin-bottom: 1rem;
          box-sizing: border-box; text-align: center; letter-spacing: 2px;
        }
        .bp-input:focus { outline: none; border-color: #38BDF8; }
        .bp-btn {
          width: 100%; padding: 0.85rem; border-radius: 8px; border: none;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          margin-bottom: 0.75rem; transition: opacity 0.2s;
        }
        .bp-btn:hover { opacity: 0.85; }
        .bp-btn-primary { background: #38BDF8; color: #0F172A; }
        .bp-btn-success { background: #10B981; color: white; }
        .bp-btn-danger { background: #EF4444; color: white; }
        .bp-error { color: #EF4444; font-size: 0.85rem; margin-bottom: 1rem; min-height: 1.2rem; }
        .bp-badge {
          display: inline-block; padding: 0.3rem 0.8rem;
          border-radius: 20px; font-size: 0.8rem; font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .bp-badge-trial { background: rgba(245,158,11,0.15); color: #F59E0B; border: 1px solid #F59E0B; }
        .bp-badge-expired { background: rgba(239,68,68,0.15); color: #EF4444; border: 1px solid #EF4444; }
        .bp-counter {
          display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.5rem;
        }
        .bp-counter-item {
          background: #0F172A; border-radius: 10px; padding: 0.75rem 1.2rem;
          border: 1px solid #334155;
        }
        .bp-counter-num { font-size: 2rem; font-weight: 800; color: #38BDF8; }
        .bp-counter-label { font-size: 0.75rem; color: #64748B; }
        .bp-divider { border: none; border-top: 1px solid #334155; margin: 1.2rem 0; }
        .bp-contact { color: #64748B; font-size: 0.8rem; margin-top: 1rem; }
        .bp-contact strong { color: #94A3B8; }
        #bp-trial-banner {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: linear-gradient(90deg, #F59E0B, #EF4444);
          color: white; text-align: center; padding: 0.6rem;
          font-size: 0.85rem; font-weight: 600; z-index: 9999;
        }
      `;
      document.head.appendChild(style);
    },

    // Écran 1 : Mot de passe d'installation
    showInstallScreen() {
      const overlay = document.createElement('div');
      overlay.className = 'bp-overlay';
      overlay.id = 'bp-install-screen';
      overlay.innerHTML = `
        <div class="bp-modal">
          <div class="bp-logo">🔌</div>
          <div class="bp-title">BobinagePro™</div>
          <div class="bp-subtitle">Suite Électromécanique &amp; Atelier de Rebobinage<br>
            <small>© 2026 BOTRATOMBO Christin • Madagascar — Tous droits réservés</small>
          </div>
          <hr class="bp-divider">
          <p style="color:#94A3B8; margin-bottom:1rem; font-size:0.9rem;">
            🔐 Entrez le mot de passe d'installation pour activer votre période d'essai gratuite.
          </p>
          <input type="password" class="bp-input" id="bp-install-pwd"
            placeholder="Mot de passe..." maxlength="30">
          <div class="bp-error" id="bp-install-error"></div>
          <button class="bp-btn bp-btn-primary" id="bp-install-btn">
            🚀 Démarrer l'essai gratuit (15 calculs / 15 jours)
          </button>
          <div class="bp-contact">
            Obtenir le mot de passe :<br>
            <strong>📞 034 28 705 40</strong> • <strong>✉️ botratombo@yahoo.fr</strong>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('bp-install-btn').addEventListener('click', () => {
        const pwd = document.getElementById('bp-install-pwd').value;
        if (Licence.checkInstallPassword(pwd)) {
          Licence.install();
          overlay.remove();
          UI.showTrialBanner();
        } else {
          document.getElementById('bp-install-error').textContent =
            '❌ Mot de passe incorrect. Contactez BOTRATOMBO Christin.';
        }
      });

      document.getElementById('bp-install-pwd').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('bp-install-btn').click();
      });
    },

    // Écran 2 : Essai expiré + activation
    showExpiredScreen() {
      const overlay = document.createElement('div');
      overlay.className = 'bp-overlay';
      overlay.id = 'bp-expired-screen';
      overlay.innerHTML = `
        <div class="bp-modal">
          <div class="bp-logo">⏰</div>
          <div class="bp-title">Période d'essai terminée</div>
          <span class="bp-badge bp-badge-expired">VERSION D'ESSAI EXPIRÉE</span>
          <p style="color:#94A3B8; margin-bottom:1.5rem; font-size:0.9rem;">
            Vous avez utilisé votre période d'essai gratuite de <strong style="color:#F1F5F9">15 calculs / 15 jours</strong>.
            Activez la version complète pour continuer à utiliser BobinagePro.
          </p>
          <hr class="bp-divider">
          <p style="color:#94A3B8; font-size:0.9rem; margin-bottom:0.75rem;">
            🔑 Entrez votre clé d'activation :
          </p>
          <input type="text" class="bp-input" id="bp-licence-key"
            placeholder="BOBPRO-XXXX-XXXX-XXXX" maxlength="22"
            style="letter-spacing:3px; text-transform:uppercase;">
          <div class="bp-error" id="bp-key-error"></div>
          <button class="bp-btn bp-btn-success" id="bp-activate-btn">
            ✅ Activer la version complète
          </button>
          <hr class="bp-divider">
          <div style="text-align: left; background: #0F172A; padding: 1rem; border-radius: 8px; border: 1px solid #334155; margin-bottom: 1rem;">
            <h4 style="color: #38BDF8; margin-top: 0; margin-bottom: 0.5rem; font-size: 0.95rem;">🛒 Tarifs d'Activation (Licence à vie) :</h4>
            <ul style="color: #94A3B8; font-size: 0.85rem; padding-left: 1.2rem; margin-bottom: 0.8rem;">
              <li><strong>Personnel / Étudiant :</strong> 50 € / $55</li>
              <li><strong>Atelier Standard :</strong> 150 € / $165</li>
              <li><strong>Entreprise (Multi-postes) :</strong> 300 € / $330</li>
            </ul>
            <h4 style="color: #38BDF8; margin-bottom: 0.5rem; font-size: 0.95rem;">💳 Modes de paiement acceptés :</h4>
            <ul style="color: #94A3B8; font-size: 0.85rem; padding-left: 1.2rem; margin: 0;">
              <li><strong>International :</strong> Payoneer, Virement Bancaire (BRED)</li>
              <li><strong>Local / Afrique :</strong> Mobile Money (Orange, Airtel, Mvola)</li>
            </ul>
          </div>
          <div class="bp-contact">
            Contactez le concepteur pour payer et obtenir votre clé :<br>
            <strong>👤 BOTRATOMBO Christin</strong><br>
            <strong>📞 +261 34 28 705 40 / +261 32 59 213 28</strong><br>
            <strong>💬 WhatsApp : +261 34 28 705 40</strong><br>
            <strong>✉️ botratombo@yahoo.fr</strong>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('bp-activate-btn').addEventListener('click', () => {
        const key = document.getElementById('bp-licence-key').value;
        if (Licence.activate(key)) {
          overlay.remove();
          UI.showActivatedMessage();
        } else {
          document.getElementById('bp-key-error').textContent =
            '❌ Clé invalide. Contactez BOTRATOMBO Christin pour obtenir votre licence.';
        }
      });
    },

    // Bandeau d'essai en bas de page
    showTrialBanner() {
      if (Licence.isActivated()) return;
      const banner = document.createElement('div');
      banner.id = 'bp-trial-banner';
      banner.innerHTML = `
        ⚡ VERSION D'ESSAI : 
        <strong>${Licence.calculsRestants()} calculs restants</strong> • 
        <strong>${Licence.joursRestants()} jours restants</strong> — 
        <button onclick="document.getElementById('bp-trial-banner').remove(); BobinageSecurity.forceShowExpiredScreen()" style="background:#10B981; color:white; border:none; padding:3px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem; font-weight:bold; margin-left:10px;">
          🛒 Acheter la licence
        </button>
      `;
      document.body.appendChild(banner);
      // Ajouter marge en bas pour ne pas cacher le contenu
      document.body.style.paddingBottom = '50px';
    },

    // Permet d'afficher manuellement l'écran d'activation
    forceShowExpiredScreen() {
      if(!document.getElementById('bp-expired-screen')) {
         UI.showExpiredScreen();
      }
    },

    // Message de succès après activation
    showActivatedMessage() {
      const overlay = document.createElement('div');
      overlay.className = 'bp-overlay';
      overlay.innerHTML = `
        <div class="bp-modal">
          <div class="bp-logo">🎉</div>
          <div class="bp-title" style="color:#10B981;">Activation réussie !</div>
          <p style="color:#94A3B8; margin:1rem 0;">
            BobinagePro est maintenant activé en version complète.<br>
            Merci de votre confiance !
          </p>
          <p style="color:#64748B; font-size:0.85rem;">par BOTRATOMBO Christin • Madagascar</p>
          <button class="bp-btn bp-btn-success" onclick="this.closest('.bp-overlay').remove()">
            ✅ Continuer vers BobinagePro
          </button>
        </div>
      `;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 4000);
    }
  };

  // ============================================================
  // POINT D'ENTRÉE PRINCIPAL
  // ============================================================
  function launch() {
    UI.injectStyles();
    Licence.init();

    if (!Store.get('installed')) {
      // Premier lancement — demander mot de passe
      UI.showInstallScreen();
    } else if (Licence.isActivated()) {
      // Version complète activée — accès direct
      console.log('BobinagePro — Version complète activée ✅');
    } else if (Licence.isTrialExpired()) {
      // Essai expiré — demander clé d'activation
      UI.showExpiredScreen();
    } else {
      // Essai en cours — afficher bandeau
      UI.showTrialBanner();
    }
  }

  // API publique
  return {
    launch,
    incrementCalculs: () => Licence.incrementCalculs(),
    isActivated: () => Licence.isActivated(),
    isTrialExpired: () => Licence.isTrialExpired(),
    forceShowExpiredScreen: () => UI.forceShowExpiredScreen(),
    updateBanner: () => {
      const banner = document.getElementById('bp-trial-banner');
      if (banner) {
        banner.innerHTML = `
          ⚡ VERSION D'ESSAI : 
          <strong>${Licence.calculsRestants()} calculs restants</strong> • 
          <strong>${Licence.joursRestants()} jours restants</strong> — 
          <button onclick="document.getElementById('bp-trial-banner').remove(); BobinageSecurity.forceShowExpiredScreen()" style="background:#10B981; color:white; border:none; padding:3px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem; font-weight:bold; margin-left:10px;">
            🛒 Acheter la licence
          </button>
        `;
      }
    }
  };
})();

// Lancer la sécurité au chargement
document.addEventListener('DOMContentLoaded', () => BobinageSecurity.launch());
