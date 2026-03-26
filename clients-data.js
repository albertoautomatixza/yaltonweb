const clients = [
  { name: "Bosch", employees: 900, vistas: 3, logo: "/bosch.png" },
  { name: "Eaton", employees: 550, vistas: 3, logo: "/eaton.png" },
  { name: "Sanoh", employees: 900, vistas: 2, logo: "/sanoh.png" },
  { name: "La Huerta", employees: 400, vistas: 2, logo: "/huerta.png" },
  { name: "Gestamp", employees: 600, vistas: 1, logo: "/gestamp.png" },
  { name: "Marelli", employees: 5200, vistas: 3, logo: "/marelli.png" },
  { name: "Mahle", employees: 450, vistas: 2, logo: "/mahle.png" },
  { name: "Hexpol", employees: 900, vistas: 1, logo: "/hexpol.png" },
  { name: "Minth Group", employees: 2900, vistas: 3, logo: "/minth.png" },
  { name: "Vianney", employees: 1500, vistas: 2, logo: "/vianney.png" },
  { name: "Cantia", employees: 200, vistas: 1, logo: "/Asset_43.png" },
  { name: "Frio Express", employees: 500, vistas: 1, logo: "/Asset_42.png" },
  { name: "KT Mex", employees: 450, vistas: 1, logo: "/kt.png" },
  { name: "Mabuchi Motor", employees: 300, vistas: 1, logo: "/mabuchi.png" },
  { name: "Kitagawa", employees: 550, vistas: 1, logo: "/kitagawa.png" },
  { name: "Sumitomo Electric", employees: 400, vistas: 1, logo: "/Asset_38.png" },
  { name: "Advics", employees: 700, vistas: 1, logo: "/sumitomo.png" },
  { name: "Llantas D'Lago", employees: 300, vistas: 1, logo: "/de_lago.png" },
  { name: "Gas Noel", employees: 600, vistas: 2, logo: "/noel.png" },
  { name: "Stanley", employees: 600, vistas: 1, logo: "/stanley.png" },
  { name: "Sakaiya de Mexico", employees: 650, vistas: 1, logo: "/sakaiya.png" },
  { name: "TEC Engineering", employees: 100, vistas: 1, logo: "/tec.png" },
  { name: "Linea Italia", employees: 150, vistas: 1, logo: "/italia.png" },
  { name: "Swissmex", employees: 700, vistas: 1, logo: "/swissmex.png" },
  { name: "TST Nikkei", employees: 25, vistas: 1, logo: "/nikkei.png" },
  { name: "TF-Metal", employees: 400, vistas: 1, logo: "/tf_metal.png" },
  { name: "Cremeria Aguascalientes", employees: 160, vistas: 1, logo: "/cremeria.png" },
  { name: "Gonzalez Trucking", employees: 200, vistas: 1, logo: "/gonzalez.png" },
  { name: "Traca", employees: 130, vistas: 1, logo: "/traca.png" },
  { name: "Perla Transportes", employees: 140, vistas: 1, logo: "/perla.png" },
  { name: "Vantec", employees: 175, vistas: 1, logo: "/vantec.png" },
  { name: "Orotex", employees: 250, vistas: 1, logo: "/orotex.png" },
  { name: "Protoss Metales", employees: 80, vistas: 1, logo: "/protoss.png" },
  { name: "Parker-Trutec Mexicana", employees: 100, vistas: 1, logo: "/parker.png" },
  { name: "Fumigaciones San Marcos", employees: 50, vistas: 1, logo: "/san_marcos.png" },
  { name: "GTR Internacional", employees: 200, vistas: 1, logo: "/gtr.png" },
];

function buildExpandedList() {
  const expanded = [];
  clients.forEach(c => {
    for (let i = 0; i < c.vistas; i++) {
      expanded.push(c);
    }
  });

  for (let i = expanded.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [expanded[i], expanded[j]] = [expanded[j], expanded[i]];
  }

  for (let attempts = 0; attempts < 200; attempts++) {
    let fixed = true;
    for (let i = 1; i < expanded.length; i++) {
      if (expanded[i].name === expanded[i - 1].name) {
        fixed = false;
        let swapIdx = -1;
        for (let j = i + 1; j < expanded.length; j++) {
          if (expanded[j].name !== expanded[i].name &&
              (j + 1 >= expanded.length || expanded[j].name !== expanded[i - 1].name) &&
              (i - 2 < 0 || expanded[j].name !== expanded[i - 2].name)) {
            swapIdx = j;
            break;
          }
        }
        if (swapIdx === -1) {
          for (let j = 0; j < i - 1; j++) {
            if (expanded[j].name !== expanded[i].name &&
                (j > 0 && expanded[j - 1].name !== expanded[i].name || j === 0) &&
                (j < expanded.length - 1 && expanded[j + 1].name !== expanded[i].name || j === expanded.length - 1)) {
              swapIdx = j;
              break;
            }
          }
        }
        if (swapIdx !== -1) {
          [expanded[i], expanded[swapIdx]] = [expanded[swapIdx], expanded[i]];
        }
      }
    }
    if (fixed) break;
  }

  return expanded;
}

function createCard(c) {
  const stars = '<span>&#9733;</span>'.repeat(5);
  const invertClass = c.invertLogo ? ' client-card-logo-img--invert' : '';
  const logoHtml = c.logo
    ? `<img class="client-card-logo-img${invertClass}" src="${c.logo}" alt="${c.name}">`
    : `<div class="client-card-logo-placeholder">${c.name.charAt(0)}</div>`;
  return `
    <div class="client-card">
      <div class="client-card-logo-area">
        ${logoHtml}
      </div>
      <div class="client-card-body">
        <div class="client-card-name">${c.name}</div>
        <div class="client-card-satisfied">
          <svg class="client-card-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Empleados satisfechos</span>
        </div>
        <div class="client-card-count">
          <span class="client-card-count-number">${c.employees.toLocaleString()}</span>
          <span class="client-card-count-label">empleados</span>
        </div>
        <div class="client-card-stars">${stars}</div>
      </div>
    </div>
  `;
}

export function initClientsCarousel() {
  const track = document.getElementById('clientsTrack');
  if (!track) return;

  const expanded = buildExpandedList();
  track.innerHTML = expanded.map(createCard).join('');

  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
}
