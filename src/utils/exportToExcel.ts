import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type DataItem = {
  username: string;
  isWinning: boolean;
  attempt: number;
  time: number;
  nohp: string;
  createdAt: FirebaseTimestamp;
};

type MappedDataItem = {
  username: string;
  isWinning: string;
  attempt: number;
  waktu: string;
  waktuDetik: number;
  nohp: string;
};

export const exportToExcel = (rawData: DataItem[]) => {
  const mappedData: MappedDataItem[] = rawData.map((item) => {
    const dateObj = new Date(item.createdAt.seconds * 1000);
    const dateOnly = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      username: item.username,
      isWinning: item.isWinning ? "Yes" : "No",
      attempt: item.attempt,
      waktu: dateOnly,
      waktuDetik: item.time,
      nohp: item.nohp,
    };
  });

  const sortedData = mappedData.sort((a, b) => {
    return new Date(a.waktu).getTime() - new Date(b.waktu).getTime();
  });

  const worksheet = XLSX.utils.json_to_sheet(sortedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(fileData, "data.xlsx");
};
