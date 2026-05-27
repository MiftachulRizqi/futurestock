import type {
  ForecastRange,
  SalesForecastPoint,
} from "@/data/dashboard-insights";
import type { Product } from "@/types/product";
import type { SaleWithItems } from "@/types/sales";

type ForecastChartData = Record<ForecastRange, SalesForecastPoint[]>;

type PeriodBucket = {
  key: string;
  label: string;
  period: string;
  start: Date;
  end: Date;
};

type ProductMeta = {
  id: string;
  name: string;
  category: string;
};

const locale = "id-ID";

export function getActualVsPredictionChartData(
  products: Product[],
  sales: SaleWithItems[],
  now = new Date()
): ForecastChartData {
  if (sales.length === 0) {
    return createEmptyForecastData();
  }

  const productMetaById = getProductMetaById(products, sales);

  return {
    daily: createRangePoints(
      "daily",
      createDailyPeriods(now),
      sales,
      productMetaById
    ),
    weekly: createRangePoints(
      "weekly",
      createWeeklyPeriods(now),
      sales,
      productMetaById
    ),
    monthly: createRangePoints(
      "monthly",
      createMonthlyPeriods(now),
      sales,
      productMetaById
    ),
  };
}

export function getLatestPredictionTotal(points: SalesForecastPoint[]) {
  const latestDate = points.reduce(
    (latest, point) => (point.date > latest ? point.date : latest),
    ""
  );

  if (!latestDate) {
    return 0;
  }

  return points
    .filter((point) => point.date === latestDate)
    .reduce((total, point) => total + (point.prediction ?? 0), 0);
}

function createRangePoints(
  range: ForecastRange,
  periods: PeriodBucket[],
  sales: SaleWithItems[],
  productMetaById: Map<string, ProductMeta>
): SalesForecastPoint[] {
  const { quantitiesByProductAndPeriod, soldProductIds } =
    getQuantitiesByProductAndPeriod(periods, sales);

  return Array.from(soldProductIds)
    .map((productId) => productMetaById.get(productId))
    .filter((meta): meta is ProductMeta => Boolean(meta))
    .sort((first, second) => first.name.localeCompare(second.name, locale))
    .flatMap((product) => {
      const history: number[] = [];

      const periodPoints = periods.map((period) => {
        const actual =
          quantitiesByProductAndPeriod.get(`${product.id}:${period.key}`) ?? 0;
        const prediction = getMovingAveragePrediction(history);

        history.push(actual);

        return {
          id: `${range}-${period.key}-${product.id}`,
          date: period.key,
          label: period.label,
          period: period.period,
          category: product.category,
          productName: product.name,
          actual,
          prediction,
          error: prediction === null ? null : actual - prediction,
        };
      });

      const nextPeriod = getNextPeriod(range, periods[periods.length - 1]);
      const nextPrediction = getMovingAveragePrediction(history);

      if (!nextPeriod || nextPrediction === null) {
        return periodPoints;
      }

      return [
        ...periodPoints,
        {
          id: `${range}-${nextPeriod.key}-${product.id}`,
          date: nextPeriod.key,
          label: nextPeriod.label,
          period: nextPeriod.period,
          category: product.category,
          productName: product.name,
          actual: null,
          prediction: nextPrediction,
          error: null,
        },
      ];
    });
}

function getQuantitiesByProductAndPeriod(
  periods: PeriodBucket[],
  sales: SaleWithItems[]
) {
  const quantitiesByProductAndPeriod = new Map<string, number>();
  const soldProductIds = new Set<string>();

  sales.forEach((sale) => {
    const saleDate = new Date(sale.sale_date);
    const period = periods.find(
      (item) => saleDate >= item.start && saleDate <= item.end
    );

    if (!period) {
      return;
    }

    sale.sales_items.forEach((item) => {
      const quantity = Number(item.quantity);

      if (quantity <= 0) {
        return;
      }

      const key = `${item.product_id}:${period.key}`;

      soldProductIds.add(item.product_id);
      quantitiesByProductAndPeriod.set(
        key,
        (quantitiesByProductAndPeriod.get(key) ?? 0) + quantity
      );
    });
  });

  return {
    quantitiesByProductAndPeriod,
    soldProductIds,
  };
}

function getProductMetaById(products: Product[], sales: SaleWithItems[]) {
  const productMetaById = new Map<string, ProductMeta>();

  products.forEach((product) => {
    productMetaById.set(product.id, {
      id: product.id,
      name: product.name,
      category: product.category,
    });
  });

  sales.forEach((sale) => {
    sale.sales_items.forEach((item) => {
      if (productMetaById.has(item.product_id)) {
        return;
      }

      productMetaById.set(item.product_id, {
        id: item.product_id,
        name: item.products.name,
        category: item.products.category,
      });
    });
  });

  return productMetaById;
}

function getMovingAveragePrediction(history: number[]) {
  const usableHistory = history.filter((value) => value > 0);

  if (usableHistory.length === 0) {
    return null;
  }

  const recentHistory = usableHistory.slice(-3);
  const average =
    recentHistory.reduce((total, value) => total + value, 0) /
    recentHistory.length;

  return Math.round(average);
}

function createDailyPeriods(now: Date): PeriodBucket[] {
  const today = startOfDay(now);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);

    return {
      key: formatDateKey(date),
      label: formatShortDate(date),
      period: formatLongDate(date),
      start: startOfDay(date),
      end: endOfDay(date),
    };
  });
}

function createWeeklyPeriods(now: Date): PeriodBucket[] {
  const currentWeekStart = startOfWeek(now);

  return Array.from({ length: 4 }, (_, index) => {
    const start = addDays(currentWeekStart, (index - 3) * 7);
    const end = endOfDay(addDays(start, 6));

    return {
      key: formatDateKey(start),
      label: formatShortDate(start),
      period: `${formatShortDate(start)} - ${formatShortDate(end)}`,
      start,
      end,
    };
  });
}

function createMonthlyPeriods(now: Date): PeriodBucket[] {
  const currentMonthStart = startOfMonth(now);

  return Array.from({ length: 6 }, (_, index) => {
    const start = addMonths(currentMonthStart, index - 5);
    const end = endOfMonth(start);

    return {
      key: formatMonthKey(start),
      label: formatMonthLabel(start),
      period: formatMonthPeriod(start),
      start,
      end,
    };
  });
}

function createEmptyForecastData(): ForecastChartData {
  return {
    daily: [],
    weekly: [],
    monthly: [],
  };
}

function getNextPeriod(range: ForecastRange, current?: PeriodBucket) {
  if (!current) {
    return null;
  }

  if (range === "daily") {
    const date = addDays(current.start, 1);

    return {
      key: formatDateKey(date),
      label: formatShortDate(date),
      period: formatLongDate(date),
      start: startOfDay(date),
      end: endOfDay(date),
    };
  }

  if (range === "weekly") {
    const start = addDays(current.start, 7);
    const end = endOfDay(addDays(start, 6));

    return {
      key: formatDateKey(start),
      label: "Minggu depan",
      period: `${formatShortDate(start)} - ${formatShortDate(end)}`,
      start,
      end,
    };
  }

  const start = addMonths(current.start, 1);
  const end = endOfMonth(start);

  return {
    key: formatMonthKey(start),
    label: formatMonthLabel(start),
    period: formatMonthPeriod(start),
    start,
    end,
  };
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

function startOfWeek(date: Date) {
  const dayOffset = (date.getDay() + 6) % 7;

  return addDays(startOfDay(date), -dayOffset);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
  }).format(date);
}

function formatMonthPeriod(date: Date) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}
