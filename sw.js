// nidoestudio.ar antes servía la app con un service worker. Ahora es la landing:
// este archivo reemplaza al viejo, se da de baja solo y recarga las pestañas para que vean la página nueva.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })(),
  );
});
