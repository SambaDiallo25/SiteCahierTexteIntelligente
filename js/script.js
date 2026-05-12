/* ============================================================
   SCRIPT.JS — JavaScript principal du site
   Projet : Système de Gestion des Cahiers de Texte Intelligent
   ============================================================ */

/* === 1. ATTENDRE QUE LE DOM SOIT CHARGÉ === */
// DOMContentLoaded s'exécute quand tout le HTML est prêt
document.addEventListener("DOMContentLoaded", function () {
  /* ======================================================
     FONCTIONNALITÉ 1 : MENU BURGER (Navigation mobile)
     Affiche/cache le menu sur mobile quand on clique le burger
  ====================================================== */
  const burger = document.getElementById("burger"); // Bouton burger
  const navLiens = document.getElementById("nav-liens"); // Liste des liens nav

  if (burger && navLiens) {
    burger.addEventListener("click", function () {
      // Basculer la classe 'ouvert' sur les deux éléments
      burger.classList.toggle("ouvert");
      navLiens.classList.toggle("ouvert");

      // Accessibilité : indiquer si le menu est ouvert
      const estOuvert = navLiens.classList.contains("ouvert");
      burger.setAttribute("aria-expanded", estOuvert);
    });

    // Fermer le menu si on clique sur un lien (navigation mobile)
    navLiens.querySelectorAll("a").forEach(function (lien) {
      lien.addEventListener("click", function () {
        burger.classList.remove("ouvert");
        navLiens.classList.remove("ouvert");
      });
    });
  }

  /* ======================================================
     FONCTIONNALITÉ 2 : NAVBAR QUI CHANGE AU DÉFILEMENT
     Ajoute une ombre à la navbar quand on défile vers le bas
  ====================================================== */
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("defilée");
      } else {
        navbar.classList.remove("defilée");
      }
    });
  }

  /* ======================================================
     FONCTIONNALITÉ 3 : LIEN ACTIF DANS LA NAVBAR
     Met en surbrillance le lien correspondant à la page actuelle
  ====================================================== */
  const liensCourants = document.querySelectorAll(".nav-liens a");
  const pageActuelle =
    window.location.pathname.split("/").pop() || "index.html";

  liensCourants.forEach(function (lien) {
    const hrefLien = lien.getAttribute("href");
    if (hrefLien === pageActuelle) {
      lien.classList.add("actif");
    }
  });

  /* ======================================================
     FONCTIONNALITÉ 4 : ANIMATION AU DÉFILEMENT (Scroll Reveal)
     Les sections apparaissent en remontant quand elles deviennent visibles
  ====================================================== */

  // Sélectionner tous les éléments à animer
  const elementsAnimes = document.querySelectorAll(".animer");

  // IntersectionObserver observe quand un élément entre dans la vue
  const observateur = new IntersectionObserver(
    function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          // L'élément est visible → ajouter la classe 'visible'
          entree.target.classList.add("visible");
          // Arrêter d'observer cet élément (animation jouée une seule fois)
          observateur.unobserve(entree.target);
        }
      });
    },
    {
      threshold: 0.1, // Se déclenche quand 10% de l'élément est visible
      rootMargin: "0px 0px -50px 0px", // Légèrement avant le bas de l'écran
    },
  );

  // Observer chaque élément
  elementsAnimes.forEach(function (el) {
    observateur.observe(el);
  });

  /* ======================================================
     FONCTIONNALITÉ 5 : COMPTEUR ANIMÉ
     Les chiffres des statistiques comptent jusqu'à leur valeur cible
  ====================================================== */
  const compteurs = document.querySelectorAll("[data-compteur]");

  if (compteurs.length > 0) {
    const observateurCompteur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            const el = entree.target;
            const cible = parseInt(el.getAttribute("data-compteur"));
            const duree = 2000; // 2 secondes pour compter
            const debut = Date.now();

            // Fonction qui met à jour le compteur à chaque frame
            function updateCompteur() {
              const maintenant = Date.now();
              const progres = Math.min((maintenant - debut) / duree, 1);

              // Fonction easing (accélération/décélération)
              const easing = 1 - Math.pow(1 - progres, 3);
              const valeurActuelle = Math.round(easing * cible);

              el.textContent = valeurActuelle + (el.dataset.suffixe || "");

              if (progres < 1) {
                requestAnimationFrame(updateCompteur); // Continuer l'animation
              }
            }

            requestAnimationFrame(updateCompteur);
            observateurCompteur.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );

    compteurs.forEach(function (el) {
      observateurCompteur.observe(el);
    });
  }

  /* ======================================================
     FONCTIONNALITÉ 6 : FILTRES DES FONCTIONNALITÉS
     Filtre les cartes selon la catégorie sélectionnée
  ====================================================== */
  const boutonsFiltres = document.querySelectorAll(".btn-filtre");
  const cartesFonctionnalites = document.querySelectorAll(
    ".carte-fonctionnalite",
  );

  if (boutonsFiltres.length > 0) {
    boutonsFiltres.forEach(function (btn) {
      btn.addEventListener("click", function () {
        // Retirer la classe 'actif' de tous les boutons
        boutonsFiltres.forEach((b) => b.classList.remove("actif"));
        // Ajouter 'actif' au bouton cliqué
        this.classList.add("actif");

        const categorie = this.getAttribute("data-filtre");

        // Afficher/cacher les cartes selon la catégorie
        cartesFonctionnalites.forEach(function (carte) {
          if (
            categorie === "tout" ||
            carte.getAttribute("data-categorie") === categorie
          ) {
            // Afficher la carte avec animation
            carte.style.display = "";
            setTimeout(function () {
              carte.style.opacity = "1";
              carte.style.transform = "";
            }, 50);
          } else {
            // Cacher la carte
            carte.style.opacity = "0";
            carte.style.transform = "scale(0.95)";
            setTimeout(function () {
              carte.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  /* ======================================================
     FONCTIONNALITÉ 7 : ONGLETS INTERACTIFS (Page fonctionnalités)
     Change le contenu affiché selon l'onglet cliqué
  ====================================================== */
  const boutonsOnglets = document.querySelectorAll(".onglet-btn");
  const contenuOnglets = document.querySelectorAll(".contenu-onglet");

  if (boutonsOnglets.length > 0) {
    boutonsOnglets.forEach(function (btn) {
      btn.addEventListener("click", function () {
        // Désactiver tous les onglets et contenus
        boutonsOnglets.forEach((b) => b.classList.remove("actif"));
        contenuOnglets.forEach((c) => c.classList.remove("actif"));

        // Activer l'onglet cliqué
        this.classList.add("actif");
        const idCible = this.getAttribute("data-onglet");
        const contenu = document.getElementById(idCible);
        if (contenu) contenu.classList.add("actif");
      });
    });
  }

  /* ======================================================
     FONCTIONNALITÉ 8 : VALIDATION DU FORMULAIRE DE CONTACT
     Vérifie les champs avant d'envoyer le formulaire
  ====================================================== */
  const formulaire = document.getElementById("formulaire-contact");

  if (formulaire) {
    formulaire.addEventListener("submit", function (e) {
      e.preventDefault(); // Empêche le rechargement de la page

      // Récupérer les champs
      const nom = document.getElementById("nom");
      const email = document.getElementById("email");
      const sujet = document.getElementById("sujet");
      const message = document.getElementById("message");

      let estValide = true; // Sera mis à false si une erreur existe

      // --- Valider le nom ---
      if (!nom.value.trim() || nom.value.trim().length < 2) {
        afficherErreur(
          nom,
          "erreur-nom",
          "Veuillez entrer votre nom (au moins 2 caractères)",
        );
        estValide = false;
      } else {
        masquerErreur(nom, "erreur-nom");
      }

      // --- Valider l'email ---
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format email basique
      if (!email.value.trim() || !regexEmail.test(email.value)) {
        afficherErreur(
          email,
          "erreur-email",
          "Veuillez entrer une adresse email valide",
        );
        estValide = false;
      } else {
        masquerErreur(email, "erreur-email");
      }

      // --- Valider le sujet ---
      if (!sujet.value.trim()) {
        afficherErreur(sujet, "erreur-sujet", "Veuillez indiquer un sujet");
        estValide = false;
      } else {
        masquerErreur(sujet, "erreur-sujet");
      }

      // --- Valider le message ---
      if (!message.value.trim() || message.value.trim().length < 10) {
        afficherErreur(
          message,
          "erreur-message",
          "Votre message doit contenir au moins 10 caractères",
        );
        estValide = false;
      } else {
        masquerErreur(message, "erreur-message");
      }

      // Si tout est valide, simuler l'envoi
      if (estValide) {
        simulerEnvoi();
      }
    });

    // Retirer l'erreur quand l'utilisateur commence à taper
    formulaire.querySelectorAll(".champ-input").forEach(function (champ) {
      champ.addEventListener("input", function () {
        this.classList.remove("erreur");
      });
    });
  }

  /* ======================================================
     FONCTIONS UTILITAIRES pour le formulaire
  ====================================================== */

  // Afficher un message d'erreur sous un champ
  function afficherErreur(champ, idErreur, message) {
    champ.classList.add("erreur");
    const msgErreur = document.getElementById(idErreur);
    if (msgErreur) {
      msgErreur.textContent = message;
      msgErreur.classList.add("visible");
    }
  }

  // Masquer un message d'erreur
  function masquerErreur(champ, idErreur) {
    champ.classList.remove("erreur");
    const msgErreur = document.getElementById(idErreur);
    if (msgErreur) {
      msgErreur.classList.remove("visible");
    }
  }

  // Simuler l'envoi du formulaire (sans backend)
  function simulerEnvoi() {
    const btnSoumettre = document.getElementById("btn-soumettre");
    const messageSucces = document.getElementById("message-succes");

    // Changer le bouton pendant "l'envoi"
    if (btnSoumettre) {
      btnSoumettre.disabled = true;
      btnSoumettre.textContent = "⏳ Envoi en cours...";
    }

    // Simuler un délai de 1.5 seconde (comme un vrai envoi serveur)
    setTimeout(function () {
      // Afficher le message de succès
      if (messageSucces) {
        messageSucces.classList.add("visible");
        messageSucces.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // Réinitialiser le formulaire
      document.getElementById("formulaire-contact").reset();

      if (btnSoumettre) {
        btnSoumettre.disabled = false;
        btnSoumettre.textContent = "✉️ Envoyer le message";
      }

      // Cacher le message de succès après 5 secondes
      setTimeout(function () {
        if (messageSucces) {
          messageSucces.classList.remove("visible");
        }
      }, 5000);
    }, 1500);
  }
}); // Fin DOMContentLoaded
