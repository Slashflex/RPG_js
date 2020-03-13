/*********************************************************
 *                      Personne
 ********************************************************/
class Personne {
  constructor(nom, pv) {
    this.nom = nom;
    this.pv = pv;
    this.en_vie = true;
  }

  info() {
    return this.en_vie
      ? `${this.nom} (${this.pv}/100)`
      : `${this.nom} (vaincu)`;
  }

  attaque(ennemi_a_attaquer, bonus) {
    console.log(`${this.nom} s'élance vers ${ennemi_a_attaquer.nom} !`);
    let degats_infliges = this.degats() + bonus;
    ennemi_a_attaquer.subit_attaque(degats_infliges);
  }

  subit_attaque(degats_recus) {
    this.pv -= degats_recus;

    if (this.pv <= 0) {
      console.log(`${this.nom} est vaincu !`);
      this.en_vie = false;
    } else {
      console.log(`${this.nom} subit ${degats_recus} points de dégâts`);
    }
  }
}

/*********************************************************
 *                      JOUEUR
 ********************************************************/
class Joueur extends Personne {
  constructor(nom, pv) {
    super(nom, pv);

    this.degats_bonus = 0;
  }

  degats() {
    return Math.floor(Math.random() * (30 - 2) + 2);
  }

  soin() {
    let soin = 30;
    this.pv += soin;
    if (this.pv > 100) {
      this.pv = 100;
    }

    console.log(
      `${this.nom} se soigne de ${soin}hp, il possède maintenant ${this.pv}/100 hp.`
    );
  }

  ameliorer_degats() {
    this.degats_bonus += 25;
    console.log(
      `${this.nom} augmente ses dégâts de X pts de pour son prochain tour...`
    );
  }
}

/*********************************************************
 *                      ENNEMI
 ********************************************************/
class Ennemi extends Personne {
  degats() {
    if (this.nom === 'Balrog') {
      return 15;
    } else if (this.nom === 'Squelette') {
      return 10;
    } else if (this.nom === 'Goblin') {
      return 5;
    }
  }
}

/*********************************************************
 *                      JEU
 ********************************************************/
class Jeu {
  actions_possibles(monde) {
    console.log('ACTIONS POSSIBLES');
    console.log('------------------');
    console.log('0 - Se soigner');
    console.log('1 - Améliorer son attaque');

    let i = 2;

    monde.ennemis.forEach(ennemi => {
      console.log(`${i} - Attaquer ${ennemi.info()}`);
      i += 1;
    });

    console.log('99 - Quitter');

    console.log('------------------');
    console.log(
      `${joueur.nom} possède ${
        joueur.pv
      }hp, sa prochaine attaque infligera ${joueur.degats() +
        joueur.degats_bonus}pts de dégats.`
    );
    console.log('------------------');
  }

  est_fini(joueur, monde) {
    if (
      joueur.en_vie === false ||
      (monde.ennemis[0].en_vie === false &&
        monde.ennemis[1].en_vie === false &&
        monde.ennemis[2].en_vie === false)
    ) {
      return true;
    }
  }
}

/*********************************************************
 *                      MONDE
 ********************************************************/
class Monde {
  constructor(ennemis) {
    this.ennemis = ennemis;
  }
}

let monde = new Monde();
monde.ennemis = [
  new Ennemi('Balrog', 420),
  new Ennemi('Goblin', 90),
  new Ennemi('Squelette', 185)
];

let joueur = new Joueur('Jean-Michel Paladin', 300);

console.log(`Ainsi débutent les aventures de ${joueur.nom}`);

let nb_tour_total = 0;
let degats_total = 0;
let soin_total = 0;
let tour = 0;
let jeu = new Jeu();

while (tour <= 100) {
  nb_tour_total += 1;

  jeu.actions_possibles(monde);

  let choix = prompt('QUELLE ACTION FAIRE ?');

  if (choix == 0) {
    joueur.soin();
    soin_total += 30;
  } else if (choix == 1) {
    joueur.ameliorer_degats();
  } else if (choix == 99) {
    break;
  } else {
    let ennemi_a_attaquer = monde.ennemis[choix - 2];
    bonus = joueur.degats_bonus;
    joueur.attaque(ennemi_a_attaquer, bonus);
    degats_total += joueur.degats_bonus + joueur.degats;
    joueur.degats_bonus = 0;
  }

  if (!jeu.est_fini(joueur, monde)) {
    console.log('------------------');
    console.log('LES ENNEMIS RIPOSTENT !');
    console.log('------------------');
  }

  monde.ennemis.forEach(ennemi => {
    if (ennemi.en_vie && joueur.en_vie) {
      return ennemi.attaque(joueur, 0);
    }
  });

  if (jeu.est_fini(joueur, monde)) {
    break;
  }
}
