export const envioGratis = (costoEnvio: string) => {
  return costoEnvio === "G" ? (
    <span className="text-green-500 font-semibold inline-flex items-center gap-2">
      <img
        src="/images/camion.png"
        alt="camion"
        className="w-10 h-10 inline-block"
      />
      Envío gratis
    </span>
  ) : (
    <span className="text-red-500 font-semibold inline-flex items-center gap-2">
      <img
        src="/images/camion.png"
        alt="camion"
        className="w-10 h-10 inline-block"
      />
      Costo de envío al interior del país: ${costoEnvio}
    </span>
  );
};
