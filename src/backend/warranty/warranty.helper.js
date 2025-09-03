import { format, parse } from "date-fns";

export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return format(d, "dd-MM-yyyy");
};

export const parseAndFormatDateForDB = (dateString) => {
  if (!dateString) return null;
  const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
  if (isNaN(parsedDate.getTime())) {
    console.error(`Failed to parse date string: ${dateString}`);
    return null;
  }
  return format(parsedDate, "yyyy-MM-dd");
};

export const formatWarrantyForResponse = (warranty) => {
  if (!warranty) return null;
  const formatted = {
    ...warranty,
    dateOfPurchase: formatDate(warranty.dateOfPurchase),
    warrantyExpireDate: formatDate(warranty.warrantyExpireDate),
  };
  const BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:3000";
  if (formatted.pdfFilePath) {
    formatted.pdfFilePath = `${BASE_URL}/${formatted.pdfFilePath.replace(
      /^\/+/,
      ""
    )}`;
  } else {
    delete formatted.pdfFilePath;
  }
  return formatted;
};
