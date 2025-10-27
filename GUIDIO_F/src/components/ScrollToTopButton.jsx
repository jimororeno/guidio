import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // --- Detecta si el usuario ha hecho scroll suficiente ---
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) { // se muestra después de 300px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Cleanup
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // --- Función para hacer scroll suave arriba ---
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // animación suave
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            zIndex: 1000,
            backgroundColor: "var(--primary-color)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
          aria-label="Volver arriba"
        >
         <i className="bi bi-caret-up-fill"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
