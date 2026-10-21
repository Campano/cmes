# Guia per a editors del web del CMES

## Entrar

1. Ves a `https://<web>/admin/`, escriu el teu correu i prem **Send me a code**.
2. Copia el codi que t'arriba per correu i prem **Sign in**.
   Si no t'arriba, demana al responsable del web que afegeixi el teu correu.
   El gestor s'obre directament. Si mai hi veus el botó **Inicia la sessió amb GitHub**, torna a carregar la pàgina;
   si continua sortint, avisa el responsable del web.
3. Si el gestor no surt en català, obre el menú del compte (a dalt a la dreta) →
   **Configuració** → **Llengua** i tria **Català**.

## Crear o editar una notícia

1. A **Notícies**, prem **Nou** (o obre'n una d'existent).
2. Omple el **Títol**, la **Data** (botó **Ara**) i les **Categories**.
   La primera categoria que marquis forma part de l'adreça: `/senderisme/titol-de-la-noticia/`.
3. **Resum**: una o dues frases (surt a Google i a les xarxes).
4. **Text**: escriu la notícia. Per mostrar només el començament a les llistes,
   posa una línia `<!-- truncate -->` (botó **Edita en Markdown**) després del primer paràgraf.
   Per canviar de línia prem **Retorn** (paràgraf nou): **Maj+Retorn** no es veu al web.
5. Prem **Desa**: el canvi es publica al web en 1–2 minuts.

## Imatges

- **Imatge destacada**: **Explora** → **Puja** → tria la foto → **Insereix** (o arrossega-la al requadre).
- Dins el text: botó **Imatge** de la barra d'eines.
- Fotos de menys de 1–2 MB, en horitzontal si pot ser.

## Agenda, pàgines i configuració

- **Agenda**: afegeix activitats (títol, data, lloc...). Les passades s'amaguen soles.
- **Pàgines**: textos fixos (El club, Local social...). A les pàgines amb
  `<Site field="..." />` no esborris aquestes etiquetes: mostren dades de **Configuració**.
- **Configuració**: correu, adreça, IBAN, enllaç del formulari de contacte, xarxes.

## Publicar i desfer

- Cada **Desa** publica directament: revisa el text abans de desar.
- Per desfer un canvi, demana-ho al responsable del web (pot tornar a la versió anterior).
- En un ordinador compartit, en acabar prem **Tanca la sessió** (menú del compte, a dalt a la dreta):
  la propera vegada et tornarà a demanar el correu i el codi.
