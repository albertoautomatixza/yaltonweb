const privacyContent = {
  es: {
    title: 'Aviso de Privacidad',
    intro: 'Yalton Global Marketer S.A. de C.V., con domicilio en República de Paraguay 412, Aguascalientes, México, es responsable del tratamiento de sus datos personales.',
    sections: [
      {
        h: 'Datos que recopilamos',
        p: 'Recopilamos los siguientes datos personales: nombre completo, correo electrónico, número telefónico, empresa, estado y mensaje cuando usted nos contacta a través de nuestro formulario.'
      },
      {
        h: 'Finalidades del tratamiento',
        p: 'Sus datos personales serán utilizados para: responder a sus solicitudes de cotización, brindar información sobre nuestros productos y servicios, dar seguimiento a pedidos y mantener comunicación comercial.'
      },
      {
        h: 'Protección de datos',
        p: 'Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o uso no autorizado.'
      },
      {
        h: 'Derechos ARCO',
        p: 'Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales (Derechos ARCO). Para ejercer estos derechos, puede contactarnos a través de nuestros canales oficiales.'
      },
      {
        h: 'Cambios al aviso de privacidad',
        p: 'Nos reservamos el derecho de efectuar modificaciones o actualizaciones al presente aviso de privacidad. Cualquier cambio será publicado en nuestro sitio web.'
      }
    ],
    updated: 'Última actualización: Marzo 2026'
  },
  en: {
    title: 'Privacy Notice',
    intro: 'Yalton Global Marketer S.A. de C.V., located at República de Paraguay 412, Aguascalientes, Mexico, is responsible for the processing of your personal data.',
    sections: [
      {
        h: 'Data we collect',
        p: 'We collect the following personal data: full name, email address, phone number, company, state and message when you contact us through our form.'
      },
      {
        h: 'Purpose of processing',
        p: 'Your personal data will be used to: respond to your quote requests, provide information about our products and services, track orders and maintain business communication.'
      },
      {
        h: 'Data Protection',
        p: 'We implement administrative, technical and physical security measures to protect your personal data against damage, loss, alteration, destruction or unauthorized use.'
      },
      {
        h: 'ARCO Rights',
        p: 'You have the right to access, rectify, cancel or object to the processing of your personal data (ARCO Rights). To exercise these rights, you can contact us through our official channels.'
      },
      {
        h: 'Changes to privacy notice',
        p: 'We reserve the right to make modifications or updates to this privacy notice. Any changes will be published on our website.'
      }
    ],
    updated: 'Last updated: March 2026'
  }
};

const termsContent = {
  es: {
    title: 'Términos y Condiciones',
    intro: 'Bienvenido al sitio web de Yalton Global Marketer S.A. de C.V. Al acceder y utilizar este sitio, usted acepta los siguientes términos y condiciones.',
    sections: [
      {
        h: '1. Uso del sitio',
        p: 'Este sitio web es para uso informativo y comercial. Todo el contenido, incluyendo textos, imágenes, logotipos y diseños, es propiedad de Yalton Global Marketer S.A. de C.V. y está protegido por las leyes de propiedad intelectual aplicables.'
      },
      {
        h: '2. Cotizaciones',
        p: 'Las cotizaciones solicitadas a través de este sitio son informativas y no constituyen un contrato vinculante. Los precios, disponibilidad y tiempos de entrega están sujetos a confirmación por parte de nuestro equipo comercial.'
      },
      {
        h: '3. Productos y servicios',
        p: 'Nos esforzamos por presentar información precisa sobre nuestros productos y servicios. Sin embargo, nos reservamos el derecho de modificar especificaciones, precios y disponibilidad sin previo aviso.'
      },
      {
        h: '4. Responsabilidad',
        p: 'Yalton Global Marketer S.A. de C.V. no será responsable por daños directos o indirectos derivados del uso de este sitio web o de la imposibilidad de acceder al mismo.'
      },
      {
        h: '5. Propiedad intelectual',
        p: 'Todas las marcas, logotipos, nombres comerciales y diseños mostrados en este sitio son propiedad de Yalton Global Marketer S.A. de C.V. Queda prohibida su reproducción sin autorización previa por escrito.'
      },
      {
        h: '6. Legislación aplicable',
        p: 'Estos términos y condiciones se rigen por las leyes vigentes en los Estados Unidos Mexicanos. Cualquier controversia será sometida a los tribunales competentes de Aguascalientes, México.'
      }
    ],
    updated: 'Última actualización: Marzo 2026'
  },
  en: {
    title: 'Terms and Conditions',
    intro: 'Welcome to the website of Yalton Global Marketer S.A. de C.V. By accessing and using this site, you accept the following terms and conditions.',
    sections: [
      {
        h: '1. Site Usage',
        p: 'This website is for informational and commercial use. All content, including texts, images, logos and designs, is the property of Yalton Global Marketer S.A. de C.V. and is protected by applicable intellectual property laws.'
      },
      {
        h: '2. Quotes',
        p: 'Quotes requested through this site are informational and do not constitute a binding contract. Prices, availability and delivery times are subject to confirmation by our sales team.'
      },
      {
        h: '3. Products and Services',
        p: 'We strive to present accurate information about our products and services. However, we reserve the right to modify specifications, prices and availability without prior notice.'
      },
      {
        h: '4. Liability',
        p: 'Yalton Global Marketer S.A. de C.V. shall not be liable for direct or indirect damages arising from the use of this website or the inability to access it.'
      },
      {
        h: '5. Intellectual Property',
        p: 'All trademarks, logos, trade names and designs shown on this site are the property of Yalton Global Marketer S.A. de C.V. Reproduction is prohibited without prior written authorization.'
      },
      {
        h: '6. Applicable Law',
        p: 'These terms and conditions are governed by the laws in force in the United Mexican States. Any dispute will be submitted to the competent courts of Aguascalientes, Mexico.'
      }
    ],
    updated: 'Last updated: March 2026'
  }
};

export function updateModalContent(lang) {
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');

  if (privacyModal) {
    const content = privacyContent[lang];
    privacyModal.querySelector('h2').textContent = content.title;
    const modalBody = privacyModal.querySelector('.modal-body');
    let html = `<p>${content.intro}</p>`;
    content.sections.forEach(section => {
      html += `<h3>${section.h}</h3><p>${section.p}</p>`;
    });
    html += `<p><strong>${content.updated}</strong></p>`;
    modalBody.innerHTML = html;
  }

  if (termsModal) {
    const content = termsContent[lang];
    termsModal.querySelector('h2').textContent = content.title;
    const modalBody = termsModal.querySelector('.modal-body');
    let html = `<p>${content.intro}</p>`;
    content.sections.forEach(section => {
      html += `<h3>${section.h}</h3><p>${section.p}</p>`;
    });
    html += `<p><strong>${content.updated}</strong></p>`;
    modalBody.innerHTML = html;
  }
}
