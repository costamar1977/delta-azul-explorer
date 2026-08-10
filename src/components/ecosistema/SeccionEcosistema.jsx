export default function SeccionEcosistema() {
  return (
    <div className="pantalla">
      <h2>Sobre este ecosistema</h2>
      <p>
        Camping Delta del Azul está dentro del Parque Nacional Lago Puelo, en un punto donde se
        cruzan dos mundos: el bosque andino-patagónico de lengas, ñires y cipreses, y manchones de
        selva valdiviana, con especies como el canelo, la tepa, el avellano y helechos película que
        necesitan mucha humedad para vivir.
      </p>
      <p>
        Esta zona es, junto con el Parque Nacional Los Alerces, uno de los últimos puntos donde la
        selva valdiviana penetra tan al sur y tan al este del lado argentino de la cordillera — acá
        hasta crece, en sitios muy protegidos, el copihue, la flor nacional de Chile, en el límite
        oriental de su distribución.
      </p>
      <p>
        Por eso vas a encontrar en el catálogo especies marcadas como "indicadoras valdivianas": son
        las que solo aparecen donde el bosque es especialmente húmedo y cerrado, y su presencia es
        una buena señal de que ese rincón del bosque está sano.
      </p>
      <h3>¿Viste algo raro o dañado?</h3>
      <p>
        Si encontrás una especie fuera de lo común, un ejemplar dañado, o algo que te llama la
        atención, contanos:
      </p>
      <a
        className="boton-grande"
        style={{ display: "inline-block", textDecoration: "none" }}
        href="mailto:administracion@campingdeltadelazul.com.ar?subject=Reporte%20de%20avistamiento%20-%20Delta%20del%20Azul&body=Especie%3A%0ALugar%3A%0AFecha%3A%0ADescripci%C3%B3n%3A"
      >
        ✉️ Reportar avistamiento
      </a>
      <p style={{ fontSize: "0.78rem", color: "#888", marginTop: 24 }}>
        Los contenidos de este catálogo fueron generados como punto de partida y deben ser revisados
        por una fuente idónea (guardaparques de APN o guía de campo publicada) antes de considerarse
        una referencia definitiva de identificación.
      </p>
    </div>
  );
}
