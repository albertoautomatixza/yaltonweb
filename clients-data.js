const clients = [
  { name: "Bosch", employees: 900, vistas: 3, logo: "/bosch.png" },
  { name: "Eaton", employees: 550, vistas: 3, logo: null },
  { name: "Sanoh", employees: 900, vistas: 2, logo: "/sanoh.png" },
  { name: "La Huerta", employees: 400, vistas: 2, logo: null },
  { name: "Gestamp", employees: 600, vistas: 1, logo: null },
  { name: "Marelli", employees: 5200, vistas: 3, logo: null },
  { name: "Mahle", employees: 450, vistas: 2, logo: null },
  { name: "Hexpol", employees: 900, vistas: 1, logo: null },
  { name: "Minth Group", employees: 2900, vistas: 3, logo: "/minth.png" },
  { name: "Vianney", employees: 1500, vistas: 2, logo: null },
  { name: "Cantia", employees: 200, vistas: 1, logo: "/Asset_43.png" },
  { name: "Frio Express", employees: 500, vistas: 1, logo: "/Asset_42.png" },
  { name: "KT Mex", employees: 450, vistas: 1, logo: null },
  { name: "Mabuchi Motor", employees: 300, vistas: 1, logo: null },
  { name: "Kitagawa", employees: 550, vistas: 1, logo: null },
  { name: "Sumitomo Electric", employees: 400, vistas: 1, logo: "/Asset_38.png" },
  { name: "Advics", employees: 700, vistas: 1, logo: "/sumitomo.png" },
  { name: "Llantas D'Lago", employees: 300, vistas: 1, logo: null },
  { name: "Gas Noel", employees: 600, vistas: 2, logo: "/noel.png" },
  { name: "Stanley", employees: 600, vistas: 1, logo: "/stanley.png" },
  { name: "Sakaiya de Mexico", employees: 650, vistas: 1, logo: "/sakaiya.png" },
  { name: "TEC Engineering", employees: 100, vistas: 1, logo: "/tec.png" },
  { name: "Linea Italia", employees: 150, vistas: 1, logo: null },
  { name: "Coffee & Go", employees: 80, vistas: 1, logo: null },
  { name: "Swissmex", employees: 700, vistas: 1, logo: "/swissmex.png" },
  { name: "TST Nikkei", employees: 25, vistas: 1, logo: "/nikkei.png" },
  { name: "TF-Metal", employees: 400, vistas: 1, logo: "/tf_metal.png" },
  { name: "Cremeria Aguascalientes", employees: 160, vistas: 1, logo: null },
  { name: "Printpack", employees: 200, vistas: 1, logo: "/printpack.png" },
  { name: "Gonzalez Trucking", employees: 200, vistas: 1, logo: null },
  { name: "Traca", employees: 130, vistas: 1, logo: null },
  { name: "Perla Transportes", employees: 140, vistas: 1, logo: "/perla.png" },
  { name: "Vantec", employees: 175, vistas: 1, logo: null },
  { name: "Orotex", employees: 250, vistas: 1, logo: "/orotex.png" },
  { name: "Protoss Metales", employees: 80, vistas: 1, logo: "/protoss.png" },
  { name: "Parker-Trutec Mexicana", employees: 100, vistas: 1, logo: "/parker.png" },
  { name: "Fumigaciones San Marcos", employees: 50, vistas: 1, logo: "/san_marcos.png" },
  { name: "Materias Primas Monterrey", employees: 220, vistas: 1, logo: null },
  { name: "GTR Internacional", employees: 200, vistas: 1, logo: null },
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
  return expanded;
}

function createCard(c) {
  const stars = '<span>&#9733;</span>'.repeat(5);
  const logoHtml = c.logo
    ? `<img class="client-card-logo-img" src="${c.logo}" alt="${c.name}">`
    : `<div class="client-card-logo-placeholder">${c.name.charAt(0)}</div>`;
  return `
    <div class="client-card">
      <div class="client-card-badge client-card-badge--solution">EMPLEADOS SATISFECHOS</div>
      <p class="client-card-employees">No. de empleados aprox: <strong>${c.employees.toLocaleString()}</strong></p>
      <div class="client-card-footer">
        ${logoHtml}
        <div class="client-card-info">
          <div class="client-card-name">${c.name}</div>
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
