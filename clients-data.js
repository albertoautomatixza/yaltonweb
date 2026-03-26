const clients = [
  { name: "Bosch", employees: 900, vistas: 3, logo: "https://logo.clearbit.com/bosch.com" },
  { name: "Eaton", employees: 550, vistas: 3, logo: "https://logo.clearbit.com/eaton.com" },
  { name: "Sanoh", employees: 900, vistas: 2, logo: "https://logo.clearbit.com/sanoh.co.jp" },
  { name: "La Huerta", employees: 400, vistas: 2, logo: "https://logo.clearbit.com/lahuerta.com.mx" },
  { name: "Gestamp", employees: 600, vistas: 1, logo: "https://logo.clearbit.com/gestamp.com" },
  { name: "Marelli", employees: 5200, vistas: 3, logo: "https://logo.clearbit.com/marelli.com" },
  { name: "Mahle", employees: 450, vistas: 2, logo: "https://logo.clearbit.com/mahle.com" },
  { name: "Hexpol", employees: 900, vistas: 1, logo: "https://logo.clearbit.com/hexpol.com" },
  { name: "Minth Group", employees: 2900, vistas: 3, logo: "https://logo.clearbit.com/minthgroup.com" },
  { name: "Vianney", employees: 1500, vistas: 2, logo: "https://logo.clearbit.com/vianney.com.mx" },
  { name: "Cantia", employees: 200, vistas: 1, logo: "https://logo.clearbit.com/cantia.com.mx" },
  { name: "Frio Express", employees: 500, vistas: 1, logo: "https://logo.clearbit.com/frioexpress.com.mx" },
  { name: "KT Mex", employees: 450, vistas: 1, logo: "https://logo.clearbit.com/kotobukiya-treves.co.jp" },
  { name: "Mabuchi Motor", employees: 300, vistas: 1, logo: "https://logo.clearbit.com/mabuchi-motor.com" },
  { name: "Kitagawa", employees: 550, vistas: 1, logo: "https://logo.clearbit.com/kitagawa.com" },
  { name: "Sumitomo Electric", employees: 400, vistas: 1, logo: "https://logo.clearbit.com/sei.co.jp" },
  { name: "Advics", employees: 700, vistas: 1, logo: "https://logo.clearbit.com/advics.co.jp" },
  { name: "Llantas D'Lago", employees: 300, vistas: 1, logo: "https://logo.clearbit.com/llantasdlago.com" },
  { name: "Gas Noel", employees: 600, vistas: 2, logo: "https://logo.clearbit.com/gasnoel.com" },
  { name: "Stanley", employees: 600, vistas: 1, logo: "https://logo.clearbit.com/stanleyelectricgroup.com" },
  { name: "Sakaiya de Mexico", employees: 650, vistas: 1, logo: "https://logo.clearbit.com/sakaiya.co.jp" },
  { name: "TEC Engineering", employees: 100, vistas: 1, logo: "https://logo.clearbit.com/tec-eng.co.jp" },
  { name: "Linea Italia", employees: 150, vistas: 1, logo: "https://logo.clearbit.com/lineaitalia.com" },
  { name: "Coffee & Go", employees: 80, vistas: 1, logo: "https://logo.clearbit.com/coffeeandgo.com.mx" },
  { name: "Swissmex", employees: 700, vistas: 1, logo: "https://logo.clearbit.com/swissmex.com" },
  { name: "TST Nikkei", employees: 25, vistas: 1, logo: "https://logo.clearbit.com/tstnikkei.com" },
  { name: "TF-Metal", employees: 400, vistas: 1, logo: "https://logo.clearbit.com/tf-metal.co.jp" },
  { name: "Cremeria Aguascalientes", employees: 160, vistas: 1, logo: "https://logo.clearbit.com/cremeriaaguascalientes.com" },
  { name: "Printpack", employees: 200, vistas: 1, logo: "https://logo.clearbit.com/printpack.com" },
  { name: "Gonzalez Trucking", employees: 200, vistas: 1, logo: "https://logo.clearbit.com/gonzaleztrucking.com" },
  { name: "Traca", employees: 130, vistas: 1, logo: "https://logo.clearbit.com/traca.com.mx" },
  { name: "Perla Transportes", employees: 140, vistas: 1, logo: "https://logo.clearbit.com/perlatransportes.com" },
  { name: "Vantec", employees: 175, vistas: 1, logo: "https://logo.clearbit.com/vantec-gl.com" },
  { name: "Orotex", employees: 250, vistas: 1, logo: "https://logo.clearbit.com/orotex.com.mx" },
  { name: "Protoss Metales", employees: 80, vistas: 1, logo: "https://logo.clearbit.com/protoss.com.mx" },
  { name: "Parker-Trutec Mexicana", employees: 100, vistas: 1, logo: "https://logo.clearbit.com/parker.com" },
  { name: "Fumigaciones San Marcos", employees: 50, vistas: 1, logo: "https://logo.clearbit.com/sanmarcos.com.mx" },
  { name: "Materias Primas Monterrey", employees: 220, vistas: 1, logo: "https://logo.clearbit.com/cfrancaise.com" },
  { name: "GTR Internacional", employees: 200, vistas: 1, logo: "https://logo.clearbit.com/gtrinternacional.com" },
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
  return `
    <div class="client-card">
      <div class="client-card-badge client-card-badge--solution">EMPLEADOS SATISFECHOS</div>
      <p class="client-card-employees">No. de empleados aprox: <strong>${c.employees.toLocaleString()}</strong></p>
      <div class="client-card-footer">
        <div class="client-card-logo-placeholder">${c.name.charAt(0)}</div>
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
