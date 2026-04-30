import { useState } from "react";
import dniImage from "../assets/dni.png";
import dnieImage from "../assets/dnie.png";

const usePreviumDocument = (initialDniType: "normal" | "electronico") => {
  const [dniType, setDniType] = useState<"normal" | "electronico">(
    initialDniType,
  );

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: 600, md: 700 },
    maxHeight: "90vh",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: { xs: 2, sm: 3 },
    outline: "none",
  };

  const handleDniTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "normal" | "electronico" | null,
  ) => {
    if (newType !== null) {
      setDniType(newType);
    }
  };

  const titleDocument = dniType === "normal" ? "DNI Normal" : "DNI Electrónico";
  const dniImageSrc = dniType === "normal" ? dniImage : dnieImage;

  return {
    dniType,
    modalStyle,
    handleDniTypeChange,
    titleDocument,
    dniImageSrc,
  };
};

export default usePreviumDocument;
