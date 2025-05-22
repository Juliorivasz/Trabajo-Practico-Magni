export function Ubicacion() {
  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-cyan-100">
      <h2 className="text-2xl font-bold">¿Dónde estamos?</h2>

      <p className="text-lg text-gray-800 text-center max-w-xl">
        Estamos ubicados en el corazón de la ciudad, en la siguiente dirección:
        <br />
        <strong>Av. Colón y Mitre - Mendoza, Argentina</strong>
      </p>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d296.1139329620285!2d-68.84552599156802!3d-32.89428886838277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1747594072089!5m2!1ses!2sar"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded shadow-md max-w-4xl"
      ></iframe>
    </div>
  );
}

