let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["varinha"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'varinha', power: 5 },
  { name: 'punhal', power: 30 },
  { name: 'martelo', power: 50 },
  { name: 'espada', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fera de garras",
    level: 8,
    health: 60
  },
  {
    name: "dragão",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "praça da cidade",
    "button text": ["Vá para loja", "Vá para a caverna", "Lutar com o dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você está na praça da cidade. Você vê uma placa escrito \"Loja\"."
  },
  {
    name: "loja",
    "button text": ["Comprar 10 de vida(10 ouros)", "Comprar arma (30 ouros)", "Vá para praça da cidade"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entrou na loja."
  },
  {
    name: "caverna",
    "button text": ["Lutar com slime", "Lutar com fera de garras", "Vá para praça da cidade"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entrou na caverna. Você vê alguns monstros."
  },
  {
    name: "lutar",
    "button text": ["Ataque", "Desviar", "Correr"],
    "button functions": [attack, dodge, goTown],
    text: "Você esta lutando com um monstro."
  },
  {
    name: "matar monstro",
    "button text": ["Vá para praça da cidade", "Vá para praça da cidade", "Vá para praça da cidade"],
    "button functions": [goTown, goTown, goTown],
    text: 'O monstro grita "Arg!" ao morrer. Você ganha alguns pontos de experiência, e um pouco de ouro.'
  },
  {
    name: "lose",
    "button text": ["RECOMEÇAR?", "RECOMEÇAR?", "RECOMEÇAR?"],
    "button functions": [restart, restart, restart],
    text: "VOCÊ MORREU. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["RECOMEÇAR?", "RECOMEÇAR?", "RECOMEÇAR?"], 
    "button functions": [restart, restart, restart], 
    text: "Você derrotou o dragão, VOCÊ VENCEU O JOGO! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Você encontrou o jogo secreto. Escolha um número acima. Dez números serão sorteados entre 0 e 10. Se o número que você escolheu for um dos sorteados, VOCÊ VENCE!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem ouro o suficiente para comprar vida.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = `Agora você tem uma ${newWeapon}.`
      inventory.push(newWeapon);
      text.innerText += `Em seu inventário: ${inventory}`;
    } else {
      text.innerText = "Você não tem ouro o suficiente para comprar.";
    }
  } else {
    text.innerText = "Você já possui a arma mais poderosa!";
    button2.innerText = "Vender arma por 15 de ouro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = `Você vendeu ${currentWeapon}.`
    text.innerText += ` Em seu inventário possui ${inventory}`
  } else {
    text.innerText = "Não venda sua única arma!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = `O ${monsters[fighting].name} ataca`;
  text.innerText += ` Você ataca com sua ${weapons[currentWeapon].name}.`
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += ` Sua ${inventory.pop()} quebrou`
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = `Você desviou o ataque do ${monsters[fighting].name}`
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["varinha"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11))
  }
  text.innerText = `Você pegou ${guess}. Aqui está seus números:\n`
  for(i = 0; i < 10; i++) {
    text.innerText = `${numbers[i]}\n`
  }
  if (numbers.includes(guess)) {
    text.innerText += "Certo! Você ganhou 20 ouros";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText = "Errado! Você perdeu 10 de vida";
    health -= 10;
    healthText.innerText = health;
    if(health <= 0) {
      lose()
    }
  }
}