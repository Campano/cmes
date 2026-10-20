# Guia per a editors del web del CMES

## Entrar

1. Ves a `https://<web>/admin/` i prem **Iniciar sessió amb GitHub**.
2. Entra amb el teu compte de GitHub (el primer cop, accepta l'autorització).
   Si no tens accés, demana al responsable del web que t'hi convidi.

## Crear o editar una notícia

1. A **Notícies**, prem **+ Notícia** (o obre'n una d'existent).
2. Omple el **Títol**, la **Data** (botó **Ara**) i les **Categories**.
   La primera categoria forma part de l'adreça: `/senderisme/titol-de-la-noticia/`.
3. **Resum**: una o dues frases (surt a Google i a les xarxes).
4. **Text**: escriu la notícia. Per mostrar només el començament a les llistes,
   posa una línia `<!-- truncate -->` (mode Markdown) després del primer paràgraf.
5. Prem **Guardar**. Res no es publica encara.

## Imatges

- **Imatge destacada**: **Escull una imatge** → **Pujar** → tria la foto.
- Dins el text: botó **+** → **Image**.
- Fotos de menys de 1–2 MB, en horitzontal si pot ser.

## Agenda, pàgines i configuració

- **Agenda**: afegeix activitats (títol, data, lloc...). Les passades s'amaguen soles.
- **Pàgines**: textos fixos (El club, Local social...). A les pàgines amb
  `<Site field="..." />` no esborris aquestes etiquetes: mostren dades de **Configuració**.
- **Configuració**: correu, adreça, IBAN, enllaç del formulari de contacte, xarxes.

## Enviar a revisió

1. Quan hagis acabat, canvia l'**Estat** a **En revisió** (o **Llest**).
2. El responsable del web rep la proposta, la revisa i la publica.
   El web s'actualitza uns minuts després.
3. A **Flux Editorial** veus en quin punt està cada canvi. Pots seguir editant
   mentre no estigui publicat.
