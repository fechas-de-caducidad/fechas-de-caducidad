/* Service worker for Fechas de Caducidad (iPhone web app).
   Shows a visible notification for every push (WebKit requires this;
   silent push is not supported). Tapping the notification opens the app. */
var APP_URL = 'https://fechas-de-caducidad.github.io/fechas-de-caducidad/';

self.addEventListener('push', function (event) {
  var title = 'Fechas de Caducidad';
  var body = 'Tienes productos vencidos o por vencer. Abre la app para verlos.';
  var data = null;
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    data = null;
  }
  if (data) {
    if (data.title) title = data.title;
    if (data.body) body = data.body;
  }
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'fechas-vence',
      data: { url: APP_URL }
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || APP_URL;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(APP_URL) === 0 && 'focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
