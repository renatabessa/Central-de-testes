// =======================
// 🔌 POKEAPI
// =======================

async function getPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  const data = await res.json()

  return {
    id: data.id,
    name: data.name,
    hp: data.stats[0].base_stat,
    maxHp: data.stats[0].base_stat,
    attack: data.stats[1].base_stat,
    defense: data.stats[2].base_stat,
    speed: data.stats[5].base_stat,
    img: data.sprites.front_default,
    alive: true,
    type: data.types[0].type.name
  }
}

// =======================
// 🎲 RANDOM
// =======================

function getRandomId() {
  return Math.floor(Math.random() * 1010) + 1
}

async function generateTeam() {
  const ids = new Set()
  while (ids.size < 5) {
    ids.add(getRandomId())
  }

  const team = []
  for (let id of ids) {
    const pokemon = await getPokemon(id)
    team.push(pokemon)
  }

  return team
}

// =======================
// 👤 PLAYERS
// =======================

let player1 = {
  name: "Player 1",
  pokedex: [],
  activePokemon: null
}

let player2 = {
  name: "Player 2",
  pokedex: [],
  activePokemon: null
}

// =======================
// 🖥️ UI RENDER
// =======================

function renderPokedex(player, elementId) {
  const container = document.getElementById(elementId)
  container.innerHTML = ""

  player.pokedex.forEach(pokemon => {
    const card = document.createElement("div")
    card.className = "poke-card"

    const img = document.createElement("img")
    img.src = pokemon.img
    img.style.opacity = pokemon.alive ? "1" : "0.3"

    img.onclick = () => {
      if (!pokemon.alive) return
      player.activePokemon = pokemon
      renderActive(player, elementId === "p1-pokedex" ? "p1-active" : "p2-active")
    }

    const name = document.createElement("div")
    name.className = "poke-name"
    name.innerText = pokemon.name

    card.appendChild(img)
    card.appendChild(name)
    container.appendChild(card)
  })
}

function renderActive(player, elementId) {
  const div = document.getElementById(elementId)
  const p = player.activePokemon
  if (!p) {
    div.innerHTML = ""
    return
  }

  div.innerHTML = `
    <h3>${p.name}</h3>
    <img src="${p.img}">
    <div style="background:#555; width:100%; height:10px;">
      <div style="background:red; height:10px; width:${(p.hp/p.maxHp)*100}%"></div>
    </div>
    <div class="poke-stats">
    <p>Tipo: ${p.type}</p>
    <p>HP: ${p.hp} / ${p.maxHp}</p>
    <p>⚔️ Ataque: ${p.attack}</p>
    <p>🛡 Defesa: ${p.defense}</p>
    <p>⚡ Speed: ${p.speed}</p>
    </div>
  `
}

function announceFirstAttacker(first, second) {
  log(`⚡ ${first.activePokemon.name} é mais rápido que ${second.activePokemon.name} e atacará primeiro!`)
}



// =======================
// ⚔️ BATTLE SYSTEM
// =======================

function calculateDamage(attacker, defender) {
  const base = attacker.attack - defender.defense / 2
  const random = Math.random() * 10
  return Math.max(5, Math.floor(base + random))
}

document.getElementById("attackBtn").onclick = () => {
  if (!player1.activePokemon || !player2.activePokemon) {
    alert("Ambos os jogadores precisam escolher um Pokémon!")
    return
  }

  const [first, second] = getFirstAttacker()

  announceFirstAttacker(first, second)

  attack(first, second)
  renderActive(player1, "p1-active")
  renderActive(player2, "p2-active")
  renderPokedex(player1, "p1-pokedex")
  renderPokedex(player2, "p2-pokedex")

  if (second.activePokemon.hp <= 0) return

  attack(second, first)
  renderActive(player1, "p1-active")
  renderActive(player2, "p2-active")
  renderPokedex(player1, "p1-pokedex")
  renderPokedex(player2, "p2-pokedex")
}



// =======================
// 🎮 BUTTONS
// =======================

document.getElementById("p1-random").onclick = async () => {
  player1.pokedex = await generateTeam()
  player1.activePokemon = null
  renderPokedex(player1, "p1-pokedex")
  document.getElementById("p1-active").innerHTML = ""
}

document.getElementById("p2-random").onclick = async () => {
  player2.pokedex = await generateTeam()
  player2.activePokemon = null
  renderPokedex(player2, "p2-pokedex")
  document.getElementById("p2-active").innerHTML = ""
}

function getFirstAttacker() {
  if (player1.activePokemon.speed >= player2.activePokemon.speed) {
    return [player1, player2]
  } else {
    return [player2, player1]
  }
}

function attack(attackerPlayer, defenderPlayer) {
  const atk = attackerPlayer.activePokemon
  const def = defenderPlayer.activePokemon

  if (!atk.alive || !def.alive) return

  const damage = calculateDamage(atk, def)
  def.hp -= damage

  log(`${atk.name} atacou ${def.name} causando ${damage} de dano`)

  if (def.hp <= 0) {
    def.hp = 0
    def.alive = false
    log(`💀 ${def.name} foi derrotado!`)

    transferPokemon(attackerPlayer, defenderPlayer, def)

    renderPokedex(attackerPlayer, attackerPlayer === player1 ? "p1-pokedex" : "p2-pokedex")
    renderPokedex(defenderPlayer, defenderPlayer === player1 ? "p1-pokedex" : "p2-pokedex")
    renderActive(defenderPlayer, defenderPlayer === player1 ? "p1-active" : "p2-active")
  }
}


document.getElementById("attackBtn").onclick = () => {
  if (!player1.activePokemon || !player2.activePokemon) {
    alert("Ambos os jogadores precisam escolher um Pokémon!")
    return
  }

  if (!player1.activePokemon.alive || !player2.activePokemon.alive) {
    alert("Um Pokémon foi derrotado! Escolha outro.")
    return
  }

  const [first, second] = getFirstAttacker()


  announceFirstAttacker(first, second)

  attack(first, second)
  renderActive(player1, "p1-active")
  renderActive(player2, "p2-active")
  renderPokedex(player1, "p1-pokedex")
  renderPokedex(player2, "p2-pokedex")

  if (second.activePokemon.hp <= 0) return

  attack(second, first)
  renderActive(player1, "p1-active")
  renderActive(player2, "p2-active")
  renderPokedex(player1, "p1-pokedex")
  renderPokedex(player2, "p2-pokedex")
}


function log(message) {
  const div = document.getElementById("battle-log")
  div.innerHTML += message + "<br>"
  div.scrollTop = div.scrollHeight
}

document.getElementById("p1-random").onclick = async () => {
  player1.pokedex = await generateTeam()
  player1.activePokemon = null
  renderPokedex(player1, "p1-pokedex")
  document.getElementById("p1-active").innerHTML = ""
  document.getElementById("battle-log").innerHTML = ""
}

document.getElementById("p2-random").onclick = async () => {
  player2.pokedex = await generateTeam()
  player2.activePokemon = null
  renderPokedex(player2, "p2-pokedex")
  document.getElementById("p2-active").innerHTML = ""
  document.getElementById("battle-log").innerHTML = ""
}

document.getElementById("resetBtn").onclick = () => {
  resetGame()
}

function resetGame() {
  player1.pokedex = []
  player1.activePokemon = null

  player2.pokedex = []
  player2.activePokemon = null

  document.getElementById("p1-pokedex").innerHTML = ""
  document.getElementById("p2-pokedex").innerHTML = ""
  document.getElementById("p1-active").innerHTML = ""
  document.getElementById("p2-active").innerHTML = ""
  document.getElementById("battle-log").innerHTML = ""

  log("🔄 Jogo reiniciado. Sorteie novos Pokémons!")
}

// =======================
//Transferência de Pokémon
// =======================

function transferPokemon(winner, loser, defeatedPokemon) {
  // Remove do perdedor
  loser.pokedex = loser.pokedex.filter(p => p !== defeatedPokemon)

  // Resetar o Pokémon
  defeatedPokemon.hp = defeatedPokemon.maxHp
  defeatedPokemon.alive = true

  // Adiciona ao vencedor (se não passou de 10)
  if (winner.pokedex.length < 10) {
    winner.pokedex.push(defeatedPokemon)
    log(`🎯 ${winner.name} capturou ${defeatedPokemon.name}!`)
  } else {
    log(`🎯 ${winner.name} derrotou ${defeatedPokemon.name}, mas sua Pokédex está cheia!`)
  }

  // Limpa o Pokémon ativo do perdedor
  loser.activePokemon = null
}
