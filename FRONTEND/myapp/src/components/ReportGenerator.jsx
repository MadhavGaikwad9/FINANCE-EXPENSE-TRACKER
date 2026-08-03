import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ReportGenerator() {
  const [exporting, setExporting] = useState(false);

  const generatePDF = async () => {
    const dashboard = document.getElementById("dashboard");

    if (!dashboard) {
      alert("Error: Core Dashboard container not found in DOM");
      return;
    }

    setExporting(true);

    try {
      // Temporarily hide buttons/inputs during capture for a cleaner report
      const elementsToHide = document.querySelectorAll(".btn-primary, .btn-secondary, select, input, form, button");
      elementsToHide.forEach(el => el.style.opacity = "0.05");

      const canvas = await html2canvas(dashboard, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#0b0f19" : "#f8fafc"
      });

      // Restore elements visibility
      elementsToHide.forEach(el => el.style.opacity = "1");

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 190; // Page width with margins
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 15; // margin

      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(99, 102, 241); // Indigo color code
      pdf.text("PERSONAL WEALTH STATUS REPORT", 10, 15);
      
      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated on: ${new Date().toLocaleString()} | Finance Flow Intelligence`, 10, 20);

      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Finance_Flow_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation failure:", error);
      alert("Failed to render PDF: " + error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="btn-secondary"
      style={styles.btn}
      disabled={exporting}
    >
      <span>{exporting ? "Compiling Assets..." : "📥 Download Statement Report"}</span>
    </button>
  );
}

const styles = {
  btn: {
    width: "100%",
    justifyContent: "center",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "10px",
  }
};

export default ReportGenerator;