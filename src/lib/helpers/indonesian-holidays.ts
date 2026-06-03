// Hari raya Indonesia yang akurat
// Data ini perlu diupdate setiap tahun untuk hari raya yang bergantung pada kalender Islam

export interface Holiday {
  name: string;
  date: string; // Format: YYYY-MM-DD
  category: "keagamaan" | "nasional" | "internasional" | "musiman";
  affected_categories: string[];
  impact_multiplier: number;
}

export function getIndonesianHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [
    // Hari Nasional (tetap setiap tahun)
    {
      name: "Tahun Baru Masehi",
      date: `${year}-01-01`,
      category: "internasional",
      affected_categories: ["Makanan", "Minuman", "Fashion", "Elektronik"],
      impact_multiplier: 1.5,
    },
    {
      name: "Hari Buruh Internasional",
      date: `${year}-05-01`,
      category: "internasional",
      affected_categories: ["Makanan", "Minuman"],
      impact_multiplier: 1.2,
    },
    {
      name: "Hari Kebangkitan Nasional",
      date: `${year}-05-20`,
      category: "nasional",
      affected_categories: ["Makanan", "Minuman"],
      impact_multiplier: 1.2,
    },
    {
      name: "Hari Lahir Pancasila",
      date: `${year}-06-01`,
      category: "nasional",
      affected_categories: ["Makanan", "Minuman"],
      impact_multiplier: 1.1,
    },
    {
      name: "Hari Kemerdekaan Indonesia",
      date: `${year}-08-17`,
      category: "nasional",
      affected_categories: ["Makanan", "Minuman", "Fashion", "Elektronik"],
      impact_multiplier: 1.8,
    },
    {
      name: "Hari Batik Nasional",
      date: `${year}-10-02`,
      category: "nasional",
      affected_categories: ["Fashion"],
      impact_multiplier: 1.3,
    },
    {
      name: "Hari Pahlawan",
      date: `${year}-11-10`,
      category: "nasional",
      affected_categories: ["Makanan", "Minuman"],
      impact_multiplier: 1.1,
    },
    {
      name: "Hari Guru Nasional",
      date: `${year}-11-25`,
      category: "nasional",
      affected_categories: ["ATK", "Elektronik"],
      impact_multiplier: 1.2,
    },
    {
      name: "Hari Ibu",
      date: `${year}-12-22`,
      category: "nasional",
      affected_categories: ["Fashion", "Kesehatan", "Elektronik", "Makanan"],
      impact_multiplier: 1.5,
    },
    {
      name: "Hari Natal",
      date: `${year}-12-25`,
      category: "keagamaan",
      affected_categories: ["Makanan", "Minuman", "Fashion", "Elektronik"],
      impact_multiplier: 2.0,
    },
  ];

  // Hari raya Islam (perlu update setiap tahun)
  // Tahun 2026 (berdasarkan perhitungan kalender Islam)
  if (year === 2026) {
    holidays.push(
      {
        name: "Tahun Baru Islam 1447 H",
        date: "2026-06-16",
        category: "keagamaan",
        affected_categories: ["Makanan", "Minuman", "Fashion"],
        impact_multiplier: 1.3,
      },
      {
        name: "Maulid Nabi Muhammad SAW",
        date: "2026-08-25",
        category: "keagamaan",
        affected_categories: ["Makanan", "Minuman", "Fashion"],
        impact_multiplier: 1.2,
      },
    );
  }


  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingHolidays(daysAhead: number = 30): Holiday[] {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);

  const currentYear = today.getFullYear();
  const nextYear = currentYear + 1;

  const holidays = [
    ...getIndonesianHolidays(currentYear),
    ...getIndonesianHolidays(nextYear),
  ];

  return holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= today && holidayDate <= futureDate;
  });
}

export function formatHolidayForPrompt(holidays: Holiday[]): string {
  if (holidays.length === 0) {
    return "TIDAK ADA hari besar dalam 30 hari ke depan.";
  }

  return holidays
    .map(
      (holiday) =>
        `- ${holiday.name} (${holiday.date}): ${holiday.category}, multiplier: ${holiday.impact_multiplier}x, kategori terdampak: ${holiday.affected_categories.join(", ")}`
    )
    .join("\n");
}
